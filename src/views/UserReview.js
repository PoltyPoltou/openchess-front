import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { hierarchy, tree } from "d3";
import React from 'react';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO } from "react-svg-pan-zoom";
import CreateTree from './userView/front_tree';
import NotificationWidget from "./common/NotificationWidget";

const rectSize = 55
const toggleSx = (white) => {
    let wclr = '#e3f2fd'
    let bclr = '#000'
    let grey = '#777'
    let grey1 = '#666'
    return {
        borderWidth: '3pt',
        borderRadius: '10pt',
        backgroundColor: grey,
        color: wclr,
        '&:hover': {
            backgroundColor: grey1,
            color: wclr,
        },
        '&.Mui-selected': {
            backgroundColor: white ? wclr : bclr,
            color: !white ? wclr : bclr,
            fontWeight: 'bold',
        },
        '&.Mui-selected:hover': {
            backgroundColor: white ? wclr : bclr,
            color: !white ? wclr : bclr,
        },
    }
}
class UserReview extends React.Component {
    Viewer = React.createRef(null)
    notificationBar = React.createRef(null)

    constructor(props) {
        super(props);
        this.state = {
            svgTool: TOOL_AUTO,
            svgValue: INITIAL_VALUE,
            selectedOpening: null,
            color: "white",
            user: "poltypoltou",
        }
    }

    handleColor(event, clr) {
        if (clr !== null) {
            this.setState({ color: clr });
            }
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
        return <div>
            <ToggleButtonGroup value={this.state.color} exclusive onChange={(e, v) => this.handleColor(e, v)}>
                <ToggleButton value="white" sx={toggleSx(true)}>
                    White
                </ToggleButton>
                <ToggleButton value="black" sx={toggleSx(false)}>
                    Black
                </ToggleButton>
            </ToggleButtonGroup>
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
                        setterSelectedData={() => 0}
                        setterTooltipData={() => 0}
                        width={width} height={height}
                        chessDataHeriarchy={chessDataHeriarchy}
                        nodeData={nodeData}
                    />
                </svg>
            </ReactSVGPanZoom>
            <NotificationWidget ref={this.notificationBar} />
        </div>
    }
}

export default UserReview
