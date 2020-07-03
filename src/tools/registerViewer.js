import viewBridge from "../tools/viewBridge"
export default function(viewer, uri) {
    var _i
    if (!("_nbViewBridge" in window)) {
        window._nbViewBridge = {}
    }
    if (!(uri in _nbViewBridge)) { //TODO Channel Name
        window._nbViewBridge[uri] = viewBridge().chan("_viewBridge_" + uri).connect()

    }
    _i = window._nbViewBridge[uri].add(viewer)
    return _i
}
