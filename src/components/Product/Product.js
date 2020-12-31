import React, { Component } from 'react';
import styles from './Product.module.css';


class Product extends Component {


  render() {

    return (
      <div class="row">
        <div className="col-md-6">

          {/* Loai ruou */}

          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
            <label class="form-check-label" for="flexRadioDefault1">Default radio</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked></input>
            <label class="form-check-label" for="flexRadioDefault2">Default checked radio</label>
          </div>

          {/* Giá */}
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Giá</label>
            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Giá"></input>
          </div>


          {/* Số lượng */}
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Số lượng</label>
            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Số lượng"></input>
          </div>


          <label for="exampleDataList" class="form-label">Datalist example</label>
          <label for="exampleDataList" class="form-label">Datalist example</label>
          <input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..."></input>
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
