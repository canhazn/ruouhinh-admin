import React, { Component } from 'react';
import Rice from './Rice/Rice';
import Yeast from './Yeast/Yeast';
import { Redirect, Route, Switch, Link } from 'react-router-dom'

class Material extends Component {


  render() {
    return (
      <div>
        <div className="row p-3">
          <div className="col-6 text-center">
            <Link className="btn w-100 btn-link" to="rice">Nhập gạo</Link>
          </div>
          <div className="col-6 text-center">
            <Link className="btn w-100 btn-link" to="yeast">Nhập men</Link>
          </div>
        </div>
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