import React from "react";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
    makeStyles
} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        display: 'flex',
        flexWrap: 'wrap',
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
    ,button: {
        fontSize: 14,
    }
}));

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function TestModal(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle)
    const [title, setTitle] = React.useState("Test")
    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (<Typography component="div" className={classes.root}>
      <Button variant="outlined" onClick={handleOpen} color="inherit" className={classes.button}>Open</Button>
      <Modal open={open} onClose={handleClose}
         aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Text in a modal</h2>
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
        </div>
      </Modal>
    </Typography>);
}
export default TestModal
