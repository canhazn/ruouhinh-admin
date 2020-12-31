import React, { Component } from 'react';
import ContainerContext, { defaultLocation } from './ContainerContext';



class ContainerState extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <ContainerContext.Provider>
                {this.props.children}
            </ContainerContext.Provider>
        );
    }
}

export default ContainerState;