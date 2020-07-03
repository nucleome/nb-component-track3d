//TODO Same Interface for TrackHub bwAgent
function bwAgent() {
    var binsize
    var genome
    var chromSizes
    var agent = function() {

    }
    agent.fetch = function(t) {
        return new Promise(function(resolve, reject) {
            var chrSizes = Object.keys(chromSizes).sort(function(a,b){
                return chromSizes[a] > chromSizes[b]
            })
            var p = chrSizes.map(function(k) {
                return fetch(t.server + "/" + t.prefix + "." + t.format + "/" + t.id + "/getbin/" + k + ":1-" + chromSizes[k] + "/" + binsize, {importance:"low"})
                    .then(function(d) {
                        return d.json()
                    }).catch(function(e){
                        console.log("fetching",k,e)
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
    agent.genome=function(_) {return arguments.length ? (genome= _, agent) : genome; }
    agent.binsize=function(_) {return arguments.length ? (binsize= _, agent) : binsize; }
    agent.chromSizes=function(_) {return arguments.length ? (chromSizes= _, agent) : chromSizes; }
    return agent
}

export default bwAgent

