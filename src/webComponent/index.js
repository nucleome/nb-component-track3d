import App from "../app"
import React from "react"
import ReactDOM from "react-dom"
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
class NBTrack3D extends HTMLElement {
    static get name() {
        return "NB Track3D"
    }
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
             all:initial  
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
        var width = 600
        var height =  700
        ReactDOM.render(
            <App chan={_dispatch} _state={initialState} width={width} height={height-30}/>,
            div);
    }
    disconnectedCallback() {}
}

customElements.define('nb-track3d', NBTrack3D)

export default NBTrack3D
