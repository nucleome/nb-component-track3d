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


function TrackDrop(props) {
    const {
        loading
    } = props
    const myRef = useRef();
    const classes = useStyles();
    const {
        state,
        dispatch
    } = useContext(AppContext);
    const clearTrack = function() {
        dispatch({
            type: 'UPDATE_TRACK',
            data: undefined,
        })
    }
   

    useEffect(function() { //use effect after load???
        var track = state.track
        var entryDiv = select(myRef.current)
        function dropCallback(d) {
            if (d.format == "bigwig") {
                dispatch({
                    type: 'UPDATE_TRACK',
                    data: d,
                })
            }
        }
        addDrop(entryDiv, dropCallback)
    }, [])
    return (

        <Typography component="div" className={classes.root}>
            <Typography component="div" className={classes.typography} ref={myRef} style={{width:"100%",padding:5}} >
                <Typography component="div">
                <Typography component="span">
                {loading?<CircularProgress  size={18}
        thickness={6}/>:null}
                </Typography>
                {(state.track && state.track.id)?
                (<Typography component="span"> {state.track.longLabel || state.track.id}</Typography>):
                (<Typography component="span">Drop BigWig Track Here</Typography>)
                }
                </Typography>
                <Typography component="div">
                <Button onClick={clearTrack} variant="outlined" size="small" >Clear</Button>
                </Typography>
            </Typography>
        </Typography>
    )
}

export default TrackDrop
