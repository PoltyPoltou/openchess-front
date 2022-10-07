import React from "react";
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import CreateTree from "./front_tree";
import { ReactSVGPanZoom, INITIAL_VALUE, TOOL_AUTO } from "react-svg-pan-zoom";

import axios from "axios"

import "./openingView.css"
import ReactTooltip from "react-tooltip-rc";
import Chessground from "@react-chess/chessground";
import { hierarchy, tree } from "d3";
import AddOpeningWidget from "./openingView/addOpeningWidget";
import NotificationWidget from "./openingView/notificationWidget";
const rectSize = 55
class OpeningView extends React.Component {
    Viewer = React.createRef(null)
    addopenRef = React.createRef(null)
    snackbar = React.createRef(null)

    constructor(props) {
        super(props);
        this.state = {
            svgTool: TOOL_AUTO,
            svgValue: INITIAL_VALUE,
            color: true,
            openings: [],
            selectedOpening: null,
            selectedData: null,
        }
        this.hoveredData = null
        this.shouldFit = 0
        this.getHoveredData = this.getHoveredData.bind(this)
        this.setHoveredData = this.setHoveredData.bind(this)
        this.getSelectedData = this.getSelectedData.bind(this)
        this.setSelectedData = this.setSelectedData.bind(this)
        this.deleteSelectedNode = this.deleteSelectedNode.bind(this)
        this.setOpenings = this.setOpenings.bind(this)
        this.setSelectedOpening = this.setSelectedOpening.bind(this)
        this.addOpening = this.addOpening.bind(this)
        this.setSelectedOpening = this.setSelectedOpening.bind(this)
        this.deleteSelectedOpening = this.deleteSelectedOpening.bind(this)
    }

    handleError(msg) {
        this.snackbar.current.notify({ severity: "error", msg: msg })
    }

    handleWarning(msg) {
        this.snackbar.current.notify({ severity: "warning", msg: msg })
    }

    handleSuccess(msg) {
        this.snackbar.current.notify({ severity: "success", msg: msg })
    }

    handleInfo(msg) {
        this.snackbar.current.notify({ severity: "info", msg: msg })
    }

    addOpening(name, fen) {
        axios.post("http://localhost:8080/opening/", { fen: fen, name: name })
            .then((response) => {
                this.getOpenings()
                this.setSelectedOpening(response.data)
            })
            .catch((error) => { this.handleError(error.message) });
    }

    setOpenings(openings) {
        this.setState({ openings: openings })
        // loading the openings, set default value to selectedOpening
        if (openings && this.state.selectedOpening == null) {
            if (openings.length === 0) {
                this.handleWarning("No opening found")
            } else {
                this.setSelectedOpening(openings[0].id)
                this.getOpenings(openings[0].startingNode.id)
            }
        }
    }

    getOpenings() {
        axios.get("http://localhost:8080/opening/")
            .then((response) => this.setOpenings(response.data))
            .catch((error) => { this.handleError(error.message) });
    }

    getOpening(id, callback) {
        axios.get("http://localhost:8080/opening/" + id)
            .then((response) => callback(response.data))
            .catch((error) => { this.handleError(error.message) });
    }

    getNode(id, callback) {
        axios.get("http://localhost:8080/chessnode/" + id)
            .then((response) => callback(response.data))
            .catch((error) => { this.handleError(error.message) });
    }

    deleteSelectedNode() {
        if (this.getSelectedData().parentId !== -1) {
            this.setSelectedData(this.getSelectedData().parentId)
            axios.delete("http://localhost:8080/chessnode/" + this.getSelectedData().id)
                .then(response => this.setSelectedOpening(this.state.selectedOpening.id))
                .catch((error) => { this.handleError(error.message) });
        } else {
            this.handleError("Can't delete node that has no parent")
        }
    }

    deleteSelectedOpening() {
        let name = this.state.selectedOpening.name
        axios.delete("http://localhost:8080/opening/" + this.state.selectedOpening.id)
            .then(response => {
                this.handleSuccess("Opening " + name + " deleted");
                this.getOpenings();
            })
            .catch((error) => { this.handleError(error.message) });
        this.handleInfo("Deleting opening " + this.state.selectedOpening.name)
    }

    addNode(uci) {
        axios.post("http://localhost:8080/chessnode/" + this.getSelectedData().id, { uci: uci })
            .then(response => {
                this.setSelectedOpening(this.state.selectedOpening.id)
                this.setSelectedData(response.data)
            })
            .catch((error) => { this.handleError(error.message) });
    }

    setSelectedOpening(id) {
        this.getOpening(id, (data) => this.setState({ selectedOpening: data }))
    }

    getHoveredData() {
        return this.hoveredData
    }

    setHoveredData(data) {
        this.hoveredData = data
    }

    getSelectedData() {
        return this.state.selectedData
    }

    setSelectedData(id) {
        this.getNode(id, (data) => this.setState({ selectedData: data }))
    }

    getSelectedDataConfig() {
        if (this.state.selectedData && this.state.selectedOpening) {
            return {
                coordinates: false,
                fen: this.state.selectedData.fen,
                turnColor: this.state.selectedData.color,
                // orientation: this.state.selectedOpening.color,
                movable: {
                    free: false,
                    showDests: true,
                    dests: new Map(Object.entries(this.state.selectedData.moves))
                },
                draggable: { enabled: true },
                events: {
                    move: (from, to, pieceTaken) => this.addNode(from + to)
                }
            }
        } else {
            return {
                coordinates: false,
                movable: { free: false }
            }
        }
    }
    componentDidMount() {
        this.getOpenings()
    }

    componentDidUpdate() {
    }

    getTooltipContent(obj) {
        return () => < Chessground width={300} height={300} config={
            obj.getHoveredData() != null ?
                {
                    coordinates: false,
                    fen: obj.getHoveredData().fen,
                    lastMove: obj.getHoveredData().uci
                        ? [obj.getHoveredData().uci.substr(0, 2), obj.getHoveredData().uci.substr(2, 4)]
                        : undefined,
                    viewOnly: true,
                } : {}
        } />
    }

    render() {
        let x0 = Infinity;
        let x1 = -Infinity;
        let y0 = Infinity;
        let y1 = -Infinity;
        const openingData = this.state.selectedOpening === null ? null : this.state.selectedOpening.startingNode
        const chessDataHeriarchy = hierarchy(openingData ? openingData : [], d => d.children)
        const nodeData = tree().nodeSize([rectSize * 1.1, rectSize * 1.4])(chessDataHeriarchy).descendants()
        nodeData.forEach(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
            if (d.y > y1) y1 = d.y;
            if (d.y < y0) y0 = d.y;
        });
        let width = x1 - x0 + rectSize
        let height = y1 - y0 + rectSize
        return (
            <div className="openingDiv" >
                <nav className="verticalNavBar">
                    <ul>
                        <AddOpeningWidget addopening={this.addOpening} />
                        {this.state.openings.map(op =>
                            <li key={op.name}>
                                <a onClick={() => this.setSelectedOpening(op.id)} className={this.state.selectedOpening && op.id === this.state.selectedOpening.id ? 'selected' : undefined}>
                                    {op.name}
                                </a>
                            </li>)
                        }
                    </ul>
                </nav>
                <ReactSVGPanZoom
                    className="svgViewer"
                    ref={this.Viewer}
                    width={700} height={600}
                    detectAutoPan={false}
                    tool={this.state.svgTool} onChangeTool={(val) => this.setState({ svgTool: val })}
                    value={this.state.svgValue} onChangeValue={(val) => this.setState({ svgValue: val })}
                    background="none"
                    SVGBackground="none"
                    disableDoubleClickZoomWithToolAuto={true}
                >
                    <svg width={width} height={height}>
                        <CreateTree
                            setterSelectedData={this.setSelectedData}
                            setterTooltipData={this.setHoveredData}
                            width={width} height={height}
                            chessDataHeriarchy={chessDataHeriarchy}
                            nodeData={nodeData}
                        />
                    </svg>
                </ReactSVGPanZoom>
                <nav className="verticalNavBar">
                    <ul>
                        <li>
                            <button onClick={this.deleteSelectedOpening}>Delete Opening</button>
                        </li>
                        <li>
                            <button onClick={this.deleteSelectedNode}>Delete Node</button>
                        </li>
                    </ul>
                </nav>

                <ReactTooltip
                    className="tooltipView"
                    place="right"
                    effect="solid"
                    id="quickview"
                    globalEventOff="mousemove"
                    overridePosition={(
                        { left, top },
                        currentEvent, currentTarget, node) => {
                        const d = document.documentElement;
                        left = Math.min(d.clientWidth - node.clientWidth, left);
                        top = Math.min(d.clientHeight - node.clientHeight, top);
                        left = Math.max(0, left);
                        top = Math.max(0, top);
                        return { top, left }
                    }}
                    getContent={this.getTooltipContent(this)}
                />
                <Chessground contained={false} width={400} height={400} config={this.getSelectedDataConfig()}></Chessground>
                <NotificationWidget severity={this.state.snackSeverity} msg={this.state.snackMsg} ref={this.snackbar} />
            </div >
        )
    }
}

export default OpeningView