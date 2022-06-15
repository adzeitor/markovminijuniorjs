const examples = [
    {
	name: "simplest prog",
	prog: `["all", ["B", "W"]]`,
    },
    {
	name: "growth model",
	prog:`
[
  ["B", "Y"],
  ["all", ["BY", "YY"]]
]`,
    },
    {
	name:"filling labyrinth",
	prog:`
["all",[
  ["B", "W"],
  ["all",["WBB", "WAW"]],
  ["all",["A", "W"]],
  ["W", "Y"],
  ["W", "G"],
  ["W", "U"],
  ["all", [
    ["YW", "YY"],
    ["UW", "UU"],
    ["GW", "GG"]
  ]],
  ["all", ["G", "B"]],
  ["all", ["Y", "B"]],
  ["all", ["U", "B"]]
]]`
    },
    {
	name:"LoopErasedWalk",
	prog:`
[
  ["B", "R"],
  ["all", [
    ["RBB", "WWR"],
    ["RBW", "GWP"],
    ["PWG", "PBU"],
    ["UWW", "BBU"],
    ["UWP", "BBR"]
  ]]
]`
    },
    {
	name:"maze",
	prog:`
[
  ["B", "R"],
  ["all", [
    ["all", ["RBB", "UUR"]],
    ["RUU", "YYR"]
  ]]
]
`
    },
    {
	name: "river with mountain",
	prog:`
[
  ["B", "W"],
  ["B", "R"],
  ["all", [
    ["WB", "WW"],
    ["RB", "RR"]
  ]],
  ["all", [
    ["RW", "UU"],
    ["W", "B"],
    ["R", "B"]
  ]],
  ["all", [
    ["UBB", "UGB"]
  ]],
  ["B", "P"],
  ["B", "P"],
  ["all", [
    ["GB", "GG"],
    ["PB", "PP"]
  ]]
]
`
    }
]
const examplesSelect = document.getElementById("examplesList")
const progInput = document.getElementById("prog")
examples.forEach(example => {
    const opt = document.createElement('option')
    opt.value = example.prog
    opt.innerHTML = example.name
    examplesSelect.appendChild(opt)
})

function chooseExample(event) {
    progInput.value = event.value
    restart()
}
