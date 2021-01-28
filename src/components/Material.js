/*jslint eqeq: true*/

import React, { Component } from 'react';
import { config } from '../Constant';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import axiosInstance from "../Axios";

import { Wallet } from "react-bootstrap-icons"


const initForm = {
  quantity: "",
  total_cost: "",
  material: "1", // rice material id = 1
  id: ""
};


function ReceiptForm(props) {
  let { receipt_form, handleChange, handleSubmit, onDelete } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <select className="form-select" name="material" value={receipt_form.form_value.material} onChange={handleChange} >
          <option value="1">Gạo</option>
          <option value="2">Men</option>
        </select>
      </div>

      {/* Số bao */}
      <div className="mb-3">
        <input type="number" className="form-control" placeholder={String(receipt_form.form_value.material) === "1" ? "Số bao" : "Số cân"} name="quantity" value={receipt_form.form_value.quantity} onChange={handleChange} required />
      </div>
      {/* Giá */}
      <div className="mb-3">
        <NumberFormatCustom className="form-control" placeholder="Giá" name="total_cost" value={receipt_form.form_value.total_cost} onChange={handleChange} thousandSeparator={true} suffix={' đ'} required />
      </div>

      {/* Submit btn */}
      <div className="mb-3 d-flex">
        {receipt_form.update_mode &&
          <div>
            {/* For edit item: cancel button and id of item */}
            <input type="number" name="id" defaultValue={receipt_form.form_value.id} hidden />
            <div className={(receipt_form.sending ? "invisible" : "visible") + " btn btn-secondary px-3 me-3"} onClick={() => onDelete(receipt_form.form_value.id)} >
              Xóa
              {receipt_form.deleting && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>}
            </div>
          </div>
        }

        <button type="submit" className="btn btn-primary flex-grow-1" disabled={String(receipt_form.form_value.quantity) === "" || String(receipt_form.form_value.total_cost) === ""}>
          {!receipt_form.sending &&
            <span >{receipt_form.update_mode ? "Lưu thay đổi" : "Nhập"}</span>
          }
          {receipt_form.sending && <div className="ms-3 spinner-border spinner-border-sm" role="status">
            <span className="sr-only"></span>
          </div>}
        </button>
      </div>
    </form>
  )
}


function ListItems(props) {
  let { receipts, onUpdate, loading } = props;

  if (!receipts) return (
    <tbody></tbody>
  )

  let listReceipts = receipts.map((receipt, index) => {
    return (
      <tr key={receipt.id} className=" cursor-pointer" onClick={() => onUpdate(receipt)} data-bs-toggle="modal" data-bs-target="#form_modal">
        <td className="text-center"><Moment format="DD/M/YY">{receipt.date_created}</Moment></td>
        <th className="text-center"> {String(receipt.material) === "1" ? "Gạo" : "Men"}</th>
        <td className="text-center d-none d-md-block">{receipt.quantity} {String(receipt.material) === "1" ? "bao" : "cân"}</td>
        <td className="text-center"><NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        {/* <td className="text-center custom-hidden">
          <span className="cursor-pointer mx-3" onClick={() => onUpdate(receipt)}>
            <Pen className=""></Pen>
          </span>
          <span className="cursor-pointer" onClick={() => onDelete(receipt.id)}>
            <Trash></Trash>
          </span>
        </td> */}
      </tr>
    )
  });

  return (
    <div className="table-responsive-md">
      <table className="table align-middle table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col" className="text-center">Ngày</th>
            <th scope="col" className="text-center">Loại</th>
            <th scope="col" className="text-center d-none d-md-block">Số lượng</th>
            <th scope="col" className="text-center">Tổng tiền</th>
          </tr>
        </thead>
        {!loading &&
          <tbody>
            {listReceipts}
          </tbody>
        }
      </table>
      {loading &&
        <div className="text-center">
          <div className="ms-3 spinner-border spinner-border-sm" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      }
      {receipts.length === 0 && !loading && <div className="row text-center">
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
      filter: {
        limmit: "",
        material: ""
      },
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
    this.handleFilter = this.handleFilter.bind(this);
  }

  getList() {
    this.hideFormModal();
    this.setState({ loading: true });
    const url = `${config.API_URL}/receipt/?material=${this.state.filter.material}`;
    axiosInstance.get(url).then(res => {
      this.setState({ receipts: res.data, loading: false })
    })
  }

  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
      this.setState({ receipt_form: { ...this.state.receipt_form, deleting: true } });

      const url = `${config.API_URL}/receipt/${id}`;
      axiosInstance.delete(url).then(data => {
        this.setState({
          receipt_form: {
            update_mode: false,
            deleting: false,
            form_value: { ...initForm }
          }
        })

        this.getList();
      });
    }
  }

  handleFilter(event) {
    const { name, value } = event.target;

    this.setState((prevState) => {
      let filter = { ...prevState.filter };
      filter[name] = value ? value : "";
      return { filter };
    }, () => {
      this.getList();
    });
  }

  onUpdate(receipt) {

    this.setState((prevState) => {
      let receipt_form = { ...prevState };
      receipt_form.form_value = { ...receipt };
      receipt_form.update_mode = true;
      return { receipt_form: receipt_form };
    });
  }

  hideFormModal() {
    document.getElementById('close-modal-btn').click();
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

          {/* things */}

          <div className="row">
            <div className="col-12">
              <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Gạo</div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <NumberFormat value={
                          this.state.receipts.length && this.state.receipts.filter(receipt => receipt.material === 1).map(receipt => receipt.total_cost).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                        } displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" />
                      </div>
                    </div>
                    <div className="col-auto">
                      <Wallet width="32" height="32"></Wallet>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* next thing */}
            <div className="col-12 mt-3">
              <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Men</div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <NumberFormat value={
                          this.state.receipts.length && this.state.receipts.filter(receipt => receipt.material === 2).map(receipt => receipt.total_cost).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                        } displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" />
                      </div>
                    </div>
                    <div className="col-auto">
                      <Wallet width="32" height="32"></Wallet>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* form_modal */}
          <div className="modal fade" id="form_modal" tabIndex="-1" aria-labelledby="form_modelLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="form_modelLabel">{this.state.receipt_form.form_value.id ? "Chi tiết" : "Nhập"}</h5>
                  <button id="close-modal-btn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <ReceiptForm receipt_form={this.state.receipt_form} onDelete={this.onDelete} handleChange={this.handleChange} handleSubmit={this.handleSubmit}></ReceiptForm>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* datatable  */}
        <div className="col-md-8 mt-3 mt-md-0">
          <div className="d-flex justify-content-between">
            <div className="">
              <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#form_modal">Thêm +</button>
            </div>
            {/* <div className="">
              <select className="form-select" name="material" value={this.state.filter.material} onChange={this.handleFilter}>
                <option value="">---</option>
                <option value="1">Gạo</option>
                <option value="2">Men</option>
              </select>
            </div> */}
          </div>

          <div className="">
            <ListItems receipts={this.state.receipts} onUpdate={this.onUpdate} onDelete={this.onDelete} loading={this.state.loading}></ListItems>
          </div>

        </div>
      </div >
    )
  }
}

export default Rice;
