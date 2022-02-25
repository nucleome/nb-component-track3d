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
    var genomes = {'hg38AB':{
        'chr1A': 248956422,
        'chr2A': 242193529,
        'chr3A': 198295559,
        'chr4A': 190214555,
        'chr5A': 181538259,
        'chr6A': 170805979,
        'chr7A': 159345973,
        'chrXA': 156040895,
        'chr8A': 145138636,
        'chr9A': 138394717,
        'chr11A': 135086622,
        'chr10A': 133797422,
        'chr12A': 133275309,
        'chr13A': 114364328,
        'chr14A': 107043718,
        'chr15A': 101991189,
        'chr16A': 90338345,
        'chr17A': 83257441,
        'chr18A': 80373285,
        'chr20A': 64444167,
        'chr19A': 58617616,
        'chrYA': 57227415,
        'chr22A': 50818468,
        'chr21A': 46709983,
        'chr1B': 248956422,
        'chr2B': 242193529,
        'chr3B': 198295559,
        'chr4B': 190214555,
        'chr5B': 181538259,
        'chr6B': 170805979,
        'chr7B': 159345973,
        'chrXB': 156040895,
        'chr8B': 145138636,
        'chr9B': 138394717,
        'chr11B': 135086622,
        'chr10B': 133797422,
        'chr12B': 133275309,
        'chr13B': 114364328,
        'chr14B': 107043718,
        'chr15B': 101991189,
        'chr16B': 90338345,
        'chr17B': 83257441,
        'chr18B': 80373285,
        'chr20B': 64444167,
        'chr19B': 58617616,
        'chrYB': 57227415,
        'chr22B': 50818468,
        'chr21B': 46709983
        }}
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
