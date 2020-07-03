import {
    dispatch
} from "@nucleome/nb-dispatch"

import {
    randomString
} from "@nucleome/nb-tools"


function ViewEvent() {
    var id
    var emit
    var chart = function(k) {
        id = k
    }
    chart.setView = function(d, b) {
        emit(d, id)
    }
    chart.emit = function(_) {
        return arguments.length ? (emit = _, chart) : emit;
    }
    return chart


}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function ViewBridge() {
    var chan = "viewBridgeDefaultChan"
    var chart = function() {

    }
    var ext = null
    chart.ext = function(_) {
        return arguments.length ? (ext = _, chart) : ext;
    }
    chart.chan = function(_) {
        return arguments.length ? (chan = _, chart) : chan;
    }
    var dis
    var iSend
    var modelSpace = {}
    var view

    //shared models add or remove from space
    chart.connect = function() {
        dis = dispatch("setView", "addModel").chanId(chan).extId(ext)
        dis.connect()
        iSend = false
        dis.on("setView", function(d) {
            view = d
            if (iSend) {
                iSend = false
            } else {
                Object.keys(viewers).forEach(function(k) {
                    viewers[k].setView(d, true)
                })
            }

            dis.on("addModel", function(d) {
                console.log("add Model", d)
            })

        })
        return chart
    }
    chart.disconnect = function() {
        dis.disconnect()
        return chart
    }
    var current = [];
    var emit = function(d, k) {
        if (!arraysEqual(current, d)) {
            Object.keys(viewers).forEach(function(k0) {
                var v = viewers[k0]
                if (k !== k0) {
                    v.setView(d, true)
                }
            })
            iSend = true
            dis.call("setView", this, d)
        }
        current = d
    }
    var viewers = {}
    var linkers = {}
    var events = []
    chart.add = function(viewer) {
        var k = randomString(8)
        viewers[k] = viewer
        var e = ViewEvent(k).emit(emit)
        linkers[k] = e
        viewer.linkViewer(e) //TODO Unlink e
        return k
    }
    chart.remove = function(i) {
        linkers[i].emit(function() {

        }).setView(function() {

        })
        delete viewers[i]
    }
    chart.disconnect = chart.remove
    chart.number = function() {
        return Object.keys(viewers).length
    }
    chart.current = function() {
        return view
    }


    return chart
}

export default ViewBridge
