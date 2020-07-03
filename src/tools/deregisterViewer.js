export default function(uri,id) {
    window._nbViewBridge[uri].disconnect(id)
}
