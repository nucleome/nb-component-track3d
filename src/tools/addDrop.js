function addDrop(el,callback) {

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    }

    function handleDragEnter(e) {
      // this / e.target is the current hover target.
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over'); // this / e.target is previous target element.
    }

    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
      var r = e.dataTransfer.getData("track")
      callback(JSON.parse(r))
      this.classList.remove('over'); // this / e.target is previous target element.
      return false;
    }

    //el.attr("draggable",true)
    var col = el.node()
    //var _text = cold3.append("span").style("user-select","all").style("cursor","grab").text(d.longLabel || d.id)
    col.addEventListener('dragenter', handleDragEnter,
      false);
    col.addEventListener('dragover', handleDragOver,
      false);
    col.addEventListener('dragleave', handleDragLeave,
      false);
    col.addEventListener('drop', handleDrop, false);

}

export default addDrop


