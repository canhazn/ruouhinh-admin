import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Material, Cargo, Order, Home, TopNav, LogDb } from './components';
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
              <ProtectedRoute path='/kho' component={Cargo} />
              <ProtectedRoute path='/ban' component={Order} />
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