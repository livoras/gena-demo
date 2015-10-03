import Gena from "./gena"

let $map = $("#map")
let width = $map.width()
let size = 16
let cellWidth = width / size
let cells = []

let target = {}
let start = {}

function createMap() {
  for(let x = 0, len = size; x < len; x++) {
    let col = []
    cells.push(col)
    for(let y = 0, innerLen = size; y < innerLen; y++) {
      let $cell = $("<div class='cell'></div>")
      col.push($cell)
      $cell.css({
        position: "absolute",
        width: cellWidth + "px",
        height: cellWidth + "px",
        left: x * cellWidth + "px",
        top: y * cellWidth + "px"
      })
      $map.append($cell)
    }
  }
}

function makeTarget(x, y) {
  clearTarget()
  target = {x, y}
  cells[x][y].css({
    outline: "2px solid red"
  })
}

function clearTarget() {
  if (target.x === void 666 || target.y === void 66) return
  cells[target.x][target.y].css({
    outline: "1px solid #ccc"
  })
}

function makeStart(x, y) {
  if (x === start.x && y === start.y) return
  clearStart()
  start = {x, y}
  cells[x][y].css({
    outline: "2px solid blue"
  })
}

function clearStart() {
  if (start.x === void 666 || start.y === void 66) return
  cells[start.x][start.y].css({
    outline: "1px solid #ccc"
  })
}

function makePace(x, y) {
  // clearPace()
  cells[x][y].css({
    outline: "2px solid green"
  })
}

function clearPace(x, y) {
  cells[x][y].css({
    outline: "1px solid #ccc"
  })
}

let rocks = null
function makeRocks(toSetRocks) {
  rocks = toSetRocks
  rocks.forEach(function(rock) {
    makeRock(rock)
  })
}

function makeRock(rock) {
  let {x, y} = rock
  cells[x][y].css({
    outline: "2px solid yellow",
    "background-color": "#000"
  })
}

function clearAll() {
  for(let x = 0, len = size; x < len; x++) {
    for(let y = 0, innerLen = size; y < innerLen; y++) {
      cells[x][y].css({
        outline: "1px solid #ccc",
        "background-color": "transparent"
      })
    }
  }
}

let directions = {
  "10": {x: -1, y: 0},
  "01": {x: 1, y: 0},
  "00": {x: 0, y: -1},
  "11": {x: 0, y: 1},
}

function walk(seq, isShow) {
  let current = {x: start.x, y: start.y}
  for(let i = 0, len = seq.length / 2; i < len; i++) {
    let directKey = seq[i * 2] + seq[i * 2 + 1]
    let direct = directions[directKey]
    let old = {x: current.x, y: current.y}
    current.x += direct.x
    current.y += direct.y
    if (isCrash(current)) {
      return old
    }
    if (!isShow) continue
    ;((x, y) => {
      setTimeout(function() {
        // clearPace(old.x, old.y)
        makePace(x, y)
      }, i * 100)
    })(current.x, current.y)
  }
  return current
}

function isCrash(current) {
  if(current.x < 0 || current.x >= size || current.y < 0 || current.y >= size) {
    return true
  }
  for(let i = 0, len = rocks.length; i < len; i++) {
    let rock = rocks[i]
    if(rock.x === current.x && rock.y === current.y) {
      return true
    }
  }
}

createMap()

// =================== Test logic

function init() {

clearAll()
makeStart(0, 15)
makeTarget(15, 13)
makeRocks([
  {x: 7, y: 7}, 
  {x: 7, y: 6}, 
  {x: 7, y: 5},
  {x: 7, y: 4},
  {x: 7, y: 3},
  {x: 7, y: 2},
  {x: 7, y: 1},
  {x: 7, y: 0},

  {x: 7, y: 15}, 
  {x: 7, y: 14}, 
  {x: 7, y: 13}, 
  {x: 7, y: 12}, 
  {x: 7, y: 11}, 
  {x: 7, y: 10}, 
  {x: 7, y: 9}, 
])

let PACES_COUNT = Math.abs(target.x - start.x) + Math.abs(target.y - start.y)

let ga = new Gena({
  geneLength: PACES_COUNT * 8,
  mutateProbability: 0.9,
  doneFitness: 1,
  populationSize: 800,
  generationsSize: 200,
  getFitness: function(gene) {
    let finalPos = walk(gene)
    let dist = Math.abs(finalPos.x - target.x) + Math.abs(finalPos.y - target.y)
    return 1 - (dist / (size * 2))
  },
  done: function(results) {
    console.log("Get Result:", results)
    results.forEach((result) => {
      walk(result.gene, true)
    })
  },
  onGeneration: function(generation, genes) {
    console.log(generation, this.fitnesses)
  },
  outOfGenerationsSize: function(generations, fitnesses) {
    console.log("Out of generations: ", generations, fitnesses)
    walk(generations[0], true)
  }
})

ga.start()

}

window.init = init
init()

$("#start").click(init)
