import React, { Component } from 'react';

class Yeast extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6">

          {/* Số cân */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Số cân</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Số cân"></input>
          </div>

          {/* Giá */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Giá</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Giá"></input>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Yeast;
