import graphic_utilities from "./graphic_utilities.js"

var root = undefined
var resetTransform = undefined

function updateTree() {
    const g = d3.selectAll("#treeDraw")
    const nodeData = d3.tree()(root).descendants()
    g.selectAll("text").data(nodeData).classed("hovered", d => d.hovered)
    g.selectAll("rect").data(nodeData)
        .classed("hovered", d => d.hovered)
        .classed("activeNode", d => d.active)
}

function createTree(root) {
    const rectSize = 55 //d3.select("rect.node").width
    const animTime = 500
    const sizeSvg = [document.querySelector("#container").width.animVal.value, document.querySelector("#container").height.animVal.value]
    const tree = d3.tree().nodeSize([rectSize * 1.1, rectSize * 1.4])(root)
    const nodeData = tree.descendants()
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
        if (d.y > y1) y1 = d.y;
        if (d.y < y0) y0 = d.y;
    });

    const g = d3.selectAll("#treeDraw")
    const pathes = g.selectAll("path").data(root.links(), d => d.source.data.id() + "->" + d.target.data.id())
    let sourcePos = d => [d.source.x + rectSize / 2, d.source.y + rectSize]
    pathes.enter().insert("path")
        .classed("line", true)
        .merge(pathes)
        .attr("d", d3.linkVertical().source(sourcePos).target(sourcePos))
        .transition()
        .duration(animTime)
        .attr("d", d3.linkVertical()
            .source(sourcePos)
            .target(d => [d.target.x + rectSize / 2, d.target.y]))

    pathes.exit().remove()

    const nodes = g.selectAll("rect").data(nodeData, d => d.data.id())
    nodes.enter().append("rect")
        .merge(nodes)
        .attr("x", d => d.parent ? d.parent.x : 0)
        .attr("y", d => d.parent ? d.parent.y : 0)
        //.on("click", function (evt, obj, n) { setNode(obj) })
        .on("mouseover", function (evt, d) { d.hovered = true; updateTree() })
        .on("mouseout", function (evt, d) { d.hovered = false; updateTree() })
        .classed("node", true)
        .classed("whiteMove", d => d.depth % 2 == 1)
        .classed("blackMove", d => d.depth % 2 == 0)
        .classed("hovered", d => d.hovered)
        .classed("activeNode", d => d.active)
        .transition()
        .duration(animTime)
        .attr("x", d => d.x)
        .attr("y", d => d.y)
    nodes.exit().remove()

    const texts = g.selectAll("text").data(nodeData, d => d.data.id())
    texts.enter()
        .append("text")
        .classed("nodeText", true)
        .merge(texts)
        .attr("x", d => d.parent ? d.parent.x + rectSize / 2 : rectSize / 2)
        .attr("y", d => d.parent ? d.parent.y + rectSize / 2 : rectSize / 2)
        .text(d => d.data.san)
        .classed("hovered", d => d.hovered)
        .transition()
        .duration(animTime)
        .attr("x", d => d.x + rectSize / 2)
        .attr("y", d => d.y + rectSize / 2)
    texts.exit().remove()

    const scale = Math.min(sizeSvg[0] / (x1 - x0 + rectSize * 1.5), sizeSvg[1] / (y1 - y0 + rectSize * 1.5))
    resetTransform = d3.zoomIdentity.scale(scale).translate(-x0, -y0)
}

function chessGameToTree(game) {
    return d3.hierarchy(game, d => d.children)
}

function refreshTree(pgn) {
    root = chessGameToTree(pgn)
    createTree(root)
    container.call(treeZoom.transform, getResetTransform())
}

function getRoot() {
    return root
}
function getResetTransform() {
    return resetTransform
}


function resetZoom() {
    container.transition().duration(1000).call(treeZoom.transform, getResetTransform())
}

const treeZoom = d3.zoom()
    .on("zoom", (evt) => svg.attr("transform", evt.transform))
    .on("start", graphic_utilities.startDrag)
    .on("end", graphic_utilities.endDrag)

const container = d3.select("#treeDiv")
    .append("svg")
    .attr("id", "container")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(treeZoom)

const svg = container.append("svg")
    .attr("id", "drawer")
    .attr("overflow", "visible")
svg.append("g").attr("id", "treeDraw")

export default {
    getResetTransform,
    getRoot,
    refreshTree,
    updateTree,
    resetZoom
}