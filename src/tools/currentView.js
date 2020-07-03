import viewBridge from "./viewBridge"
export default function(uri) {
    var _i
    if (!(uri in _nbViewBridge)) { //TODO Channel Name
        return undefined
    } else {
        return window._nbViewBridge[uri].current()
    }
}
