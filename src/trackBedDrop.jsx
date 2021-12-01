import React from 'react';
import ReactDOM from "react-dom"
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
    useState,
    useContext,
    useEffect,
    useRef
} from 'react'
import {
    AppContext
} from "./app"
import addDrop from "./tools/addDrop";

import CircularProgress from '@material-ui/core/CircularProgress';
//import useStyles from "./styles"
import useStyles from "../../../src/styles"
import {select} from "d3-selection"
var colors = {
    "hic": "#DD0000",
    "bigwig": "#000000",
    "bigbed": "#0000FF"
}
var color = function(format) {
    return colors[format] || "#777"
}


function TrackBedDrop(props) {
    const {
        loading,
    } = props
    const myRef = useRef();
    const classes = useStyles();
    const {
        state,
        dispatch
    } = useContext(AppContext);

    const clearAnno = function() {
        dispatch({
            type: 'SET_ANNO',
            data: {},
        })
    }
    useEffect(function() { //use effect after load???
        var track = state.anno || {}
        var entryDiv = select(myRef.current)
        function dropCallback(d) {
            if (d.format == "bigbed") {
                track = d
                //render(dropDiv, track) //TODO ADD REVERSE
                dispatch({
                    type: 'SET_ANNO',
                    data: track,
                })
            }
        }
        addDrop(entryDiv, dropCallback)
    }, [])
    useEffect(function() {

    }, [state.anno])
    return (

        <Typography component="div" className={classes.root}>
            <Typography component="div">
                <Typography component="span">
            {loading?<CircularProgress  size={18}
            thickness={6}/>:null}
             </Typography> 
            <Typography component="span" className={classes.typography} ref={myRef} >
        {(state.anno && state.anno.id)?
                (<Typography component="span"> {state.anno.longLabel || state.anno.id}</Typography>):
                (<Typography component="span">Drop BigBed Track Here (Experimental) </Typography>)
                }
            </Typography>
            <Typography component="div">
            <Button onClick={clearAnno} variant="outlined" size="small">Clear</Button>
            </Typography>
            </Typography>
        </Typography>
    )
}

export default TrackBedDrop
