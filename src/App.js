import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { Material, Product, TopNav } from './components';
import { Login, Logout } from './components';
import { ProtectedRoute } from "./components/ProtectedRoute";


export class App extends Component {

  render() {
    return (
      <div >
        <BrowserRouter>
          <TopNav></TopNav>
          <div className="container">
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/logout' component={Logout} />
              <Redirect exact from="/" to="/xuat/" />
              <ProtectedRoute path='/xuat' component={Product} />
              <ProtectedRoute path='/material' component={Material} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;