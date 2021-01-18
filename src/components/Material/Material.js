import React, { Component } from 'react';
import Rice from './Rice/Rice';
import Yeast from './Yeast/Yeast';
import { Redirect, Route, Switch, Link } from 'react-router-dom'

class Material extends Component {


  render() {
    return (
      <div className="mt-3">       
        <Switch >
          <Redirect exact from="/material" to="/material/rice" />
          <Route exact path='/material/rice' component={Rice} />
          <Route exact path='/material/yeast' component={Yeast} />
        </Switch>
      </div>
    );

  }
}

export default Material;