import React, { Component } from 'react';



class Product extends Component {


  render() {

    return (
      <div className="row">
        <div className="col-md-6">

          {/* Loai ruou */}

          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
            <label className="form-check-label" htmlFor="flexRadioDefault1">Default radio</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked></input>
            <label className="form-check-label" htmlFor="flexRadioDefault2">Default checked radio</label>
          </div>

          {/* Giá */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Giá</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Giá"></input>
          </div>


          {/* Số lượng */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Số lượng</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Số lượng"></input>
          </div>


          <label htmlFor="exampleDataList" className="form-label">Datalist example</label>
          <label htmlFor="exampleDataList" className="form-label">Datalist example</label>
          <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..."></input>
          <datalist id="datalistOptions">
            <option value=""></option>
            <option value="New York"></option>
            <option value="Seattle"></option>
            <option value="Los Angeles"></option>
            <option value="Chicago"></option>
          </datalist>
        </div>
      </div>
    )
  }
}

export default Product;
