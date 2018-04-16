'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var eraser = document.getElementById('eraser');
  var context = canvas.getContext('2d');
  var isErase = false;
  var users = [];

  // Sets default color to black
  var current = {
    color: 'black'
  };

  var drawing = false;

  // Mouse click and movements event listeners
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

  // Listens to clicks on the different color buttons
  // Changes the current color to the chosen color
  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  // Listens to clicks on the eraser button
  // Toggles the eraser on
  // Users need to toggle off the eraser to resume drawing
  $('#eraser').click(function() {
    isErase = !isErase;
    $(this).toggleClass("btnPress");
  });

  // Listens to clicks on the print to pdf button
  // Calls the getPDFFileButton method
  $("#btnPrint").on("click", function () {
    getPDFFileButton();
  });

  // Listens to 'drawing' and 'erase' updates from websockets and updates the user's view
  socket.on('drawing', onDrawingEvent);
  socket.on('erase', onEraseEvent);

  // Resizes the page according to the window size
  window.addEventListener('resize', onResize, false);
  onResize();

  // If the eraser is toggled, erase is returned
  // Tracks mouse position
  // changes the color of the position to the color chosen
  // Emits the color change to other users
  function drawLine(x0, y0, x1, y1, color, emit){
    if(isErase) {
      return erase(x0, y0, x1, y1, emit);
    }
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  // Eraser function that makes the color in the mouse area transparent
  function erase(x0, y0, x1, y1, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 20;
    context.stroke();
    context.closePath();
    context.globalCompositeOperation = "source-over";
    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('erase', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
    });
  }

  // On mouse clicks
  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

  // On release of mouse click
  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
  }

  // On movement of the mouse
  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }

  // Changes current color to the chosen color
  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // Toggles eraser on and off
  function toggleErase(e) {
    isErase = !isErase;
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  // Draws on the canvas of the user based on data from the sockets
  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // Erases on the canvas of the user based on the data from the sockets
  function onEraseEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    erase(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Prints the page into PDF
  function getPDFFileButton () {
    return html2canvas($('body'), {
      background: "#ffffff",
      onrendered: function(canvas) {
        var myImage = canvas.toDataURL("image/jpeg,1.0");
        // Adjust width and height
        var imgWidth = (canvas.width * 37) / 200;
        var imgHeight = (canvas.height * 37) / 200; 
        // save and download PDF
        var pdf = new jsPDF('l', 'mm', 'a4');
        pdf.addImage(myImage, 'JPEG', 15, 2, imgWidth, imgHeight); // 2: 19
        pdf.save('Download.pdf');
      }
    });
  }
})();
