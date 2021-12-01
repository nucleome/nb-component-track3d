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
// TODO Add Update State ... 
class NBTrack3D extends HTMLElement {


    static get name() {
        return "Nucle 3D"
    }
    static get is() {
        return "nb-track3d"
    }
    /*
    static initJssPreset() {
        jssPreset = jssPreset()
    }
    */
    constructor(state) {
        super()
        this.state = state || {}
        var self = this
        Object.keys(initialState).forEach((k)=>{
            if (!(k in self.state)) {
               self.state[k] = initialState[k] 
            }
        })
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
    // Add Width and Height Resize Respond 
    static get observedAttributes() {
        return []

    }
    render() {
        this.innerHTML = ""
        // unmount ... 
        this.shadow.innerHTML = `
		<style>
			:host{
             all:inherit 
			}
		</style>
		<slot></slot>
        `;
        var _dispatch =  dispatch("update", "brush", "resize", "close", "set3dURL") //dispatch  rules
        var div = document.createElement("div")
        this.appendChild(div)
        var jss = create({..._jssPreset,insertionPoint:div.parentNode.parentNode});
        var width = 600
        var height =  700
        //TODO wire dispatch .. 
        var self = this
        var state = this.state
        ReactDOM.render(
            (<StylesProvider jss={jss}>
                <App chan={_dispatch} _state={state} width={width} height={height-30}/>
            </StylesProvider>)
            ,div);
        retargetEvents(this.shadow);
    }
    disconnectedCallback() {}
}

customElements.define(NBTrack3D.is, NBTrack3D)

export default NBTrack3D
