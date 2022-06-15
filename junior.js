let field = null
let state = []
let machine = null
const pixelSize = 10

function draw(field) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke()
    
    //draw grid
    field.forEach((row, i) => {
	for (let j = 0; j < row.length; j++) {
	    if (row[j] == 'B') {
		ctx.fillStyle = "black";
	    } else if (row[j] == 'W') {
		ctx.fillStyle = "white";
	    } else if (row[j] == 'R') {
		ctx.fillStyle = "red";
	    } else if (row[j] == 'G') {
		ctx.fillStyle = "green";
	    } else if (row[j] == 'U') {
		ctx.fillStyle = "blue";
	    } else if (row[j] == 'P') {
		ctx.fillStyle = "brown";
	    } else if (row[j] == 'A') {
		ctx.fillStyle = "pink";
	    } else if (row[j] == 'Y') {
		ctx.fillStyle = "yellow";
	    } else {
		ctx.fillStyle = "purple";
	    }
	    const x = j*pixelSize
	    const y = i*pixelSize
//            ctx.moveTo(x, y);
            ctx.fillRect(x, y, pixelSize, pixelSize)
            ctx.stroke();
	}
    })

}


function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIndexesOfField(field, pattern) {
    let i = 0
    let indexes = []
    for (const row of field) {
	const rowIndexes = getAllIndexes(row, pattern);
	indexes = indexes.concat(rowIndexes.map(j => [i, j, "right"]))
	i++
    }
    return indexes
}

replaceAt = function(s, index, replacement) {
    return s.substring(0, index) + replacement + s.substring(index + replacement.length);
}

function isMatchLeft(field, pattern, i, j) {
    for(let k = 0; k < pattern.length; k++) {
	if (j-k < 0) {
	    return false
	}
	if (pattern[k] == "*") {
	    continue
	}
	if (field[i][j-k] != pattern[k]) {
	    return false
	}
    }
    return true
}

function isMatchRight(field, pattern, i, j) {
    for(let k = 0; k < pattern.length; k++) {
	if (j+k >= field[i].length) {
	    return false
	}
	if (pattern[k] == "*") {
	    continue
	}
	if (field[i][j+k] != pattern[k]) {
	    return false
	}
    }
    return true
}

function isMatchUp(field, pattern, i, j) {
    for(let k = 0; k < pattern.length; k++) {
	if (i-k < 0) {
	    return false
	}
	if (pattern[k] == "*") {
	    continue
	}
	if (field[i-k][j] != pattern[k]) {
	    return false
	}
    }
    return true
}

function isMatchDown(field, pattern, i, j) {
    for(let k = 0; k < pattern.length; k++) {
	if (i+k >= field.length-1) {
	    return false
	}
	if (pattern[k] == "*") {
	    continue
	}
	if (field[i+k][j] != pattern[k]) {
	    return false
	}
    }
    return true
}


function getAllMatches(field, pattern) {
    let indexes = []
    for(let i = 0; i < field.length; i++) {
	let row = field[i]
	for (let j = 0; j < row.length; j++) {
	    if (isMatchUp(field, pattern, i, j)) {
		indexes.push([i, j, "up"])
	    }
	    if (isMatchDown(field, pattern, i, j)) {
		indexes.push([i, j, "down"])
	    }
	    if (isMatchLeft(field, pattern, i, j)) {
		indexes.push([i, j, "left"])
	    }
	    if (isMatchRight(field, pattern, i, j)) {
		indexes.push([i, j, "right"])
	    }
	}
    }
    return indexes
}

function applyMatch(field, match, pattern) {
    const i = match[0]
    const j = match[1]
    const dir = match[2]

    if (dir == "up") {
	for(let k = 0; k < pattern.length; k++) {
	    if (pattern[k] == "*") {
		continue
	    }
	    field[i-k][j] = pattern[k]
	}
    }
    if (dir == "down") {
	for(let k = 0; k < pattern.length; k++) {
	    if (pattern[k] == "*") {
		continue
	    }
	    field[i+k][j] = pattern[k]
	}
    }
    if (dir == "left") {
	for(let k = 0; k < pattern.length; k++) {
	    if (pattern[k] == "*") {
		continue
	    }
	    field[i][j-k] = pattern[k]
	}
    }
    if (dir == "right") {
	for(let k = 0; k < pattern.length; k++) {
	    if (pattern[k] == "*") {
		continue
	    }
	    field[i][j+k] = pattern[k]
	}
    }
}


function* all(field, prog) {
    //    console.log("all", JSON.stringify(prog))
    let anyMatches = false
    while(true) {
	for(const result of markov(field, prog)) {
	    // console.log("|", result)
	    if (!result) {
		//		console.log("all DONE")
		return
	    }
	    yield true
	}
    }
}

function* one(field, pattern) {
//    console.log("one", JSON.stringify(pattern))
    const target = pattern[0]
    const replace = pattern[1]
    const matches = getAllMatches(field, target);
    if (matches.length == 0) {
	yield false
	return
    }
//    console.log("matches", matches.length)
    const chosen = getRandomInt(0, matches.length-1)
    const match = matches[chosen]
    applyMatch(field, match, replace)
    yield true
}

function* sequence(field, prog) {
    //    console.log("sequence", JSON.stringify(prog))
    let anyMatch = false
    for (const pattern of prog) {
	//	console.log("> ", JSON.stringify(pattern))
	for(const result of markov(field, pattern)) {
	    // we dont care of result in sequence
	    if (result) {
		anyMatch = true
	    }
	    yield true
	}
    }
    if (!anyMatch) {
	console.log("sequence DONE")
	yield false
    }
}

function* markov(field, prog) {
    //    console.log("markov", JSON.stringify(prog))
    if (prog.length == 0) {
	yield false
	return
    }
    switch(true) {
    case (typeof(prog[0]) == 'object'):
	yield* sequence(field, prog)
	break
    case (prog[0] == 'all'):
	yield* all(field, prog[1])
	break
    default:
	yield* one(field, prog)
    }
}

function parseRules(rules) {
    
}

function restart() {
    const input = document.getElementById("input");
    prog = JSON.parse(document.getElementById("prog").value);
    field = input.value.split("\n").map(row => row.split(""))
    const canvas = document.getElementById("canvas")
    canvas.width = pixelSize*field[0].length
    canvas.height = pixelSize*field.length
    machine = markov(field, prog)
    // prog = parseRules(prog)
    // prog = prog.map(rule => {
//	return {rule: rule, state: 0}
  //  })
}

function update() {
    if (machine) {
	running = machine.next()
	if (running.done) {
	    machine = null
	    console.log("DONE")
	}
	draw(field)
    }
}

window.onload = function() {
    restart()
    setInterval(update, 1); // 33 milliseconds = ~ 30 frames per sec
}
