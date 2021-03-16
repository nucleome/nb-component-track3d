import React from 'react';
import AppBar from "./appBar"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
    useState,
    useRef,
    useEffect,
    useReducer,
    useContext
} from 'react';


import update from "immutability-helper"

import Nucle3D from "./nucle3d.jsx"
import TrackDrop from "./trackDrop.jsx"
import TrackBedDrop from "./trackBedDrop.jsx"

import {randomString} from "@nucleome/nb-tools"

import chromSizes from "./tools/chromSizes.js"

import bwAgent from "./nbBwAgent"
import bbAgent from "./nbBbAgent"

import useStyles from "../../../src/styles.js"
//import useStyles from "./styles.js"
import {
    dispatch as e3
} from "d3-dispatch"

export const AppContext = React.createContext();

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_TRACK':
            return update(state, {
                track: {
                    $set: action.data
                }
            });
        case 'UPDATE_ATOM_STYLE':
            if (action.data == null) {
                return update(state, {})
            }
            return update(state, {
                atomStyle: {
                    $set: action.data
                }
            });
        case 'SET_LOCAL':
            return update(state, {
                local: {
                    $set: action.data
                }
            });
        case 'SET_LOCALMODE':
            return update(state, {
                localMode: {
                    $set: action.data
                }
            });

        case 'SET_3D_URL':
            return update(state, {
                structureURL: {
                    $set: action.data
                }
            });
        case 'SET_COLORFUNC':
            return update(state, {
                colorfunc: {
                    $set: action.data
                }
            });
        case 'SET_CONFIG':
            return update(state, {
                config: {
                    $set: action.data
                },
            });

        case 'SET_CLICKABLE':
            return update(state, {
                clickable: {
                    $set: action.data
                },
            });
        case 'SET_ANNOINPUT':
            return update(state, {
                annoInput: {
                    $set: action.data
                },
            });
        case 'SET_ANNO':
            return update(state, {
                anno: {
                    $set: action.data
                },
            });
        case 'SET_FULLVIEW':
            return update(state, {
                fullView: {
                    $set: action.data
                },
            })

        case 'SET_CHROMSIZES':
            return update(state, {
                chromSizes: {
                    $set: action.data
                },
            });

        case 'THREED_LOADED':
            return update(state, {
                genome: {
                    $set: action.data.genome
                },
                binsize: {
                    $set: action.data.binsize
                },
                title: {
                    $set: action.data.title
                }
            })
        case 'UPDATE':
            return update(state, {
                regions: {
                    $set: action.data
                }
            })
        case 'BRUSH':
            return update(state, {
                brush: {
                    $set: action.data
                }
            })
        default:
            return state;
    }
}

var cInitialState = {
    regions: [],
    track: undefined,
    brush: [],
    atomStyle: "line",
    local: false,
    structureURL: "/static/data/K562.100k.nucle3d",
    colorfunc: "chr", //TODO 
    threeDInput: true,
    genome: "hg38",
    binsize: null,
    title: "",
    localMode: "chr",
    chromSizes: undefined,
    annoInput: false,
    anno: undefined,
    config: true,
    fullView: false,
}
var cs = chromSizes() //only one
var bwagent = bwAgent()
var bbagent = bbAgent()

function App(props) {
    const {
        chan,
        container,
        _state,
        width,
        height,
    } = props
    const classes = useStyles()
    const [input, setInput] = useState("")
    const uuid = randomString(20)
    //const [chromSizes, setChromSizes] = useState({})
    const [bwData, setBwData] = useState({})
    const [annoData, setAnnoData] = useState({})
    const [bwLoading, setBwLoading] = useState(false)
    const [annoLoading, setAnnoLoading] = useState(false)
    const [fullView, setFullView] = useState(false)
    var cReducer = function(state, action) {
        var retv = reducer(state, action)
        if (typeof container !== "undefined") {
            container.setState(retv)
        }
        return retv
    }

    const [state, dispatch] = useReducer(cReducer, _state || cInitialState); //TODO Fix _state

    var tReducer = function(state, action) {
        switch (action.type) {
            default: return state

        }

    }
    var tInitState = {
        anno: {},
        bwReady: false,
        bbReady: false,
    }
    const [tState, tDispatch] = useReducer(tReducer, tInitState); //TODO Fix _state
    useEffect(function() {
        setLocalEvent(e3("zoomToOne"))
    }, [])

    const handle3DURL = (d) => {
        if (typeof d !== "undefined") {
            dispatch({
                type: "SET_3D_URL",
                data: d
            })
        } else {
            dispatch({
                type: "SET_3D_URL",
                data: input
            })
        }
    }
    const handleInput = (e) => {
        setInput(e.target.value)
    }
    const handleEnter = (e) => {
        if (e.charCode === 13) {
            handle3DURL()
        }
    }
    const handleMouseOut = (e, v) => {
        if (state.structureURL !== input) {
            handle3DURL()
        }
    }
    /* Add Interface to change 3D structrue */
    const [localEvent, setLocalEvent] = useState()
    useEffect(function() {
        if (state && "chromSizes" in state && typeof state.chromSizes !== "undefined" && "genome" in state.chromSizes && state.chromSizes.genome == state.genome && Object.keys(state.chromSizes.chromSizes).length == 0) {
            return
        }
        cs.fetch(state.genome).then(function(d) {
            var chrs = {}
            Object.keys(d.chromSizes).filter(function(k) {
                return k.match("_") == null && d.chromSizes[k] > 0 && k !== "chrM" //TODO Possible Bug DEBUG
            }).forEach(function(k) {
                chrs[k] = d.chromSizes[k]
            })
            dispatch({
                type: "SET_CHROMSIZES",
                data: {
                    genome: state.genome,
                    chromSizes: chrs
                }
            })
        })
    }, [state.genome])


    useEffect(function() {
        bwagent.binsize(state.binsize).genome(state.genome)
    }, [state.genome, state.binsize])


    useEffect(function() {
        if (typeof state.chromSizes !== "undefined" && "chromSizes" in state.chromSizes) {
            bwagent.chromSizes(state.chromSizes.chromSizes)
            bbagent.chromSizes(state.chromSizes.chromSizes)
        }
    }, [state.chromSizes])

    //SET BW DATA 
    useEffect(function() {
        if (typeof state.track == "undefined") {
            setBwData({})
            setBwLoading(false)
        }
        if (state.track && state.binsize !== null && state.genome && state.chromSizes) {
            setBwLoading(true)
            bwagent.fetch(state.track).then(function(d) {
                if (Object.keys(d).length == 0) {
                    return
                }
                setBwData(d)
                setBwLoading(false)
            }).catch(function(e) {
                setBwData(undefined)
                setBwLoading(false)
            })
        }
    }, [state.track, state.genome, state.binsize, state.chromSizes])
    useEffect(function() {
        setAnnoLoading(true)
        if (typeof state.anno == "undefined") {
            setAnnoData({})
            setAnnoLoading(false)
        }
        if (state.anno && state.chromSizes) {
            bbagent.fetch(state.anno).then(function(d) {
                setAnnoData(d)
                setAnnoLoading(false)
            }).catch(function(e) {
                setAnnoData({})
                setAnnoLoading(false)
            })

        }
    }, [state.anno, state.chromSizes])

    useEffect(function() {}, [state.colorfunc])
    useEffect(function() {

    }, [width, height])
    useEffect(function() {
        chan.on("brush.app", function(d) {
            dispatch({
                type: "BRUSH",
                data: d
            })
        })
        chan.on("update.app", function(d) {
            dispatch({
                type: "UPDATE",
                data: d
            })
        }) //LINK
        chan.on("set3dURL.app", function(d) {
            setInput(d || "")
            handle3DURL(d)
        })
        setInput(state.structureURL || "")
    }, [])
    return (
        <Paper className={classes.app}>
        <Typography component="div" style={{padding:0,position:"relative"}}>
        <AppContext.Provider value={{ state, dispatch}}>
        <Typography component="div">
        <AppBar localEvent={localEvent}/>
        </Typography>
        <Grid container xs={12} style={{backgroundColor:"#FAFAFA"}} >
            <Typography component="div" style={{height:5}}>
            </Typography>  
        </Grid>
        {!state.fullView?
        <Grid container 
            direction="row"
            justify="center"
            alignItems="center"
            className = {classes.row}
        >
        <Grid item xs={4} 
            >
        
        <Paper className={classes.ctrlPanel}
        >
        <Typography component="div" className={classes.root}>
        <TextField
          label="Structure URL"
          className = {classes.textField}
          defaultValue={state.structureURL || ""}
          placeholder="URL of chromosome 3d structure"
          margin="normal"
          value ={input}
          InputLabelProps={{
            shrink: true,
          }}
        onChange={
            handleInput
        }
        onKeyPress={
            handleEnter
        }
        onMouseOut={
            handleMouseOut
        }
        style = {{
            backgroundColor:state.structureURL===input?"white":"lightyellow",
        }}
        />
        </Typography>
        </Paper>
        </Grid>
        <Grid item xs={4} >
        {state.colorfunc!=="chr"?(
            <Paper className={classes.ctrlPanel}>
                <TrackDrop loading={bwLoading}/>
            </Paper>
        ):null}
        </Grid>
        <Grid item xs={4} >
        {state.annoInput?
            (<Paper className={classes.ctrlPanel}>
                <TrackBedDrop loading={annoLoading}/>
            </Paper>
            ):null}
        </Grid>
        </Grid>:null
        }
        <Grid container xs={12} style={{backgroundColor:"#FAFAFA"}} >
        {width > 0 ?<Nucle3D  localEvent={localEvent} chan={chan} width={width-2} height={height - 205} data={bwData} anno={annoData}/>:null}
        </Grid>
        </AppContext.Provider>
        </Typography>
        </Paper>
    )

}

export default App
