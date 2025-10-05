// ==UserScript==
// @name         Google Minesweeper Simple Theme
// @version      1.0
// @description  Allows you to specify the color palette of the board
// @author       Mr-Watch
// @match        https://www.google.com/fbx?fbx=minesweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addElement
// @run-at       document-start
// @downloadURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Simple%20Theme/simple-theme.user.js
// @updateURL https://github.com/Mr-Watch/Google-Minesweeper-Scripts/raw/refs/heads/main/Simple%20Theme/simple-theme.user.js

// ==/UserScript==

(function () {
  "use strict";

  const blocksColorMap = {
    light_not_dug: ["#AAD751", "#222831"],
    dark_not_dug: ["#A2D149", "#393E46"],
    // light_dug: ["#E5C29F", "#DBE2EF"],
    // dark_dug: ["#D7B899", "#3F72AF"],
    separator_line: ["#87AF3A", "#1976D2"],
    // win_screen_light: ["#90CAF9", "#71C9CE"],
    // win_screen_dark: ["#83C4F7", "#E3FDFD"],
  };

  // const numbersColorMap = {
  //   // _1: ["#1976D2", "#1976D2"],
  //   // _2: ["#388E3C", "#388E3C"],
  //   // _3: ["#D32F2F", "#D32F2F"],
  //   // _4: ["#7B1FA2", "#7B1FA2"],
  //   // _5: ["#FF8F00", "#FF8F00"],
  //   // _6: ["#0097A7", "#0097A7"],
  //   // _7: ["#424242", "#424242"],
  //   // _8: ["#9E9E9E", "#9E9E9E"],
  // };

  // let fireworksAndFlowersColorMap = [
  //   // ["#F4C20D", "#F4C20D"],
  //   // ["#DB3236", "#DB3236"],
  //   // ["#4885ED", "#4885ED"],
  //   // ["#ED44B5", "#ED44B5"],
  //   // ["#B648F2", "#B648F2"],
  //   // ["#48E6F1", "#48E6F1"],
  //   // ["#F4840D", "#F4840D"],
  //   // ["#008744", "#008744"],
  // ];

  function patchScript(event) {
    let src = event.target?.src;
    if (src.slice(-10) === "ghd?xjs=s3") {
      event.preventDefault();
      fetch(src)
        .then((res) => res.text())
        .then((text) => {
          try {
            Object.values(blocksColorMap).forEach((colorParing) => {
              text = text.replaceAll(colorParing[0], colorParing[1]);
            });
            Object.values(numbersColorMap).forEach((colorParing) => {
              text = text.replaceAll(colorParing[0], colorParing[1]);
            });
            Object.values(fireworksAndFlowersColorMap).forEach(
              (colorParing) => {
                text = text.replaceAll(colorParing[0], colorParing[1]);
              }
            );
          } catch (error) {
            console.warn("Your theme might be misconfigured...\nContinuing...");
          }
          GM_addElement("script", {
            textContent: text,
          });
        });
    }
  }
  document.addEventListener("beforescriptexecute", patchScript, true);
})();
