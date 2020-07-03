import {parseBed} from "@nucleome/nb-tools"
var buffer = {}
// TODO DB
// TODO Same Interface for TrackHub bwAgent
//
// Change Fetch to Buffer OR DB Fetch for Both Bw and Bb
function bbAgent() {
    var chromSizes
    var agent = function() {

    }
    agent.fetch = function(t) {
        return new Promise(function(resolve, reject) {
            var chrSizes = Object.keys(chromSizes)
                .sort(function(a, b) {
                    return chromSizes[a] > chromSizes[b]
                })
            var p = chrSizes.map(function(k) {
                return fetch(t.server + "/" + t.prefix + "." + t.format + "/" + t.id + "/get/" + k + ":1-" + chromSizes[k], {importance:"low"})
                    .then(function(d) {
                        return d.text()
                    }).then(function(d) {
                        var v = d.trim().split("\n").map((d) => {
                            return parseBed(d)
                        })
                        return v.filter((d) => (d !== null))
                    })
                    .catch(function(e) {
                        return e
                    })
            })
            Promise.all(p).then(function(d) {
                var _d = {}
                chrSizes.forEach(function(c, i) {
                    _d[c] = {
                        length: chromSizes[c],
                        data: d[i]
                    }
                })
                resolve(_d)
            }).catch(function(e) {
                reject(e)
            })

        })
    }
    agent.chromSizes = function(_) {
        return arguments.length ? (chromSizes = _, agent) : chromSizes;
    }
    return agent
}

export default bbAgent
