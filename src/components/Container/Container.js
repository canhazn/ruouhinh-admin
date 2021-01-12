import React, { Component } from 'react';
import './Container.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, Material, Product, TopNav } from '../';
import { Login, Logout } from '../Auth';
import { ProtectedRoute } from "./ProtectedRoute";

class Container extends Component {
    render() {
        return (
            <div >
                <BrowserRouter>
                    <TopNav></TopNav>
                    <div className="container">
                        <Switch>
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/logout' component={Logout} />
                            <ProtectedRoute exact path='/' component={Home} />
                            <ProtectedRoute path='/xuat' component={Product} />
                            <ProtectedRoute path='/material' component={Material} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default Container;