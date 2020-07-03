import $  from "jquery"
if (!("$" in window )) window.$ = $;
const $3Dmol = require('3dmol')
//import * as $ from "jquery"
//import * as $3Dmol from "3dmol"
//TODO: Add Interface
function createViewer(...a) {
    var opacity = 0.2
    var viewer = $3Dmol.createViewer(...a)
    viewer.highlight = function(d) {
        console.log("TODO highlight",d,'opacity',opacity)
    }
    viewer.opacity=function(_) {return arguments.length ? (opacity= _, viewer) : opacity; }
    return viewer
}

export default createViewer

