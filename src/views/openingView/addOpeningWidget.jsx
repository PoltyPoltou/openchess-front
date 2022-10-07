import React from "react"
import ReactTooltip from "react-tooltip-rc"

class AddOpeningWidget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            fen: "",
            name: "",
        }
    }

    submit() {
        this.props.addopening(this.state.name, this.state.fen)
        ReactTooltip.hide(this.addopenRef)
    }

    render() {
        return <>
            <li key="parent">
                <button onClick={() => 0} data-for="addopening" data-tip="" data-event="click">
                    Add opening
                </button>
            </li>
            <ReactTooltip
                place="right"
                effect="solid"
                id="addopening"
                ref={this.addopenRef}
                clickable={true}
                getContent={() => <div display="flex">
                    <p>Opening Name</p>
                    <input type="text" placeholder="Name" onChange={event => this.setState({ name: event.target.value })} />
                    <p>Starting Position</p>
                    <input type="text"
                        placeholder="Fen"
                        defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        onChange={event => this.setState({ fen: event.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") this.submit() }}
                    />

                    <button onClick={this.submit}>Add</button>
                </div >}
            />
        </>
    }
}
export default AddOpeningWidget