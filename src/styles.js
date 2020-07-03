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
    menubar: {
        flexGrow: 1,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 168,
        fontSize: 16,
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 14,
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    toggleButton: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        height: 30,
        fontSize: 14,
        minWidth: 25,
    },

    appBar: {
        fontSize: 24,
        fontWeight: "bold",
        backgroundColor: "#FFFFFF",
        color: "#27282E"
    },
    title: {
        flexGrow: 1,
        fontSize: 18,
        fontWeight: "bold"
    },
    button: {
        fontSize: 18,
    },
    app: {
        padding:0,
    },
    divider: {
        alignSelf: 'stretch',
        height: 'auto',
        margin: theme.spacing(1, 0.5),
    },
    iconButton: {
        fontSize: 18,
    },
    div: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 16,
    },
    span: {
        paddingLeft: 5,
        fontSize: 12,
    },
    icon: {
        display: "block",
    },
    mycard: {
        backgroundColor: "#FFFFFF"
    },
    card: {
        minWidth: 200,
        minHeight: 40,
    },
    row: {
        minHeight:135,
    },
    paper: {
        padding: 10,
    },
    ctrlPanel: {
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
        minHeight: 80,
    },
    legendContent: {
        color: "#666",
        fontSize : 12
    }

}));

export default useStyles
