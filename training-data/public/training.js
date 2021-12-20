console.log("Training Data Creation Started.");

// Create a new training data set

// Create a Canvas for drawing shapes
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");

// Set Line Width
ctx.lineWidth = 5;
ctx.fillStyle = "rgba(255, 255, 255, 1)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
ctx.fillRect(100, 100, 200, 200);
ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
ctx.fillRect(150, 150, 200, 200);
ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
ctx.fillRect(200, 50, 200, 200);
// Save canvas as image
var img = canvas.toDataURL("image/png");

let imageNo = 12;
// send image to server
var xhr = new XMLHttpRequest();
xhr.open("POST", `http://localhost:8080/api/${imageNo}`, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify({
    "image": img    
}));
