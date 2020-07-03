import React from 'react';
import ReactDOM from "react-dom"

import {
    useState,
    useContext,
    useEffect,
    useRef
} from 'react'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {strToColor} from "@nucleome/nb-tools"


import {
    AppContext
} from "./app"

import IconCurrentChr from "@material-ui/icons/Book"
import IconCurrentRegion from "@material-ui/icons/MenuBook"
import IconHighlightRegion from "@material-ui/icons/BorderColor"


import nucle3dParse from "./nucle3dParse"
import {webglSupport} from "@nucleome/nb-tools"
//import * as d3 from "d3"
import {select} from "d3-selection"
import {scaleLinear} from "d3-scale"
import $ from "jquery"
import createViewer from "./tools/createViewer"

import registerViewer from "./tools/registerViewer"
import deregisterViewer from "./tools/deregisterViewer"
import disconnectViewer from "./tools/disconnectViewer"

import currentView from "./tools/currentView"

import rgbToHex from "./tools/rgbToHex"

import {regionsNiceText,randomString} from "@nucleome/nb-tools"


import useStyles from "./styles.js"

import {
    overlap
} from "./tools/funcs"
if (!("$" in window)) window.$ = $;
const $3Dmol = require('3dmol')
function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

var rainbow = colores_google
//d3.scaleOrdinal(d3.schemeCategory10)
//TODO our Own color Schema
//     replace grey
var rainbowFunc = function(i) {
    var wrapper
    var f = function(d, j) {
        if (typeof wrapper == "undefined") {
            return rainbow(i)
        } else {
            d.color0 = rainbow(i)
            return wrapper(d, i)
        }
    }
    f.wrapper = function(_) {
        return arguments.length ? (wrapper = _, f) : wrapper;
    }
    return f
}

var colorScale = scaleLinear() //TODO Color Scale To Parameters

//TODO: color func change state


var styles = {
    line: function(i) {
        return {
            line: {
                singleBonds: true,
                linewidth: 1, //loose sport 
                alpha: 0.55,
                colorfunc: rainbowFunc(i) //or BigWig Value
            },
        }
    },
    stick: function(i, nodesize) {
        return {
            stick: {
                singleBonds: true,
                radius: nodesize / 5,
                colorfunc: rainbowFunc(i) //or BigWig Value
            },

        }

    },
    cross: function(i, nodesize) {
        return {
            cross: {
                singleBonds: true,
                radius: nodesize / 4, // replace with Scale ??
                colorfunc: rainbowFunc(i) //or BigWig Value
                //scale ...
            },

        }

    },
    sphere: function(i, nodesize) {
        return {
            sphere: {
                singleBonds: true,
                radius: nodesize / 4, //TRUE replace with Scale ???
                colorfunc: rainbowFunc(i) //or BigWig Value
            },

        }

    },
    hide: function(i) {
        return {
            line: {
                singleBonds: true,
                radius: 0.75,
                opacity: 0.10,
                alpha: 0.10,
                colorfunc: rainbowFunc(i) //or BigWig Value
            },

        }
    }
}

function Nucle3D(props) {
    const {
        state,
        dispatch,
    } = useContext(AppContext);
    const {
        height,
        width,
        chan,
        localEvent,
        data,
        anno
    } = props
    const classes = useStyles()
    const [viewerId, setViewerId] = useState(undefined)
    const [uuid, setUuid] = useState()
    const [o, setO] = useState()
    const myRef = useRef();
    const iRef = useRef();
    const [nodesize, setNodesize] = useState(1)
    const [binsize, setBinsize] = useState()
    const [n3d, setN3d] = useState()
    const [title, setTitle] = useState("noname")
    const [genome, setGenome] = useState("hg38")
    const [hoverRegion, setHoverRegion] = useState([])

    const [annoShapes, setAnnoShapes] = useState([])

    const [annoXyz, setAnnoXyz] = useState({})
    const [annoCurve, setAnnoCurve] = useState({})

    const [yoffset, setYoffset] = useState(state.fullView ? -170 : -35)


    /*
    const [connect, setConnect] = useState(true) //N3D and URL in DB?
    const handleConnect = (e) => {
        if (typeof viewerId !== "undefined" && typeof state.structureURL !== "undefined") {
            console.log("change connect", e.target.checked, viewerId, state.structureURL)
            setConnect(e.target.checked)
            if (e.target.checked) {
                var _viewerId = registerViewer(o.viewer, state.structureURL)
                setViewerId(_viewerId)
            } else {
                deregisterViewer(state.structureURL, viewerId)
                o.viewer.linkViewer()
            }
        }

    }
    */
    /*
    const _renderText_ = function(el, width, height) {
        el.selectAll(".textCanvas").remove();
        var canvas = el.append("canvas").classed("textCanvas",true).attr("width",width).attr("height",height)
        var ctx = canvas.getContext("2d")
        ctx.fillText("Legend",100,100)
    }
    */

    const _render_ = function(el, chrs, ratio, nodesize, state) {
        var style = state.atomStyle;
        let element = $(el.node());
        let config = {
            backgroundColor: "#F0F0F0"
        };
        var viewer = createViewer(element, config);
        viewer.clear()
        viewer.setBackgroundColor(0xfffffff);
        //TODO ADD a Text Canvas 
        //    var ctx = el.select("canvas").node().getContext("2d")
        //    ctx.fillText("Hello,World!!!",100,100)
        //END OF CANVAS TEST

        var chr2idx = {}
        var chr2model = {}
        chrs.forEach(function(d, i) {
            var m = viewer.addModel();
            m.addAtoms(d);
            chr2idx[d[0].chr] = i;
            chr2model[d[0].chr] = m;
        })
        viewer.zoomTo();
        if (ratio < 0.95) {
            viewer.zoom(ratio)
        } else {
            viewer.zoom(0.95);
        }
        var r = {
            data: chrs,
            idx: chr2idx,
            viewer: viewer,
            model: chr2model //TODO Return Prototype
        }
        return r
    };


    const setColorScale = function() {
        var max = -Infinity
        var min = Infinity
        Object.keys(data).forEach(function(c) {
            var ch = data[c]
            ch.data.forEach(function(d) {
                var score = d.Sum / d.Valid || 0.0
                if (max < score) {
                    max = score
                }
                if (min > score) {
                    min = score
                }
            })
        })
        if (min >= 0) {
            colorScale.domain([0.0, max]).range(["#FFF", "#F00"])
        } else {
            colorScale.domain([min, 0, max]).range(["#0F0", "#FFF", "#F00"])
        }

    }
    /* color with track bigwig data */
    const _styleTrack_ = function() {
        if (!data || Object.keys(data).length == 0) {
            return false
        }
        var _processColor = {

        }
        Object.keys(data).forEach(function(c) {
            _processColor[c] = new Array(Math.ceil(data[c].length / binsize)).map(function(x, i) {
                return "rgb(255,255,255)"
            })
        })
        Object.keys(data).forEach(function(c) {
            var ch = data[c]
            var cl = _processColor[c]
            ch.data.forEach(function(d) {
                var s = Math.floor(d.From / binsize)
                var e = Math.floor(d.To / binsize)
                var score = d.Sum / d.Valid || 0.0
                for (var i = s; i < e; i++) {
                    cl[i] = colorScale(score)
                }
            })
        })

        Object.keys(o.idx).forEach(function(chr) {
            var wrapper //separate wrapper 
            var _color = function(d) {
                // set Global _color_ function ?? *
                return rgbToHex(_processColor[d.chr][d.index] || "rgb(55,55,55)") || "#CCC"
            }
            var _color_ = function(d, i) {
                if (typeof wrapper == "undefined") {
                    return _color(d)
                } else {
                    d.color0 = _color(d)
                    return wrapper(d, i) // add wrapper
                }

            }
            _color_.wrapper = function(_) {
                return arguments.length ? (wrapper = _, _color_) : wrapper;
            }
            /* Docorator */


            var i = o.idx[chr]
            var m = o.model[chr]
            m._style_ = {}
            m._style_[state.atomStyle] = {
                singleBonds: true,
                radius: nodesize / 4,
                colorfunc: _color_ //or BigWig Value or BigBed Processed Tracks add colorfunc
            }
            m.setStyle({}, m._style_)
        })
        return true
    }
    const _style_ = function() {
        if (typeof o == "undefined") return
        var hasData = false
        if (state.colorfunc == "track") {
            hasData = _styleTrack_()
        }
        /* for chr */
        if (state.colorfunc == "chr" || !hasData) {
            Object.keys(o.idx).forEach(function(chr) {
                var i = o.idx[chr]
                var m = o.model[chr]
                m._style_ = styles[state.atomStyle](i, nodesize) //generate styles functions
                m.setStyle({}, m._style_)
            })
        }
        /* for local  and TODO: Detect Local Mode */
        if (state.local) {
            var _chrs = {}
            state.regions.forEach(function(d) {
                _chrs[d.chr] = true
            })
            Object.keys(o.model).forEach(function(d) {
                if (!(d in _chrs)) {
                    var i = o.idx[d]
                    var m = o.model[d]
                    m._style_ = styles["hide"](i)
                    m.setStyle({}, m._style_)
                }
            })
            if (state.localMode == "current") {
                _fastLocalStyle_(_chrs, state.regions)
            } else if (state.localMode == "highlight") {
                _fastLocalStyle_(_chrs, state.brush)
            }
        }
        _setHoverableMode_() //TODO
        o.viewer.render()
    }
    /* only call it when using state.local and state.localMode != chr  */
    const _removeWrapper_ = function() {
        Object.keys(o.model).forEach(function(chr) {
            if ("_style_" in o.model[chr] && state.atomStyle in o.model[chr]._style_ && "wrapper" in o.model[chr]._style_[state.atomStyle].colorfunc) {
                o.model[chr]._style_[state.atomStyle].colorfunc.wrapper(undefined)
            }
        })
    }
    // k is regions?
    const _fastLocalStyle_ = function(k, r) {
        _removeWrapper_()
        var hset = {}
        r.forEach(function(d, i) {
            var atoms = o.data[o.idx[d.chr]]
            if (typeof atoms == "undefined" || typeof binsize == "undefined") return
            var start = Math.floor(d.start / binsize)
            var end = Math.ceil(d.end / binsize)
            for (var i = start; i < end; i++) {
                if (!(d.chr in hset)) {
                    hset[d.chr] = {}
                }
                if (atoms[i] && "id" in atoms[i]) {
                    hset[d.chr][atoms[i].id] = d.color || 1 //add regions.color
                }
            }
        })
        Object.keys(k).sort().forEach(function(chr) {
            if ("_style_" in o.model[chr] && state.atomStyle in o.model[chr]._style_) {
                if ("wrapper" in o.model[chr]._style_[state.atomStyle].colorfunc) {
                    o.model[chr]._style_[state.atomStyle].colorfunc.wrapper(function(d, i) {
                        if (chr in hset && d.id in hset[chr]) return d.color0 //TODO STATE REVERSABLE CHOOSE
                        return "#AAAAAA"
                    })
                } else {
                    console.log("no wrapper?")
                }
            }
        })
    }

    const _currentChr_ = function() {
        var k = {}
        state.regions.forEach(function(d) {
            if (!(d.chr in k)) {
                k[d.chr] = 1
            } else {
                k[d.chr] += 1
            }
        })
        return Object.keys(k).sort()
    }
    const _clearHoverable_ = function() {
        Object.keys(o.model).forEach(function(k) {
            var m = o.model[k]
            m.setHoverable({}, false, undefined, undefined)
            m.setClickable({}, false, undefined)
        })
    }
    const colorFuncWrapper = function(c, f) {
        return function(d) {
            if (d.index == c.index) {
                return "blue"
            } else {
                return f(d)
            }
        }
    }
    const _setHoverableMode_ = function() {
        if (typeof o == "undefined") return;
        _clearHoverable_()
        if (state.clickable) {

            if (state.local) {
                var TORENDER
                _currentChr_().forEach(function(k) {
                    var m = o.model[k]
                    /*
                    var colorFunc = m._style_[state.atomStyle].colorfunc 
                    var _s = m._style_ 
                    var old = m._style_
                    _s[state.atomStyle].colorfunc = colorFuncWrapper(d,colorFunc)
                    console.log(old,_s)
                    */
                    var buffers = {}
                    var _localHoverRegion = []
                    m.setClickable({}, true, function(atom) {
                        //TODO Clean Buffers
                        Object.keys(buffers).forEach(
                            function(index) {
                                m.setStyle({
                                    serial: index
                                }, buffers[index])
                            }
                        )
                        for (var member in buffers) delete buffers[member];
                        if (_localHoverRegion.length > 0) {
                            chan.call("update", this, _localHoverRegion)
                        }
                        setHoverRegion([])
                    })
                    m.setHoverable({}, true, function(atom, viewer, event, container) {
                        var e = (atom.index + 1) * state.binsize
                        if (e > state.chromSizes.chromSizes[k]) {
                            e = state.chromSizes.chromSizes[k]
                        }
                        /*
                        if (!atom.label) {
                            atom.label = viewer.addLabel(regionsText([{chr:atom.chr,start:atom.index*state.binsize,end:e}]), {
                                position: atom,
                                backgroundColor: 'mintcream',
                                fontColor: 'black'
                            });
                        }
                        */
                        //atom.serial = atom.index

                        _localHoverRegion = [{
                            chr: atom.chr,
                            start: atom.index * state.binsize,
                            end: e
                        }]
                        setHoverRegion(_localHoverRegion)
                        if (Object.keys(atom.style).length > 0) {
                            buffers[atom.serial] = atom.style
                        } else {
                            console.log("warning", atom.style)
                        }
                        if (state.atomStyle == "stick") {
                            m.setStyle({
                                serial: atom.index
                            }, {
                                stick: {
                                    color: "blue",
                                    radius: 0.55 * nodesize / 2,
                                }
                            })
                        } else {
                            m.setStyle({
                                serial: atom.index
                            }, {
                                sphere: {
                                    color: "blue",
                                    radius: 0.55 * nodesize / 2,
                                }
                            })

                        }
                        viewer.render()
                    }, function(atom, viewer) {
                        /*
                        if (atom.label) {
                            viewer.removeLabel(atom.label);
                            delete atom.label;
                        }
                        */
                        if (atom.serial in buffers) {
                            m.setStyle({
                                serial: atom.index
                            }, buffers[atom.serial])
                            viewer.render()
                            delete buffers[atom.serial]
                        }
                    })

                })
            } else {
                //Set Chromosome Mode
                Object.keys(o.model).forEach(function(k) {
                    var m = o.model[k]
                    var bufferStyle = {}
                    var _localHoverRegion = []
                    m.setClickable({}, true, function(atom) {
                        if (_localHoverRegion.length > 0) {
                            chan.call("update", this, _localHoverRegion)
                        }
                    })

                    m.setHoverable({}, true, function(d, viewer, event, container) {
                        bufferStyle = m._style_;
                        m.setStyle({}, {
                            stick: {
                                singleBonds: true,
                                radius: 0.55 * nodesize / 2,
                                color: "blue"
                            },
                        })
                        _localHoverRegion = [{
                            chr: d.chr,
                            start: 0,
                            end: state.chromSizes.chromSizes[d.chr] || undefined
                        }]
                        setHoverRegion(_localHoverRegion)
                        //TODO select this m StyledToggleButtonGroup
                        o.viewer.render()
                    }, function(d) {
                        setHoverRegion([])
                        if (Object.keys(bufferStyle).length > 0) {
                            m.setStyle(bufferStyle)
                            o.viewer.render()
                        }
                    })

                })

            }

        }
    }
    const _R = function() {
        var el = select(myRef.current)
        el.selectAll("canvas").remove()
        var _o
        var _id
        var _n3d //TODO
        var uri = JSON.parse(JSON.stringify(state.structureURL))
        var _render = function(el) { //factorize _render_
            var binsize
            var _nodesize
            var viewer
            var _r = function() {
                binsize = _n3d.binsize()
                _nodesize = _n3d.guessNodeSize()
                _o = _render_(el, _n3d.ThreeDMol(), width / height, _nodesize, state)
                //TODO render text
                setNodesize(_nodesize)
                viewer = _o.viewer
                _id = registerViewer(_o.viewer, uri)
                setViewerId(_id)
                var v = currentView(uri)
                if (typeof v !== undefined) {
                    _o.viewer.setView(v)
                }
                return _o

            }
            fetch(uri, {}).then(function(d) {
                    return d.text()
                })
                .then(function(d) {
                    try {
                        _n3d = nucle3dParse(d)
                        var _o_ = _r()
                        setO(_o_)
                        setBinsize(_n3d.binsize())
                        setGenome(_n3d.genome())
                        setTitle(_n3d.title())
                        dispatch({
                            type: "THREED_LOADED",
                            data: {
                                genome: _n3d.genome(),
                                binsize: _n3d.binsize(),
                                "title": _n3d.title(),
                            }

                        })
                        setN3d(_n3d)
                    } catch (e) {
                        e.error = "URL Error"
                    }
                })
        }
        _render(el)
        return function() {
            if (typeof _id !== "undefined") {
                deregisterViewer(uri, _id)
            }
        }

    }
    useEffect(function() {
        if (typeof o == "undefined") return
        if (state.clickable) {
            //Set Hoverable Function 
        } else {
            setHoverRegion([])
        }
        _style_() //TODO

    }, [state.clickable])
    useEffect(function() {
        setColorScale()
        if (state.colorfunc == "track") {
            _style_()
        }
    }, [data])
    useEffect(function() {
        if (state.fullView) {
            setYoffset(-170)
        } else {
            setYoffset(-35)
        }
    }, [state.fullView])


    //annoShapes (shapes)
    const removeAnnoShapes = function() {
        annoShapes.forEach(function(e) {
            o.viewer.removeShape(e)
        })
    }

    // check
    // state.annoInput
    // state.anno (info) 
    // TODO add state.annoStyle
    // anno       (data)
    // annoShapes (shapes)
    // TODO: check state.local
    const renderAnno = function() {
        if (state.local) {
            renderAnnoChr()
        } else {
            renderAnnoChrs()
        }
    }
    const renderAnnoChrs = function() {
        removeAnnoShapes()
        /*
        if (Object.keys(anno).length == 0) return ;
        if (typeof annoXyz !== "undefined" && Object.keys(annoXyz).length > 0 && Object.keys(anno).length > 0 && state.annoInput) {
            var _shapes = []
            Object.keys(anno).forEach(function(chr) {
                if (chr in anno && "data" in anno[chr]) {
                    anno[chr].data.forEach(function(d, i) {
                        if (d.chr.length > 0) {
                            var a = annoXyz[d.chr + ":" + d.start + "-" + d.end + ":" + d.name] || n3d.bed2xyz(d) //TODO Using Buffer for This
                            var r = (d.end - d.start) / binsize * nodesize / 4 //TODO 
                            var k = o.viewer.addSphere({
                                center: {
                                    x: a.x,
                                    y: a.y,
                                    z: a.z
                                },
                                radius: Math.pow((a.sx || r) * (a.sy || r) * (a.sz || r), 1 / 3),
                                color: rgbToHex("rgb(" + d.itemRgb + ")"), //TODO Fix This
                                opacity: 0.3
                            });
                            _shapes.push(k)
                        }
                    })
                }
            })
            setAnnoShapes(_shapes)
        }
        */
        if (typeof o !== "undefined" && "viewer" in o) {
            o.viewer.render()
        }
    }
    /* TODO Add Anno Shapes 
     *   using bed2curve instead of bed2xyz 
     *   also : anno name filter
     * */
    const renderAnnoChrSphere = function() {
        removeAnnoShapes()
        if (Object.keys(anno).length == 0) return;
        if (typeof annoXyz !== "undefined" && Object.keys(annoXyz).length > 0 && Object.keys(anno).length > 0 && state.annoInput) {
            //if (typeof anno !== "undefined" && Object.keys(anno).length > 0 && state.annoInput) {
            var r = {}
            state.regions.forEach(function(d) {
                r[d.chr] = 1
            })
            var _shapes = []
            Object.keys(r).forEach(function(chr) {
                if (chr in anno && "data" in anno[chr]) {
                    anno[chr].data.forEach(function(d, i) {
                        if (d.chr.length > 0) {
                            //var a = n3d.bed2xyz(d) //TODO Using Buffer for This
                            var a = annoXyz[d.chr + ":" + d.start + "-" + d.end + ":" + d.name] || n3d.bed2xyz(d) //TODO Using Buffer for This
                            var r = (d.end - d.start) / binsize * nodesize / 4 //TODO 
                            // if d is in regions ? 
                            //
                            var isOverlap = false
                            state.regions.forEach(function(r) {
                                if (overlap(r, d)) {
                                    isOverlap = true
                                }
                            })
                            var k = o.viewer.addSphere({
                                center: {
                                    x: a.x,
                                    y: a.y,
                                    z: a.z
                                },
                                radius: Math.pow((a.sx || r) * (a.sy || r) * (a.sz || r), 1 / 3),
                                color: isOverlap ? rgbToHex("rgb(" + d.itemRgb + ")") : "grey", //TODO Fix This
                                opacity: 0.85
                            });
                            //TODO clickable to change to curve
                            //
                            _shapes.push(k)
                        }
                    })
                }
            })
            setAnnoShapes(_shapes)

        }
        if (typeof o !== "undefined" && "viewer" in o) {
            o.viewer.render()
        }
    }
    /*
      const renderAnnoChrCurve = function() {
            removeAnnoShapes()
            if (Object.keys(anno).length == 0) return;
            if (typeof annoCurve !== "undefined" && Object.keys(annoCurve).length > 0 && Object.keys(anno).length > 0 && state.annoInput) {
                var r = {}
                state.regions.forEach(function(d) {
                    r[d.chr] = 1
                })
                var _shapes = []
                Object.keys(r).forEach(function(chr) {
                    if (chr in anno && "data" in anno[chr]) {
                        anno[chr].data.forEach(function(d, i) {
                            if (d.chr.length > 0) {
                                var a = annoCurve[d.chr + ":" + d.start + "-" + d.end + ":" + ( d.id || d.name) ] || n3d.bed2curve(d) //TODO Using Buffer for This
                                var isOverlap = false
                                state.regions.forEach(function(r){
                                    if (overlap(r,d)) {
                                        isOverlap = true
                                    }
                                })
                                var k = o.viewer.addCurve({
                                    points: a,
                                    radius: 1.2 * nodesize,
                                    color: isOverlap?rgbToHex("rgb(" + d.itemRgb + ")"):"grey", //TODO Fix This
                                    opacity: 0.85,
                                    smooth: 1.2 * nodesize,
                                });
                                console.log(k,i)
                                _shapes.push(k)
                            }
                        })
                    }
                })
                setAnnoShapes(_shapes)
            }
            if (typeof o !== "undefined" && "viewer" in o) {
                o.viewer.render()
            }
        }
        */
    const renderAnnoChr = renderAnnoChrSphere
    //const renderAnnoChr = renderAnnoChrSphere
    //TODO: Resizing Problem and Storage Problem
    //TODO: Add Curve Option
    //TODO: setAnnoCurve
    const prepareAnno = function() {
        var buf = {}
        var curve = {}
        Object.keys(anno).forEach(function(chr) {
            if ("data" in anno[chr]) {
                anno[chr].data.forEach(function(d, i) {
                    if (d.chr.length > 0) {
                        var a = n3d.bed2xyz(d) //TODO Using Buffer for This
                        buf[d.chr + ":" + d.start + "-" + d.end + ":" + (d.id || d.name)] = a

                        var c = n3d.bed2curve(d)
                        curve[d.chr + ":" + d.start + "-" + d.end + ":" + (d.id || d.name)] = c
                    }
                })
            }
        })
        setAnnoXyz(buf)
        setAnnoCurve(curve) //TODO curve data 
    }

    useEffect(function() {
        if (typeof n3d !== "undefined" && typeof anno !== "undefined" && Object.keys(anno).length > 0) {
            prepareAnno()
        }
    }, [anno, n3d])
    useEffect(function() {
        renderAnno()
    }, [annoCurve, annoXyz, state.annoInput, state.anno, state.regions, state.local])
    useEffect(function() {
        _style_()
    }, [o])
    useEffect(function() {
        if (localEvent && o) {
            localEvent.on("zoomToOne.101", function() {
                if ("viewer" in o) {
                    o.viewer.zoomTo(0.95)
                }
            })
        }
    }, [localEvent, o])

    useEffect(function() {
        var _uuid = randomString(20)
        setUuid(_uuid)
        chan.on("resize." + _uuid, function(d) {})
    }, [])
    useEffect(function() {
        _style_()
    }, [state.localMode])

    useEffect(function() {
        if (state.localMode == "current") {
            _style_()
        }

    }, [state.regions])

    useEffect(function() {
        if (state.localMode == "highlight") {
            _style_()
        }
    }, [state.brush])

    useEffect(function() {
        _style_()
    }, [state.colorfunc])


    useEffect(_R, [state.structureURL, yoffset]) //LOADING STRUCTURE URL

    useEffect(function() {
        if (typeof uuid == "undefined") return
        chan.on("close." + uuid, function() { //TODO Not Chan Local Instead
            if (typeof viewerId !== "undefined") {
                deregisterViewer(state.structureURL, viewerId)
            }
        })

    }, [viewerId])

    useEffect(function() {
        if (o && "model" in o) {
            _style_()
        }
    }, [state.atomStyle, state.local, state.regions, binsize])


    return (
        <Grid container item 
            direction="row"
            justify="center"
            alignItems="center"
     >
    <Grid item xs={12}>
        <Typography component="div" style={{position:"relative"}}>
            <Typography ref={myRef} component="div" style={{height:height - yoffset, width:width, backgroundColor:"#EAEAEA"}}>
            </Typography>
            <Typography component="div" style={{position:"absolute",top:10,left:10,fontSize:16, maxWidth: 200, padding:5}}> 
             <Typography component="div"> Genome: {genome}</Typography>
             <Typography component="div"> Structure : {title}</Typography>
        <Typography component="div"> Binsize: {binsize}</Typography>
              {state.anno && state.anno.longLabel?<Typography component="div">Annotation : <Typography component="span" className={classes.legendContent}>{state.anno.longLabel}</Typography></Typography>:null}
              {state.track && state.track.longLabel?<Typography component="div">Signal : <Typography component="span" className={classes.legendContent}>{state.track.longLabel}</Typography></Typography>:null} 

            </Typography>
            
            
            <Typography component="div" style={{position:"absolute", top:10,right:10,maxWidth:160}}>
            <Typography className={classes.pos} color="textSecondary">
            Current
            </Typography>
            <Typography component="p" variant="body2">{regionsNiceText(state.regions)}</Typography>
            <Typography className={classes.pos} color="textSecondary">
            Highlight
            </Typography>
            <Typography component="p" variant="body2">{regionsNiceText(state.brush)}</Typography>
            {state.clickable?<Typography component = "div">
                    <Typography className={classes.pos}> mouse over on {state.local?"region":"chromosome"}</Typography>
                    <Typography component="p" variant="body2"> {regionsNiceText(hoverRegion)} </Typography>
            </Typography>:null}
            </Typography>
       
        </Typography>
    </Grid>
    </Grid>
    )
}

export default Nucle3D
