import { linkVertical, select } from 'd3';
import React from 'react';
import ReactTooltip from 'react-tooltip-rc';

const rectSize = 55
class CreateTree extends React.Component {
    svgRef = React.createRef(null)

    componentDidUpdate() {
        const svg = select(this.svgRef.current)


        const setterTooltipData = this.props.setterTooltipData
        const setterSelectedData = this.props.setterSelectedData
        const nodeData = this.props.nodeData
        const chessDataHeriarchy = this.props.chessDataHeriarchy
        const width = this.props.width
        nodeData.forEach(function (elmt, index, arr) {
            arr[index].x = elmt.x + width / 2 - rectSize / 2
            arr[index].y = elmt.y
        })
        svg.attr("id", "d3-tree-draw")
        const g = svg

        let sourcePos = d => [d.source.x + rectSize / 2, d.source.y + rectSize]
        const pathes = g.selectAll("path").data(chessDataHeriarchy.links(), d => d.source.data.id + "->" + d.target.data.id)
        pathes.enter().insert("path")
            .classed("line", true)
            .merge(pathes)
            // .attr("d", linkVertical().source(sourcePos).target(sourcePos))
            // .transition()
            // .duration(animTime)
            .attr("d", linkVertical()
                .source(sourcePos)
                .target(d => [d.target.x + rectSize / 2, d.target.y]))
        pathes.exit().remove()

        const nodes = g.selectAll("circle").data(nodeData)
        g.selectAll("circle").data(nodeData, d => d.data.id)
            .enter()
            .append("circle")
            .merge(nodes)
            //     .attr("x", d => d.parent ? d.parent.x : 0)
            //     .attr("y", d => d.parent ? d.parent.y : 0)
            .on("mousemove", (evt, obj, n) => {
                setterTooltipData(obj.data)
            })
            .on("click", (evt, obj, n) => {
                setterSelectedData(obj.data.id)
            })
            .attr("data-tip", "")
            .attr("data-event", "mousemove")
            .attr("data-event-off", "click")
            .attr("data-for", "quickview")
            //     // .on("mouseover", function (evt, d) { d.hovered = true; updateTree() })
            //     // .on("mouseout", function (evt, d) { d.hovered = false; updateTree() })
            .classed("node", true)
            .classed("whiteMove", d => d.data.color === "white")
            .classed("blackMove", d => d.data.color === "black")
            //     .classed("hovered", d => d.hovered)
            //     .classed("activeNode", d => d.active)
            //     .transition()
            //     .duration(animTime)
            .attr("cx", d => d.x + rectSize / 2)
            .attr("cy", d => d.y + rectSize / 2)
        nodes.exit().remove()

        const texts = g.selectAll("text").data(nodeData, d => d.data.id)
        texts.enter()
            .append("text")
            .classed("nodeText", true)
            .merge(texts)
            // .merge(texts)
            //     // .attr("x", d => d.parent ? d.parent.x + rectSize / 2 : rectSize / 2)
            //     // .attr("y", d => d.parent ? d.parent.y + rectSize / 2 : rectSize / 2)
            .text(d => d.data.san)
            //     // .classed("hovered", d => d.hovered)
            //     // .transition()
            //     // .duration(animTime)
            .attr("x", d => d.x + rectSize / 2)
            .attr("y", d => d.y + rectSize / 2)
        texts.exit().remove()

        ReactTooltip.rebuild()
    }

    render() {
        return <g ref={this.svgRef}>
        </g>
    }
}


export default CreateTree
