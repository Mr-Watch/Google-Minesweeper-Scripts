// ==UserScript==
// @name         Google Minesweeper Advanced Theme
// @version      1.0
// @description  Allows you to specify the color palette of the everything but the board
// @author       Mr-Watch
// @match        https://www.google.com/fbx?fbx=minesweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-body

// ==/UserScript==

(async function () {
  "use strict";

  let theme = {
    initial_loading: "#000000",
    background: "#000000",
    button_bar: "#000000",
    // text: "#000000",
    // controls_hint: "#000000",
    // controls_hint_dig: "#000000",
    // controls_hint_flag: "#000000",
    // difficulty: "#000000",
    // difficulty_active: "#000000",
    // difficulty_text: "#000000",
    // difficulty_dropdown: "#000000",
    // difficulty_dropdown_text: "#000000",
    // try_again: "#000000",
    // try_again_text: "#000000",
    // win_screen_text: "#000000",
    // end_overlay: "#000000",
    // flag_icon: "#000000",
    // sound_icon: "#000000",
    // share_icon: "#000000",
    // retry_icon: "#000000",
    // zoom_in_icon: "#000000",
    // zoom_out_icon: "#000000",
    // difficulty_check: "#000000",
    // difficulty_shadow: "#000000",
    // difficulty_arrow: "#000000",
  };

  let elementMappings = {
    difficulty_dropdown: [".wplJBd", "background-color", 0],
    difficulty_active: [".CjiZvb", "background-color", 0],
    initial_loading: [".DQizdb", "background-color", 0],
    difficulty_dropdown_text: [".UjBGL", "color", 0],
    button_bar: [".NWJp1d", "background-color", 0],
    difficulty: [".tgTlrc", "background-color", 0],
    try_again: [".HhuoRb", "background-color", 0],
    background: ["body", "background-color", 0],
    difficulty_text: [".CcNe6e", "color", 0],
    win_screen_text: [".Uobaif", "color", 0],
    try_again_text: [".HhuoRb h2", "color", 0],
    share_icon: [".Zk3Vv", "fill", 0],
    text: [".KAQ14c", "color", 0],
    end_overlay: [".Qwh28e", "background-color", 1],
    flag_icon: [".HhuoRb img", "filter", 2],
    sound_icon: [".xQjEtd", "filter", 2],
    retry_icon: [".ybzjtc", "filter", 2],
    difficulty_check: [".GZnQqe.CB8nDe", "filter", 3],
    controls_hint_flag: [".Qh8bJb", "filter", 3],
    controls_hint_dig: [".vBF7Ae", "filter", 3],
    controls_hint: [".HvRS9b", "filter", 3],
    difficulty_shadow: [".pkWBse", "box-shadow", 4],
    difficulty_arrow: [".tgTlrc .fHwb5b", "border-color", 5],
    zoom_in_icon: "",
    zoom_out_icon: "",
  };

  let scriptElement = document.createElement("script");
  scriptElement.src =
    "https://cdn.jsdelivr.net/gh/Mr-Watch/Google-Minesweeper-Scripts@main/filter.js";
  scriptElement.addEventListener("load", () => {
    let customStyleSheet = ``;

    function isValidHexColor(color) {
      return /^#([\d,a-fA-F]{6}|[\d,a-fA-F]{8})$/.test(color);
    }

    function computeThemeToCustomStyleSheet(theme) {
      Object.entries(theme).forEach((property) => {
        let propertyName = elementMappings[property[0]];
        let color = property[1];

        if (
          propertyName != undefined &&
          color != undefined &&
          isValidHexColor(color)
        ) {
          let caseSelector = elementMappings[property[0]][2];
          let classIdentifier = elementMappings[property[0]][0];
          let cssAction = elementMappings[property[0]][1];

          switch (caseSelector) {
            case 0:
              customStyleSheet += `${classIdentifier} { ${cssAction} : ${color} !important; }`;
              break;
            case 1:
              customStyleSheet += `${classIdentifier} { ${cssAction} : ${color} !important;
            width : 100.1% !important;
            height : 100.1% !important; }`;
              break;
            case 2:
              document.querySelector(classIdentifier).style.filter =
                computedFilter(classIdentifier, color);
              break;
            case 3:
              customStyleSheet += `${classIdentifier} { ${cssAction} : ${computedFilter(
                classIdentifier,
                color
              )} !important;
            background-blend-mode: exclusion; }`;
              customStyleSheet += `.HvRS9b { background-color: #0000 !important; }`;
              document
                .querySelector(".rgF5re")
                .appendChild(
                  stringToNode(
                    `<div class="HvRS9b" style="z-index: -1; background-color: ${color} !important;"></div>;`
                  )
                );
              break;
            case 4:
              customStyleSheet += `${classIdentifier} { ${cssAction} : 0 20px 1px 0 ${color} !important; }`;
              break;
            case 5:
              customStyleSheet += `${classIdentifier} { ${cssAction} : ${color} transparent !important; }`;
              break;
          }
        } else {
          alert(`You have a misconfigured theme.
Make sure you include valid properties and the colors are in hexadecimal notation (#FAC000AA).
Read the documentation here:
Misconfigured value pair:

${property}`);
        }
      });
    }

    function computedFilter(
      iconSelector,
      hexColor,
      selectorSpecifier = undefined
    ) {
      let iconElement = document.querySelector(iconSelector);

      if (selectorSpecifier != undefined) {
        iconElement =
          document.querySelectorAll(iconSelector)[selectorSpecifier];
      }

      let opacity = 1;
      if (hexColor.length === 9) {
        opacity = hexColor.slice(7);
        opacity = Number(`0x${opacity}`) / 255;
        hexColor = hexColor.substring(0, 7);
      }

      let rgb = hexToRgb(hexColor);
      let color = new Color(rgb[0], rgb[1], rgb[2]);
      let solver = new Solver(color);
      let result = solver.solve();
      let filter = result.filter;
      filter =
        "brightness(0) saturate(100%) " +
        filter.replaceAll(";", "").replaceAll("filter: ", "") +
        ` opacity(${opacity})`;

      return filter;
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

    computeThemeToCustomStyleSheet(theme);
    document.body.appendChild(stringToStyleSheetNode(customStyleSheet));

    let attemptCounter = 3;
    let checkInterval = setInterval(() => {
      if (attemptCounter === 0) {
        clearInterval(checkInterval);
      }
      try {
        if (document.querySelectorAll(".zoom") != null) {
          document.querySelectorAll(".zoom img")[0].style.filter =
            computedFilter(".zoom img", theme.zoom_in_icon, 0);
          document.querySelectorAll(".zoom img")[1].style.filter =
            computedFilter(".zoom img", theme.zoom_out_icon, 1);
        }
        clearInterval(checkInterval);
      } catch (error) {}
      attemptCounter -= 1;
    }, 100);
  });
  document.body.appendChild(scriptElement);
})();
