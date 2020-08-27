import App from "../app"
import React, {
    MuiThemeProvider, createMuiTheme
} from "react"
import ReactDOM from "react-dom"
import {create} from "jss"
import {jssPreset,StylesProvider} from "@material-ui/styles"
import retargetEvents from 'react-shadow-dom-retarget-events';


import {
    dispatch 
} from "d3-dispatch"
var initialState = {
    regions: [],
    track: undefined,
    brush: [],
    atomStyle: "line",
    local: false,
    structureURL: "/data/1",
    colorfunc: "chr", //TODO 
    genome: "hg38",
    binsize: null,
    title: "",
    clickable: false,
    localMode: "chr",
    config: true,
}
/*
const theme = createMuiTheme({
    props: {}
})
*/
var _jssPreset = jssPreset()
class NBTrack3D extends HTMLElement {


    static get name() {
        return "NB Track3D"
    }
    /*
    static initJssPreset() {
        jssPreset = jssPreset()
    }
    */
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: 'open'
        })
        this.intervalId = 0
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }

    connectedCallback() {
        this.render()

    }
    static get observedAttributes() {
        return []

    }
    render() {

        this.shadow.innerHTML = `
		<style>
			:host{
             all:inherit 
			}
		</style>
		<slot></slot>
        `;
        //TODO ... 
        //
        // var _dispatch = dispatch("resize","update","brush","set3dURL")
        var _dispatch =  dispatch("update", "brush", "resize", "close", "set3dURL") //dispatch  rules
        var div = document.createElement("div")
        this.appendChild(div)
        //TODO ... only first time works ???
        var jss = create({..._jssPreset,insertionPoint:div.parentNode.parentNode});
        var width = 600
        var height =  700
        //TODO wire dispatch ..
        var self = this
        ReactDOM.render(
            (<StylesProvider jss={jss}>
                <App chan={_dispatch} _state={initialState} width={width} height={height-30}/>
            </StylesProvider>)
            ,div);
        retargetEvents(this.shadow);
    }
    disconnectedCallback() {}
}

customElements.define('nb-track3d', NBTrack3D)

export default NBTrack3D
