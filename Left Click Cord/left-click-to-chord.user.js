// ==UserScript==
// @name         Google Minesweeper Left Click to Chord
// @version      1.0
// @description  Allows you to chord by left clicking
// @author       Mr-Watch
// @match        https://www.google.com/fbx?fbx=minesweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-end
// @unwrap
// @downloadURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Left%20Click%20Cord/left-click-to-chord.js
// @updateURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Left%20Click%20Cord/left-click-to-chord.js

// ==/UserScript==

(function () {
  "use strict";

  function middleClick(element) {
    let x = document.body.getAttribute("x");
    let y = document.body.getAttribute("y");
    let event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: false,
      view: window,
      button: 1,
      buttons: 1,
      clientX: x,
      clientY: y,
    });

    setTimeout(() => {
      let event = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: false,
        view: window,
        button: 1,
        buttons: 1,
        clientX: x,
        clientY: y,
      });
      element.dispatchEvent(event);
    }, 50);
    element.dispatchEvent(event);
  }

  let canvas = document.querySelector(".ecwpfc");

  document.onmousemove = (event) => {
    document.body.setAttribute("x", event.clientX);
    document.body.setAttribute("y", event.clientY);
  };

  canvas.onclick = () => {
    middleClick(canvas);
  };
})();
