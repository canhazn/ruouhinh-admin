import React, { Component } from 'react';
import './Container.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, Material, Product, TopNav } from '../';
import { Login, Logout } from '../Auth';

class Container extends Component {
    render() {
        return (

            <div className="container">
                <BrowserRouter>
                    <TopNav></TopNav>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/logout' component={Logout} />
                        <Route path='/xuat' component={Product} />
                        <Route path='/material' component={Material} />
                    </Switch>
                </BrowserRouter>
            </div>

        );
    }
}

export default Container;