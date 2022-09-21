import Chessground from "@react-chess/chessground";
import { Component } from "react";
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
export class ChessView extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <Chessground width="500px" height="500px" />
            </div>
        )
    }
}
