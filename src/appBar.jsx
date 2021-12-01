import React, {
    useContext,
    useState
} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import IconLooks from '@material-ui/icons/Looks';
import IconConfig from '@material-ui/icons/Build';
import IconEdit from '@material-ui/icons/Edit';
import IconPrint from '@material-ui/icons/Print';

import IconLine from './icons/ThreeDLine';
import IconStick from './icons/ThreeDStick';
import IconCross from './icons/ThreeDCross';
import IconSphere from './icons/ThreeDBall';
import IconNone from '@material-ui/icons/Clear';
import IconChromosome from "./icons/Chromosome"
import IconTrack from "./icons/GenomeView";

import IconAnno from "@material-ui/icons/Grain"

import IconFullView from '@material-ui/icons/Fullscreen';
import IconRegularView from '@material-ui/icons/FullscreenExit';

import Switch from '@material-ui/core/Switch';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import IconCurrentChr from "@material-ui/icons/Book"
import IconCurrentRegion from "@material-ui/icons/MenuBook"
import IconHighlightRegion from "@material-ui/icons/BorderColor"


import {
    withStyles
} from '@material-ui/core/styles';
import {
    AppContext
} from "./app"

//import useStyles from "./styles"
import useStyles from "../../../src/styles"
const StyledToggleButtonGroup = withStyles(theme => ({
    grouped: {
        margin: theme.spacing(0.5),
        border: 'none',
        padding: theme.spacing(0, 1),
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}))(ToggleButtonGroup);


export default function ButtonAppBar(props) {
    const classes = useStyles();
    const [mode, setMode] = React.useState(1)
    const handleChange = event => {
        setMode(event.target.value)
    }
    const handleLocalMode = function(e, v) {
        dispatch({
            type: "SET_LOCALMODE",
            data: v
        })
    }
    const {
        localEvent
    } = props
    const {
        state,
        dispatch,
    } = useContext(AppContext);
    const handleAtomStyle = (event, newStyle) => {
        dispatch({
            type: 'UPDATE_ATOM_STYLE',
            data: newStyle,
        })

    };
    const handleLocal = (event) => {
        dispatch({
            type: "SET_LOCAL",
            data: event.target.checked
        })
    };
    const handleZoom1 = (event) => {
        localEvent.call("zoomToOne", this, {})
    }
    const handleColorfunc = (e, v) => {
        dispatch({
            type: "SET_COLORFUNC",
            data: v
        })
    }
    const handleConfig = (e, v) => {
        v = !v;
        dispatch({
            type: "SET_CONFIG",
            data: v
        })

    }
    const handleClickable = (e, v) => {
        v = !v;
        dispatch({
            type: "SET_CLICKABLE",
            data: v
        })
    }
    const handleAnno = (e, v) => {
        v = !v;
        dispatch({
            type: "SET_ANNOINPUT",
            data: v
        })

    }
    //TODO 
    //const [fullView, setFullView] = useState(false)
    //state ??
    const handleFullView = (e, v) => {
        //setFullView(true)
        dispatch({
            type: "SET_FULLVIEW",
            data: true
        })
    }
    const handleRegView = (e, v) => {
        dispatch({
            type: "SET_FULLVIEW",
            data: false
        })
    }
    const handlePrint = (e, v) => {
        localEvent.call("print",this,{})
    }

    return (
        <div className={classes.menubar}>
      <AppBar className={classes.appBar} position="static">
        {state.fullView? <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            
          </Typography>
        <Tooltip title="Zoom to 1x" aria-label="zoomToOne"> 
        <IconButton className={classes.iconButton} onClick={handleZoom1}>
            <IconLooks/>
        </IconButton>
        </Tooltip>
        <Tooltip title="To Regualar Panel View " aria-label="fullPanelView"> 
        <IconButton className={classes.iconButton} onClick={handleRegView}>
            <IconRegularView/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Print to PNG" aria-label="print"> 
        <IconButton className={classes.iconButton} onClick={handlePrint}>
            <IconPrint/>
        </IconButton>
        </Tooltip>


 
        </Toolbar> :
        <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
            
        </Typography>
        <Tooltip title="Zoom to 1x" aria-label="zoomToOne"> 
        <IconButton className={classes.iconButton} onClick={handleZoom1}>
            <IconLooks/>
        </IconButton>
        </Tooltip>
        <Tooltip title="To Full Panel View " aria-label="fullPanelView"> 
        <IconButton className={classes.iconButton} onClick={handleFullView}>
            <IconFullView/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Print to PNG" aria-label="print"> 
        <IconButton className={classes.iconButton} onClick={handlePrint}>
            <IconPrint/>
        </IconButton>
        </Tooltip>

     
        <Tooltip title="Enable select from 3D" aria-label="Enable3DSelect"> 
         <ToggleButton
             value = {state.clickable}
             selected = {state.clickable}
             onChange = {handleClickable}
             className = {classes.toggleButton}
            >
            <IconEdit/>
        </ToggleButton>
        </Tooltip>
         <Divider orientation="vertical" className={classes.divider} />
        <Tooltip title="Color By ..." aria-label="ColorBy"> 
<StyledToggleButtonGroup
          size="small"
          exclusive
          value ={state.colorfunc}
          onChange={handleColorfunc}
          aria-label="Color Function"
        >
          <ToggleButton value="chr" 
            className={classes.toggleButton}
            aria-label="chr">
            <IconChromosome/>
            </ToggleButton>
          <ToggleButton value="track" 
            className={classes.toggleButton}
        aria-label="track">
            <IconTrack />
            </ToggleButton>
         </StyledToggleButtonGroup>
        </Tooltip>
         <Divider orientation="vertical" className={classes.divider} />
        <Tooltip title="Annotations" aria-label="AddAnnotations"> 
   <ToggleButton value="annotation" 
            className={classes.toggleButton}
            onChange={handleAnno}
            selected={state.annoInput}
            value={state.annoInput}
        aria-label="annotation"
            >
            <IconAnno  />
            </ToggleButton>
        </Tooltip>


         <Divider orientation="vertical" className={classes.divider} />
        <StyledToggleButtonGroup
          size="small"
          exclusive
         value ={state.atomStyle}
          onChange={handleAtomStyle}
          aria-label="Atom Style"
        >
          <ToggleButton value="line" 
            className={classes.toggleButton}
        aria-label="Line">
            <IconLine/>
            </ToggleButton>
          <ToggleButton value="stick" 
            className={classes.toggleButton}
        aria-label="Stick">
            <IconStick/>
            </ToggleButton>
          <ToggleButton value="cross" 
            className={classes.toggleButton}
        aria-label="Cross">
            <IconCross/>
        </ToggleButton>
        <ToggleButton value="sphere" 
            className={classes.toggleButton}
        aria-label="Sphere">
            <IconSphere/>

        </ToggleButton>
   <ToggleButton value="hide" 
            className={classes.toggleButton}
        aria-label="None">
            <IconNone/>
      
        </ToggleButton>
        
         </StyledToggleButtonGroup>
        <Divider orientation="vertical" className={classes.divider} />
    
        <Tooltip title="Global/local Switch" aria-label="GLSwitch"> 
        <Switch className={classes.switch} checked={state.local} onChange={handleLocal}/>
        </Tooltip> 
    {state.local ? 
        <StyledToggleButtonGroup
          size="small"
          exclusive
         value ={state.localMode}
          onChange={handleLocalMode}
        >

          <ToggleButton value="chr" 
            className={classes.toggleButton}
        aria-label="Chr">
            <IconCurrentChr/>
            </ToggleButton>
          <ToggleButton value="current" 
            className={classes.toggleButton}
        aria-label="Current Region">
            <IconCurrentRegion/>
            </ToggleButton>
          <ToggleButton value="highlight" 
            className={classes.toggleButton}
        aria-label="Current Hightlight">
            <IconHighlightRegion/>
        </ToggleButton>
         </StyledToggleButtonGroup>
        :null}
        </Toolbar>}
      </AppBar>
    </div>
    );
}
