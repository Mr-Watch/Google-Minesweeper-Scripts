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
