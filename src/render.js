import React from "react";
import ReactDOM from "react-dom";
import {select} from "d3-selection";
import {dispatch as d3_dispatch} from "d3-dispatch";
import App from "./app"
var initialState = {
    regions: [],
    track: undefined,
    brush: [],
    atomStyle: "line",
    local: false,
    structureURL: "/static/data/1",
    colorfunc: "chr", //TODO 
    genome: "hg38",
    binsize: null,
    title: "",
    clickable: false,
    localMode: "chr",
    config: true,
}
export default function(layout, container, state, app) {
    var inCtrl = false;
    var width = container.width
    var height = container.height
    d3.select(container.getElement()[0])
        .on("mouseover", function() {
            inCtrl = true;
        })
        .on("mouseout", function() {
            inCtrl = false;
        })
    //Check State
    state = state || {}
    Object.keys(initialState).forEach(function(k) {
        if (!(k in state)) {
            state[k] = initialState[k]
        }
    })

    var cfg = select(container.getElement()[0]).append("div").classed("cfg", true);
    //cfg.style("padding-left", "10px")

    var content = select(container.getElement()[0]).append("div")
        .classed("content", true)
        .style("position", "relative")
        .style("padding", "0px")
    var dispatch = d3_dispatch("update", "brush", "resize", "close", "set3dURL") //dispatch  rules

    layout.eventHub.on("update", function(d) {
        if (!inCtrl) {
            if (d[0].genome && d[0].genome != state.genome) {

            } else {
                dispatch.call("update", this, d)
            }
        }
    })
    layout.eventHub.on("brush", function(d) {
        if (!inCtrl) {
            if (d[0].genome && d[0].genome != state.genome) {

            } else {
                dispatch.call("brush", this, d)
            }

        }
    })
    dispatch.on("update.panel", function(d) {
        if (inCtrl) {
            d.forEach(function(d) {
                d.genome = state.genome
            })
            layout.eventHub.emit("update", d)
            layout.eventHub.emit("updateApp", {
                "regions": d
            })
            layout.eventHub.emit("sendMessage", {
                code: "update",
                data: JSON.stringify(d)
            })
            layout.eventHub.emit("sendMessage", {
                code: "updateApp",
                data: JSON.stringify({
                    "regions": d
                })
            })
        }
    })
    dispatch.on("brush.panel", function(d) {
        if (inCtrl) {
            d.forEach(function(d) {
                d.genome = state.genome
            })
            layout.eventHub.emit("brush", d)
        }
    })
    var resize = function() {
        width = container.width // remove padding
        height = container.height //TODO
        dispatch.call("resize", this, {
            "width": width,
            "height": height,
        })
    }

    var TO = false
    container.on("resize", function(e) {
        if (TO !== false) clearTimeout(TO)
        TO = setTimeout(resize, 200)
    })
    container.on("destroy", function() {
        dispatch.call("close", this, {})
    })

    //container.state , not current state
    dispatch.on("resize", function(d) {
        dispatch.call("close", this, {})
        var _state = container.getState();
        Object.keys(initialState).forEach(function(k) {
            if (!(k in _state)) {
                _state[k] = initialState[k]
            }
        })
        ReactDOM.unmountComponentAtNode(content.node())
        //TODO Add Ctrl URL Source Here
        ReactDOM.render(
            <App chan={dispatch} container={container} _state={_state || initialState} width={width} height={height-30}/>,
            content.node()
        );
    })
}
