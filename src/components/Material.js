import React, { useState, Component } from 'react';
import { config } from '../Constant';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import axiosInstance from "../Axios";

import { Trash, Pen } from "react-bootstrap-icons"

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            // cái target này sẽ được chuyền qua onChange
            // nên nó cần có cả name và value để setState đọc
            name: "total_cost",
            value: values.value
          },
        });
      }}
      thousandSeparator
      suffix=" đ"
    />
  );
}

const initForm = {
  quantity: "",
  total_cost: "",
  material: "1" // rice material id = 1
};


function ListItems(props) {
  let { receipts, onDelete, onUpdate } = props;

  if (!receipts) return (
    <tbody>    </tbody>
  )
  
  let listReceipts = receipts.map((receipt, index) => {
    return (
      <tr key={receipt.id}>
        <th className="text-center"> {receipt.material === 1 ? "Gạo" : "Men"}</th>
        <td className="text-center"><Moment format="DD-MM-YYYY">{receipt.date_created}</Moment></td>
        <td className="text-center d-none d-md-block">{receipt.quantity} {receipt.material === 1 ? "bao" : "cân"}</td>
        <td className="text-center"><NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td className="text-center">
          <span className="cursor-pointer mx-3" onClick={() => onUpdate(receipt)}>
            <Pen className=""></Pen>
          </span>
          <span className="cursor-pointer" onClick={() => onDelete(receipt.id)}>
            <Trash></Trash>
          </span>
        </td>
      </tr>
    )
  });

  return (
    <tbody>
      {listReceipts}
    </tbody>
  )
}


class Rice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      receipts: [],
      form_value: initForm,
      on_updating: false,
      id: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
  }

  getList() {
    const url = `${config.API_URL}/receipt/`;
    axiosInstance.get(url).then(res => {
      
      console.log(res)
      this.setState({ receipts: res.data.results })
    })
  }

  onDelete(id) {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      console.log("delete,", id)

      const url = `${config.API_URL}/receipt/${id}`;
      axiosInstance.delete(url).then(data => {
        console.log(this);
        this.getList();
      });
    }
  }

  onUpdate(receipt) {
    this.setState((prevState) => {

      let form_value = { ...receipt };
      return {
        on_updating: true,
        form_value
      };
    });
  }

  cancelUpdate() {
    this.setState({
      on_updating: false,
      form_value: initForm
    })
  }

  handleChange(event) {
    const { name, value } = event.target
    // const target = event.target;
    // const value = target.value;
    // const name = target.name;

    // update form data to state
    this.setState((prevState) => {
      let form_value = { ...prevState.form_value };
      form_value[name] = value;
      console.log(form_value);
      if (form_value["material"] == "2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 25000;
      return { form_value };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Validate data
    if (this.state.form_value.quantity === "" || this.state.form_value.total_cost === "") {
      return;
    }

    const url = `${config.API_URL}/receipt/`;
    let value = JSON.stringify(this.state.form_value);

    if (this.state.on_updating) {
      // Update item
      axiosInstance.put(`${config.API_URL}/receipt/${this.state.form_value.id}/`, value).then(data => {
        console.log(data);
        this.getList();
        this.setState((prevState) => {
          let form_value = initForm;
          return {
            on_updating: false,
            form_value
          };
        });
      });
    } else {
      // Create item
      axiosInstance.post(url, value).then(data => {
        console.log(data);
        this.getList();
        this.setState((prevState) => {
          let form_value = initForm;
          return {
            form_value
          };
        });
      });
    }

  }

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-md-4">
          <legend>Nhập</legend>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <div className="form-group mb-3">
              <select className="form-select" name="material" value={this.state.form_value.material} onChange={this.handleChange} >
                <option value="1">Gạo</option>
                <option value="2">Men</option>
              </select>
            </div>

            {/* Số bao */}
            <div className="mb-3">
              <input type="number" className="form-control" placeholder={this.state.form_value.material === "1" ? "Số bao" : "Số cân"} name="quantity" value={this.state.form_value.quantity} onChange={this.handleChange} required />
            </div>
            {/* Giá */}
            <div className="mb-3">
              <NumberFormatCustom className="form-control" placeholder="Giá" name="total_cost" value={this.state.form_value.total_cost} onChange={this.handleChange} thousandSeparator={true} suffix={' đ'} required />
            </div>

            {/* Submit btn */}
            <div className="mb-3 d-flex">
              {this.state.on_updating &&
                <div>
                  {/* For edit item: cancel button and id of item */}
                  <input type="number" name="id" defaultValue={this.state.form_value.id} hidden />
                  <span className="btn btn-primary me-3 px-5" onClick={this.cancelUpdate}>Hủy</span>
                </div>
              }
              <input type="submit" className="btn btn-primary w-100" value={this.state.on_updating ? "Lưu thay đổi" : "Nhập"} disabled={this.state.form_value.quantity === "" || this.state.form_value.total_cost === ""} />
            </div>
          </form>
        </div>

        {/* datatable  */}
        <div className="col-md-8">
          <div className="table-responsive-md">
            <table className="table align-middle table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th scope="col" className="text-center">Loại</th>
                  <th scope="col" className="text-center">Ngày</th>
                  <th scope="col" className="text-center d-none d-md-block">Số lượng</th>
                  <th scope="col" className="text-center">Tổng tiền</th>
                  <th scope="col" className="text-center">Tùy chọn</th>
                </tr>
              </thead>
              <ListItems receipts={this.state.receipts} onUpdate={this.onUpdate} onDelete={this.onDelete}></ListItems>

            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Rice;
