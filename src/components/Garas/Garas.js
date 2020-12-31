import React, { Component } from 'react';
import { GaraList } from './GaraList/GaraList';
import GaraDetail from './GaraDetail/GaraDetail';
import { Route, Switch } from 'react-router-dom'

class Garas extends Component {

  render() {
    return (
      <Switch>
        <Route exact path='/garas' component={GaraList} />
        <Route exact path='/garas/:garaId' component={GaraDetail} />
      </Switch>
    );

  }
}

export default Garas;