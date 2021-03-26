import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { Material, Product, Home, TopNav, LogDb } from './components';
import { Login } from './components';
import { ProtectedRoute } from "./components/ProtectedRoute";


export class App extends Component {

  render() {
    return (
      <div >
        <BrowserRouter>
          <TopNav></TopNav>
          <div className="container-md">
            <Switch>
              <Route exact path='/login' component={Login} />              
              {/* <Redirect exact from="/" to="/xuat/" /> */}
              <ProtectedRoute exact path='/' component={Home} />
              <ProtectedRoute path='/ban' component={Product} />
              <ProtectedRoute path='/nhap' component={Material} />
              <ProtectedRoute path='/notify' component={LogDb} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;