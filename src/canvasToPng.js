const canvasToPng = (canvas, fn = "newplot") => {
    var blob = canvas.toDataURL()
    var link = document.createElement("a");
    
    link.setAttribute("download", fn + ".png");
    link.href = blob;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default canvasToPng


