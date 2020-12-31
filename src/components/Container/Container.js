import React, { Component } from 'react';
import './Container.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, Product, TopNav } from '../';
import ContainerState from './ContainerState';

class Container extends Component {
    render() {
        return (
            <ContainerState>
                <div className="container">
                    <BrowserRouter>
                        <TopNav></TopNav>
                        <Switch>
                            <main>
                                <Route exact path='/' component={Home} />
                                <Route path='/xuat' component={Product} />
                            </main>
                        </Switch>
                    </BrowserRouter>
                </div>
            </ContainerState>
        );
    }
}

export default Container;