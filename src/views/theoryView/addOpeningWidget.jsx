import React from "react"
import ReactTooltip from "react-tooltip-rc"

class AddOpeningWidget extends React.Component {
    nameRef = React.createRef()
    fenRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            name: "",
        }
    }
    handleKey(e) {
        if (e.key === "Enter") {
            this.submit()
        }
    }
    submit() {
        ReactTooltip.hide(this.addopenRef)
        this.props.addopening(this.state.name, this.state.fen)
        this.fenRef.current.value = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        this.nameRef.current.value = ""
        this.setState({ fen: this.fenRef.current.value, name: this.nameRef.current.value })
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
                    <input ref={this.nameRef}
                        type="text"
                        placeholder="Name"
                        onKeyDown={this.handleKey}
                        onChange={event => this.setState({ name: event.target.value })} />

                    <p>Starting Position</p>
                    <input ref={this.fenRef}
                        type="text"
                        defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        onKeyDown={this.handleKey}
                        onChange={event => this.setState({ fen: event.target.value })}
                    />

                    <button onClick={(e) => this.submit()}>Add</button>
                </div >}
            />
        </>
    }
}
export default AddOpeningWidget