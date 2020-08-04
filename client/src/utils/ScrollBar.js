import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default class SpringScrollbars extends Component {

    scrollbars = React.createRef();

    state = {
        mounted: false,
    }

    componentDidMount() {
        this.setState({
            mounted: true
        });
    }

    componentDidUpdate() {
        if (this.props.scrolltobottom && this.props.scrolltobottom === '1') {
            this.state.mounted && this.scrollbars.current.scrollToBottom();
        }
    }

    render() {
        return (
            <Scrollbars
                {...this.props}
                ref={this.scrollbars}/>
        );
    }
}