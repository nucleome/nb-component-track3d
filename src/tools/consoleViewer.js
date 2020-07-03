function viewerFactory() {
    var viewer = function() {

    }
    viewer.linkViewer = function(v) {

    }

    viewer.setView = function(d) {
        console.log("setView", d)
    }
    return viewer
}
export default viewerFactory
