import React from "react";
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import CreateTree from "./front_tree";
import { ReactSVGPanZoom, INITIAL_VALUE, TOOL_AUTO } from "react-svg-pan-zoom";

import "./openingView.css"
import ReactTooltip from "react-tooltip-rc";
import Chessground from "@react-chess/chessground";

class OpeningView extends React.Component {
    Viewer = React.createRef(null)

    constructor(props) {
        super(props);
        this.state = {
            svgTool: TOOL_AUTO,
            svgValue: INITIAL_VALUE,
            openingTree: null,
            color: true,
        }
    }

    componentDidMount() {
        this.Viewer.current.fitToViewer()
        ReactTooltip.rebuild()
    }

    render() {
        return (
            <div className="openingDiv" >
                <ReactSVGPanZoom
                    className="svgViewer"
                    ref={this.Viewer}
                    width={700} height={600}
                    detectAutoPan={false}
                    tool={this.state.svgTool} onChangeTool={(val) => this.setState({ svgTool: val })}
                    value={this.state.svgValue} onChangeValue={(val) => this.setState({ svgValue: val })}
                    background="none"
                    scaleFactorMin={1}
                >
                    <svg width={700} height={700}>
                        <CreateTree />
                    </svg>
                </ReactSVGPanZoom>
                <ReactTooltip
                    effect="solid"
                    id="fen"
                    globalEventOff="click"
                    place="right"
                    getContent={(fen) =>
                        <Chessground width={250} height={250} config={{ fen: fen, viewOnly: true }} />
                    } />
            </div >
        )
    }
}

export default OpeningView