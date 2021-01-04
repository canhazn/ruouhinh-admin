import React, { Component } from 'react';
import './Container.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, Material, Product, TopNav } from '../';

class Container extends Component {
    render() {
        return (

            <div className="container">
                <BrowserRouter>
                    <TopNav></TopNav>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/xuat' component={Product} />
                        <Route path='/material' component={Material} />
                    </Switch>
                </BrowserRouter>
            </div>

        );
    }
}

export default Container;