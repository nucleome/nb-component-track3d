//TODO: Agent With Local Storage Save to Local Forage
//      Agent .db
//      Agent .remote

function parse(d) {
    var l = d.split("\n")
    var k = {
    }
    l.forEach(function(d){
        var a = d.split("\t")
        if (a.length > 0) {
            k[a[0]] = parseInt(a[1])
       }
    })
    return k
}
function chromSizes(genome) {
    var genomes = {}
    var agent = function() {

    }
    agent.fetch = function(genome) {
        return new Promise(function(resolve, reject) {
            if (typeof genome == "undefined") {
                reject({error:"genome is undefined"})
            } else if (genome in genomes) {
                resolve({genome:genome,chromSizes:genomes[genome]})
            } else {
                var uri = "https://hgdownload.cse.ucsc.edu/goldenPath/" + genome + "/bigZips/" + genome + ".chrom.sizes"
                fetch(uri).then(function(d) {
                        return d.text()
                    })
                    .then(
                        function(d) {
                            var g = parse(d)
                            genomes[genome] = g
                            resolve({genome:genome,chromSizes:g})
                        }
                    ).catch(
                        function(e) {
                            reject(e)
                        }
                    )
            }
        })
    }
    return agent
}
export default chromSizes
