// ==UserScript==
// @name         Google Minesweeper Zoom
// @version      1.0
// @description  Allows you to make the board larger or smaller
// @author       Mr-Watch
// @match        https://www.google.com/fbx?fbx=minesweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none

// ==/UserScript==

(function () {
  "use strict";

  if (window.zoom !== undefined) return;
  window.zoom = true;

  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 90) {
      resetZoom();
    } else if (e.keyCode === 61 || e.keyCode === 107) {
      zoomIn();
    } else if (e.keyCode === 173 || e.keyCode === 109) {
      zoomOut();
    } else if (e.keyCode === 84) {
      toggleZoomButtonsVisibility();
    }
  });

  let gameBoard = document.querySelector(".onDwW");
  let currentZoomValue = 1;
  let difficulty = "medium";
  let gameBoardZoomValues = setupVariableInLS("gameBoardZoomValues", {
    easy: 1,
    medium: 1,
    hard: 1,
  });
  let buttonsAreVisible = setupVariableInLS("buttonsAreVisible", true);

  let zoomInButtonString = `<div class="oO5WXb zoom" aria-label="Zoom In" title="Zoom In" role="button" tabindex="0"><img class="xQjEtd" src="//www.gstatic.com/images/icons/material/system/2x/zoom_in_white_24dp.png" alt="" data-defer="1"></div>`;
  let zoomOutButtonString = `<div class="oO5WXb zoom" aria-label="Zoom Out" title="Zoom Out" role="button" tabindex="0"><img class="xQjEtd" src="//www.gstatic.com/images/icons/material/system/2x/zoom_out_white_24dp.png" alt="" data-defer="1"></div>`;

  let zoomInButton = stringToNode(zoomInButtonString);
  let zoomOutButton = stringToNode(zoomOutButtonString);

  let zoomButtonStyles = `
  .zoom {float : left;
  position : relative;
  cursor : pointer;}`;

  document.body.appendChild(stringToStyleSheetNode(zoomButtonStyles));

  zoomInButton.style.left = "-1%";
  zoomOutButton.style.paddingRight = "1%";

  zoomInButton.addEventListener("click", zoomIn);
  zoomOutButton.addEventListener("click", zoomOut);

  let flagElement = document.querySelector("img.ybzjtc:nth-child(1)");
  flagElement.addEventListener("click", toggleZoomButtonsVisibility);
  flagElement.style.cursor = "pointer";
  flagElement.style.zIndex = "999";

  let clockElement = document.querySelector("img.ybzjtc:nth-child(3)");
  clockElement.addEventListener("click", resetZoom);
  clockElement.style.cursor = "pointer";
  clockElement.style.zIndex = "999";

  let buttonAnchorElement = document.querySelector(".JfmvR");

  buttonAnchorElement.insertAdjacentElement("afterend", zoomOutButton);
  buttonAnchorElement.insertAdjacentElement("afterend", zoomInButton);

  if (!buttonsAreVisible) {
    toggleZoomButtonsVisibility();
    toggleZoomButtonsVisibility();
  }

  let canvasElement = document.querySelector(".ecwpfc");

  updateGameBoardZoom();

  function updateGameBoardZoom() {
    switch (canvasElement.style.width) {
      case "540px":
        difficulty = "medium";
        break;
      case "450px":
        difficulty = "easy";
        break;
      case "600px":
        difficulty = "hard";
        break;
    }

    gameBoard.style.transform = `translate(-50%,-50%) scale(${gameBoardZoomValues[difficulty]}`;
    currentZoomValue = gameBoardZoomValues[difficulty];
  }

  let canvasSizeObserver = new MutationObserver(updateGameBoardZoom);

  canvasSizeObserver.observe(canvasElement, {
    attributeFilter: ["width"],
    attributeOldValue: true,
    subtree: true,
  });

  function zoomIn() {
    gameBoard.style.transform = `translate(-50%,-50%) scale(${(currentZoomValue += 0.05)})`;
    gameBoardZoomValues[difficulty] = currentZoomValue;
    writeVariableInLS("gameBoardZoomValues", gameBoardZoomValues);
  }

  function zoomOut() {
    gameBoard.style.transform = `translate(-50%,-50%) scale(${(currentZoomValue -= 0.05)}`;
    gameBoardZoomValues[difficulty] = currentZoomValue;
    writeVariableInLS("gameBoardZoomValues", gameBoardZoomValues);
  }

  function resetZoom() {
    gameBoard.style.transform = "translate(-50%,-50%) scale(1)";
    currentZoomValue = 1;
    gameBoardZoomValues[difficulty] = currentZoomValue;
    writeVariableInLS("gameBoardZoomValues", gameBoardZoomValues);
  }

  function toggleZoomButtonsVisibility() {
    if (buttonsAreVisible) {
      zoomInButton.style.display = "none";
      zoomOutButton.style.display = "none";
      buttonsAreVisible = false;
      writeVariableInLS("buttonsAreVisible", buttonsAreVisible);
    } else {
      zoomInButton.style.display = "";
      zoomOutButton.style.display = "";
      buttonsAreVisible = true;
      writeVariableInLS("buttonsAreVisible", buttonsAreVisible);
    }
  }

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

  function stringToNode(nodeString) {
    let doc = new DOMParser().parseFromString(nodeString, "text/html");
    return doc.body.firstChild;
  }

  function stringToStyleSheetNode(styleSheetString) {
    let styleSheetNode = document.createElement("style");
    styleSheetNode.innerHTML = styleSheetString;
    return styleSheetNode;
  }
})();
