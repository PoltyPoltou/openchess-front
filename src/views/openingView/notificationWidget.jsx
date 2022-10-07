import { Alert, Snackbar } from "@mui/material";
import React from "react";
class NotificationWidget extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }
    notify(data) {
        this.setState({ open: true, msg: data.msg, severity: data.severity })
    }
    render() {
        return <Snackbar
            open={this.state.open}
            onClose={() => this.setState({ open: false })}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <Alert variant="filled" severity={this.state.severity}>
                {this.state.msg}
            </Alert>
        </Snackbar>
    }
}
export default NotificationWidget