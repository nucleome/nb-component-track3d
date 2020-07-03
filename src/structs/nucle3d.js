function parseLine(l) {
    var a = l.split(",")
    return {
        "i": parseInt(a[0]),
        "x": parseFloat(a[1]),
        "y": parseFloat(a[2]),
        "z": parseFloat(a[3])
    }
}

function distance(a, b) {
    var dx = a.x - b.x
    var dy = a.y - b.y
    var dz = a.z - b.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
// Arithmetic mean
let getMean = function(data) {
    return data.reduce(function(a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};
// Standard deviation
let getSD = function(data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function(sq, n) {
        return sq + Math.pow(n - m, 2);
    }, 0) / (data.length - 1));
};

function center(a) { //add portion in future
    var ax = a.map(function(d) {
        return d.x
    })
    var ay = a.map(function(d) {
        return d.y
    })
    var az = a.map(function(d) {
        return d.z
    })
    var x = getMean(ax)
    var y = getMean(ay)
    var z = getMean(az)
    var sx = getSD(ax)
    var sy = getSD(ay)
    var sz = getSD(az)

    return {
        x: x,
        y: y,
        z: z,
        sx: sx,
        sy: sy,
        sz: sz
    }
}
export default function() {
    var binsize
    var genome
    var title
    var chrs = []
    var chr2idx = {}
    var nodesize = 1
    var inited = false
    //var chart = function(d) {

    //}
    var chart = {}
    /*
    chart.init = function(d) {

    }
    */
    chart.inited = function(_) {
        return arguments.length ? (inited = _, chart) : inited;
    }
    chart.read = function(d) {
        var lines = d.split("\n")
        var a = lines[0].split("\t")
        if (a[0] == "TITLE") {
            title = a[1]
        }
        a = lines[1].split("\t")
        if (a[0] == "GENOME") {
            genome = a[1]
        }
        a = lines[2].split("\t")
        if (a[0] == "BINSIZE") {
            binsize = parseInt(a[1].replace(/,/g, ""))
        }
        var j = -1
        for (var i = 3; i < lines.length; i++) {
            if (lines[i].length == 0) continue;
            a = lines[i].split("\t")
            if (a[0] == "CHR") {
                chrs.push({
                    name: a[1],
                    data: []
                })
                j++;
                chr2idx[a[1]] = j
            } else if (j >= 0) {
                chrs[j].data.push(parseLine(lines[i]))
            }
        }
        /* Guess Node Size */
        inited = true
        return chart
    }
    chart.guessNodeSize = function() {
        var s = 0.0
        var n = 0
        chrs.forEach(function(chr) {
            var l = chr.data.length
            for (var i = 0; i < l - 1; i++) {
                var d = distance(chr.data[i + 1], chr.data[i])
                if (d > 0) {
                    s += d
                    n += 1
                }
            }
        })
        return s / n
    }
    chart.ThreeDMol = function() {
        var mols = []
        var mols = chrs.map(function(chr) {
            var mol = []
            chr.data.forEach(function(d, i) {
                mol.push({
                    "chr": chr.name,
                    "index": d.i,
                    "serial": d.i,
                    "x": d.x,
                    "y": d.y,
                    "z": d.z,
                    "id": d.i,
                })
            })
            var l = mol.length
            for (var i = 0; i < l - 1; i++) {
                mol[i].bonds = [mol[i + 1].index]
                mol[i].bondOrder = [1]
            }
            return mol
        })
        return mols

    }
    chart.chrs = function(_) {
        return arguments.length ? (chrs = _, chart) : chrs;
    }
    chart.genome = function(_) {
        return arguments.length ? (genome = _, chart) : genome;
    }
    chart.title = function(_) {
        return arguments.length ? (title = _, chart) : title;
    }
    chart.binsize = function(_) {
        return arguments.length ? (binsize = _, chart) : binsize;
    }
    chart.nodesize = function(_) {
        return arguments.length ? (nodesize = _, chart) : nodesize;
    }
    chart.chr2idx = function(_) {
        return arguments.length ? (chr2idx = _, chart) : chr2idx;
    }
    //TODO Return
    chart.bed2xyz = function(bed) {
        var idx = chr2idx[bed.chr]
        var s = Math.floor(bed.start / binsize);
        var e = Math.ceil(bed.end / binsize);
        //name:,data:d[i]{i:,x:,y:,z:}
        var d = []
        //TODO Portion Problem, and re-calculate, bed to curve with portion weighted  
        for (var i = s; i < e; i++) { //TODO 
            d.push(chrs[idx].data[i])
        }

        if (d.length > 0) {
            return center(d)
        } else {
            return undefined
        }
    }


    //TODO bed2curve 
    chart.bed2curve = function(bed) {
        var idx = chr2idx[bed.chr]
        var s = Math.floor(bed.start / binsize);
        var e = Math.ceil(bed.end / binsize);
        var d = []
        var soffset = (bed.start - s * binsize) / binsize
        var eoffset = (e * binsize - bed.end) / binsize
        var l = chrs[idx].data.length
        var ds = {}
        var de = {}
        if (s < l - 1) {
            var d0 = chrs[idx].data[s]
            var d1 = chrs[idx].data[s + 1]
            ds["x"] = d0.x + (d1.x - d0.x) * soffset
            ds["y"] = d0.y + (d1.y - d0.y) * soffset
            ds["z"] = d0.z + (d1.z - d0.z) * soffset
        } else {
            var d0 = chrs[idx].data[s]
            ds["x"] = d0.x + nodesize * soffset
            ds["y"] = d0.y + nodesize * soffset //direction problem
            ds["z"] = d0.z + nodesize * soffset
        }
        d.push(ds)
        for (var i = s + 1; i < e - 1; i++) { //TODO 
            d.push(chrs[idx].data[i])
        }
        if (e < l - 1) {
            var d2 = chrs[idx].data[e - 1]
            var d3 = chrs[idx].data[e]
            if (typeof d2 !== "undefined") {
                de["x"] = d2.x + (d3.x - d2.x) * (1.0 - eoffset)
                de["y"] = d2.y + (d3.y - d2.y) * (1.0 - eoffset)
                de["z"] = d2.z + (d3.z - d2.z) * (1.0 - eoffset)
            } else {
                console.log("warning", d2, e - 1, e,bed)
            }
            d.push(de)
        } else {
            var d2 = chrs[idx].data[e - 1]
            de["x"] = d2.x + nodesize * (1.0 - eoffset)
            de["y"] = d2.y + nodesize * (1.0 - eoffset)
            de["z"] = d2.z + nodesize * (1.0 - eoffset)
            d.push(de)
        }
        return d
    }
    return chart
}
