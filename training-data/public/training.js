console.log("Training Data Creation Started.");

var width = 28;
var height = 28;
var imageCount = 2500;
var imageIndex = 0;
// Create a Canvas for drawing shapes
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");




function drawShape() {
    // Set Line Width
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    // draw circle
    let radius = Math.random() * (width / 2);
    let x = Math.random();
    
    ctx.beginPath();
    if( x > 0.5) {
        ctx.arc(width/2, height/2, radius, 0, 2 * Math.PI);
    } else {
        ctx.rect(width/2 - radius, height/2 - radius, radius * 2, radius * 2);
    }
    
    ctx.stroke();
    ctx.closePath();    
}

function saveImage() {
    // Save canvas as image
    var img = canvas.toDataURL("image/png");    
    // send image to server
    var xhr = new XMLHttpRequest();    
    xhr.open("POST", `http://localhost:8080/api/${imageIndex}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "image": img
    }));
    imageIndex++;
}

for(let i = 0; i < imageCount; i++) {

    drawShape();
    saveImage();
}
