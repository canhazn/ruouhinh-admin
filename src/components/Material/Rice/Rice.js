import React, { Component } from 'react';

class Rice extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          
          {/* Số bao */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Số bao</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Số bao"></input>
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

export default Rice;
