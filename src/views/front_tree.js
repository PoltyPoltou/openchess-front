import { hierarchy, linkVertical, select, tree } from 'd3';
import React from 'react';

const gameTest = {
    san: "Root",
    id: "0",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    color: "black",
    children: [
        { san: "e4", children: [], id: "1", color: "white" },
        { san: "d4", children: [], id: "2", color: "white" }
    ]
}

const chessDataHeriarchy = hierarchy(gameTest, d => d.children)

const CreateTree = () => {
    const svgRef = React.useRef(null)

    const rectSize = 55

    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;

    chessDataHeriarchy.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
        if (d.y > y1) y1 = d.y;
        if (d.y < y0) y0 = d.y;
    });
    const height = y1 - y0 + rectSize + 2
    const width = x1 - x0 + rectSize + 2

    React.useEffect(() => {

        const svg = select(svgRef.current)

        svg.attr("id", "d3-tree-draw")

        // const animTime = 500
        const nodeData = tree().nodeSize([rectSize * 1.1, rectSize * 1.4])(chessDataHeriarchy).descendants()

        nodeData.forEach(function (elmt, index, arr) {
            arr[index].x = elmt.x + rectSize / 2 + 3.5
            arr[index].y = elmt.y + 1
        }
        )
        const g = svg

        let sourcePos = d => [d.source.x + rectSize / 2, d.source.y + rectSize]
        const pathes = g.selectAll("path").data(chessDataHeriarchy.links(), d => d.source.data.id + "->" + d.target.data.id)
        pathes.enter().insert("path")
            .classed("line", true)
            .merge(pathes)
            .attr("d", linkVertical().source(sourcePos).target(sourcePos))
            // .transition()
            // .duration(animTime)
            .attr("d", linkVertical()
                .source(sourcePos)
                .target(d => [d.target.x + rectSize / 2, d.target.y]))
        pathes.exit().remove()

        const nodes = g.selectAll("rect").data(nodeData)
        g.selectAll("rect").data(nodeData, d => d.data.id)
            .enter()
            .append("rect")
            .merge(nodes)
            //     .attr("x", d => d.parent ? d.parent.x : 0)
            //     .attr("y", d => d.parent ? d.parent.y : 0)
            .on("mousemove", function (evt, obj, n) {
                if (evt.shiftKey) {
                    console.log("d3")
                }
            })
            .attr("data-tip", d => d.data.fen)
            .attr("data-event", "click")
            .attr("data-for", "fen")
            //     // .on("mouseover", function (evt, d) { d.hovered = true; updateTree() })
            //     // .on("mouseout", function (evt, d) { d.hovered = false; updateTree() })
            .classed("node", true)
            .classed("whiteMove", d => d.data.color === "white")
            .classed("blackMove", d => d.data.color === "black")
            //     .classed("hovered", d => d.hovered)
            //     .classed("activeNode", d => d.active)
            //     .transition()
            //     .duration(animTime)
            .attr("x", d => d.x)
            .attr("y", d => d.y)

        const texts = g.selectAll("text").data(nodeData, d => d.data.id)
        texts.enter()
            .append("text")
            .classed("nodeText", true)
            // .merge(texts)
            //     // .attr("x", d => d.parent ? d.parent.x + rectSize / 2 : rectSize / 2)
            //     // .attr("y", d => d.parent ? d.parent.y + rectSize / 2 : rectSize / 2)
            .text(d => d.data.san)
            //     // .classed("hovered", d => d.hovered)
            //     // .transition()
            //     // .duration(animTime)
            .attr("x", d => d.x + rectSize / 2)
            .attr("y", d => d.y + rectSize / 2)
        // texts.exit().remove()
    })

    return <g height={500} width={500} ref={svgRef}>
    </g>
}


export default CreateTree
