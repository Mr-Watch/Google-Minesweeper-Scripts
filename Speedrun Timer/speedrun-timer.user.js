// ==UserScript==
// @name         Google Minesweeper Speedrun Timer
// @version      1.0
// @description  Adds a rather accurate speedrunning timer
// @author       Mr-Watch
// @match        https://www.google.com/fbx?fbx=minesweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Speedrun%20Timer/speedrun-timer.js
// @updateURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Speedrun%20Timer/speedrun-timer.js

// ==/UserScript==

(async function () {
  "use strict";
  if (unsafeWindow.speedrunTimer !== undefined) return;
  unsafeWindow.speedruntimer = true;

  let pageScripts = document.querySelectorAll("script[src]");
  let scriptNode = {};

  for (let script of pageScripts) {
    if (script.src.slice(-3) === "csi") {
      scriptNode = script;
      break;
    }
  }

  let scriptSourceAttribute = await fetch(scriptNode.src);
  let scriptSourceText = await scriptSourceAttribute.text();
  let keyTextIndex = scriptSourceText.indexOf(
    `=function(a,b,c){if(typeof b==="string")`
  );
  let entryFunctionName = scriptSourceText.slice(
    keyTextIndex - 2,
    keyTextIndex
  );
  let originalEntryFunction = unsafeWindow._s[[entryFunctionName]];
  let initialTrigger = false;
  let secondTrigger = false;

  unsafeWindow._s[[entryFunctionName]] = (a, b, c) => {
    if (!initialTrigger) {
      initialTrigger = true;
      originalEntryFunction(a, b, c);
    } else if (!secondTrigger) {
      secondTrigger = true;
      originalEntryFunction(a, b, c);
    } else {
      stopTimer();
      computeNextTimerUpdate();
      originalEntryFunction(a, b, c);
    }
  };

  let msBetweenUpdates = setupVariableInLS("msBetweenUpdates", 100);
  let menuCommand = 0;

  function registerMenuCommand() {
    menuCommand = GM_registerMenuCommand(
      `Change the update interval of the timer : ${msBetweenUpdates}ms`,
      function () {
        msBetweenUpdates = prompt(
          "Input an integer value representing the amount of ms between each update\n(e.g. 1000  for 1 second)",
          msBetweenUpdates
        );

        if (
          !/^[\d]{1,16}$/.test(msBetweenUpdates) ||
          !Number.isSafeInteger(parseInt(msBetweenUpdates))
        ) {
          alert(
            "The value provided is NOT a valid integer\nUsing default value of 100ms"
          );
          msBetweenUpdates = 100;
        }

        writeVariableInLS("msBetweenUpdates", parseInt(msBetweenUpdates));
        updateMenuCommands();
      },
      {
        autoclose: true,
      }
    );
  }

  function updateMenuCommands() {
    GM_unregisterMenuCommand(menuCommand);
    registerMenuCommand();
  }

  registerMenuCommand();

  let oldTimerNode = document.querySelector("div.KAQ14c:nth-child(4)");
  let canvasNode = document.querySelector(".ecwpfc");
  let restartButton = document.querySelector(".HhuoRb");

  restartButton.addEventListener("click", clearTimer);
  oldTimerNode.style.display = "none";

  let newTimerNode = oldTimerNode.cloneNode(true);

  newTimerNode.style.position = "absolute";
  newTimerNode.style.paddingLeft = "69%";
  newTimerNode.style.display = "block";
  newTimerNode.textContent = "0:00.000";
  newTimerNode.style.width = "100%";
  newTimerNode.style.top = "20px";
  oldTimerNode.parentNode.appendChild(newTimerNode);

  let timerInterval = 0;
  let start = 0;
  let minutes = 0;

  function computeNextTimerUpdate() {
    let offset = Date.now() - start;
    let seconds = Math.floor(offset / 1000);
    let ms = offset % 1000;
    ms = ms.toString().padStart(3, 0);

    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
      start = Date.now();
    }

    seconds = seconds.toString().padStart(2, 0);
    newTimerNode.textContent = `${minutes}:${seconds}.${ms}`;
  }

  function startTimer() {
    start = Date.now();
    timerInterval = setInterval(computeNextTimerUpdate, msBetweenUpdates);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function clearTimer() {
    minutes = 0;
    newTimerNode.textContent = "0:00.000";
    canvasNode.addEventListener("click", canvasEventHandler);
  }

  let canvasEventHandler = () => {
    startTimer();
    canvasNode.removeEventListener("click", canvasEventHandler);
  };

  canvasNode.addEventListener("click", canvasEventHandler);

  let canvasSizeObserver = new MutationObserver(() => {
    stopTimer();
    clearTimer();
  });

  canvasSizeObserver.observe(canvasNode, {
    attributeFilter: ["width"],
    attributeOldValue: true,
    subtree: true,
  });

  function writeVariableInLS(variableName, originalVariable) {
    window.localStorage.setItem(variableName, JSON.stringify(originalVariable));
  }

  function setupVariableInLS(variableName, variableValue) {
    if (!window.localStorage.getItem(variableName)) {
      window.localStorage.setItem(variableName, JSON.stringify(variableValue));
      return variableValue;
    } else {
      return JSON.parse(window.localStorage.getItem(variableName));
    }
  }
})();
