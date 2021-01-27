/*jslint eqeq: true*/

import React, { Component } from 'react';
import { config } from '../Constant';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import axiosInstance from "../Axios";

import { Trash, Pen } from "react-bootstrap-icons"


const initForm = {
  quantity: "",
  total_cost: "",
  material: "1" // rice material id = 1
};


function ListItems(props) {
  let { receipts, onDelete, onUpdate, loading } = props;

  if (!receipts) return (
    <tbody></tbody>
  )

  let listReceipts = receipts.map((receipt, index) => {
    return (
      <tr key={receipt.id}>
        <th className="text-center"> {String(receipt.material) === "1" ? "Gạo" : "Men"}</th>
        <td className="text-center"><Moment format="DD-MM-YYYY">{receipt.date_created}</Moment></td>
        <td className="text-center d-none d-md-block">{receipt.quantity} {String(receipt.material) === "1" ? "bao" : "cân"}</td>
        <td className="text-center"><NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td className="text-center custom-hidden">
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
    <div className="table-responsive-md">
      <table className="table align-middle table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col" className="text-center">Loại</th>
            <th scope="col" className="text-center">Ngày</th>
            <th scope="col" className="text-center d-none d-md-block">Số lượng</th>
            <th scope="col" className="text-center">Tổng tiền</th>
            <th scope="col" className="text-center custom-hidden">Tùy chọn</th>
          </tr>
        </thead>
        {!loading &&
          <tbody>
            {listReceipts}
          </tbody>
        }
      </table>
      {loading &&

        <div className="ms-3 spinner-border spinner-border-sm" role="status">
          <span className="sr-only"></span>
        </div>

      }
      {receipts.length === 0 && !loading && <div>
        <p>Emty data</p>
      </div>
      }
    </div>
  )
}


class Rice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      receipts: [],
      form_value: initForm,
      update_mode: false,
      id: "",
      receipt_form: {
        form_value: { ...initForm },
        update_mode: false,
        sending: false,
      },
      loading: true,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
  }

  getList() {
    this.setState({ loading: true });
    const url = `${config.API_URL}/receipt/`;
    axiosInstance.get(url).then(res => {      
      this.setState({ receipts: res.data, loading: false })
    })
  }

  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
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
      let receipt_form = { ...prevState };
      receipt_form.form_value = { ...receipt };
      receipt_form.update_mode = true;
      return { receipt_form: receipt_form };
    });
  }

  cancelUpdate() {
    this.setState({
      receipt_form: {
        update_mode: false,
        form_value: { ...initForm }
      }
    })
  }

  handleChange(event) {
    const { name, value } = event.target
    // const target = event.target;
    // const value = target.value;
    // const name = target.name;

    // update form data to state
    this.setState((prevState) => {
      let receipt_form = { ...prevState.receipt_form };
      let form_value = receipt_form.form_value;

      form_value[name] = value;
      console.log(form_value);
      if (String(form_value["material"]) === "2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 25000;
      return { receipt_form: receipt_form };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ receipt_form: { ...this.state.receipt_form, sending: true } });

    // Validate data
    if (this.state.receipt_form.form_value.quantity === "" || this.state.receipt_form.form_value.total_cost === "") {
      return;
    }

    const url = `${config.API_URL}/receipt/`;
    let value = JSON.stringify(this.state.receipt_form.form_value);

    if (this.state.receipt_form.update_mode) {
      // Update item
      axiosInstance.put(`${config.API_URL}/receipt/${this.state.receipt_form.form_value.id}/`, value).then(data => {

        this.getList();

        this.setState({
          receipt_form: {
            update_mode: false,
            sending: false,
            form_value: { ...initForm }
          }
        });
      });
    } else {
      // Create item
      axiosInstance.post(url, value).then(data => {
        this.setState({
          receipt_form: {
            update_mode: false,
            sending: false,
            form_value: { ...initForm }
          }
        });

        this.getList();
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
              <select className="form-select" name="material" value={this.state.receipt_form.form_value.material} onChange={this.handleChange} >
                <option value="1">Gạo</option>
                <option value="2">Men</option>
              </select>
            </div>

            {/* Số bao */}
            <div className="mb-3">
              <input type="number" className="form-control" placeholder={String(this.state.receipt_form.form_value.material) === "1" ? "Số bao" : "Số cân"} name="quantity" value={this.state.receipt_form.form_value.quantity} onChange={this.handleChange} required />
            </div>
            {/* Giá */}
            <div className="mb-3">
              <NumberFormatCustom className="form-control" placeholder="Giá" name="total_cost" value={this.state.receipt_form.form_value.total_cost} onChange={this.handleChange} thousandSeparator={true} suffix={' đ'} required />
            </div>

            {/* Submit btn */}
            <div className="mb-3 d-flex">
              {this.state.receipt_form.update_mode &&
                <div>
                  {/* For edit item: cancel button and id of item */}
                  <input type="number" name="id" defaultValue={this.state.receipt_form.form_value.id} hidden />
                  <span className={(this.state.receipt_form.sending ? "invisible" : "visible") + " btn btn-primary me-3 px-5"} onClick={this.cancelUpdate} >Hủy</span>
                </div>
              }

              <button type="submit" className="btn btn-primary w-100" disabled={String(this.state.receipt_form.form_value.quantity) === "" || String(this.state.receipt_form.form_value.total_cost) === ""}>
                {!this.state.receipt_form.sending &&
                  <span >{this.state.receipt_form.update_mode ? "Lưu thay đổi" : "Nhập"}</span>
                }
                {this.state.receipt_form.sending && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                  <span className="sr-only"></span>
                </div>}
              </button>
            </div>
            {/*             
            <div className="mb-3 d-flex">
              {this.state.receipt_form.update_mode &&
                <div>
                  
                  <input type="number" name="id" defaultValue={this.state.receipt_form.form_value.id} hidden />
                  <span className="btn btn-primary me-3 px-5" onClick={this.cancelUpdate}>Hủy</span>
                </div>
              }
              <input type="submit" className="btn btn-primary w-100" value={this.state.receipt_form.update_mode ? "Lưu thay đổi" : "Nhập"} disabled={this.state.receipt_form.form_value.quantity === "" || this.state.receipt_form.form_value.total_cost === ""} />
            </div> */}
          </form>
        </div>

        {/* datatable  */}
        <div className="col-md-8">
          <ListItems receipts={this.state.receipts} onUpdate={this.onUpdate} onDelete={this.onDelete}  loading={this.state.loading}></ListItems>
        </div>
      </div >
    )
  }
}

export default Rice;
