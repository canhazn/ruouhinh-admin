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
  completed: true,
  material: "1", // rice material id = 1  
  note: "",
  id: "",
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
        <input type="number" className="form-control" placeholder="Số cân" name="quantity" value={receipt_form.form_value.quantity} onChange={handleChange} required />
      </div>
      {/* Giá */}
      <div className="mb-3">
        <NumberFormatCustom className="form-control" placeholder="Giá" name="total_cost" value={receipt_form.form_value.total_cost} onChange={handleChange} thousandSeparator={true} suffix={' đ'} required />
      </div>

      {/* Ghi chú */}
      <div className="mb-3">
        <input type="text" className="form-control mb-3" placeholder="Ghi chú" name="note" value={receipt_form.form_value.note} onChange={handleChange} />
      </div>

      {/* Đã trả */}
      <div className="mb-3">
        <label htmlFor="completed">Đã thanh toán: </label>
        <input id="completed" name="completed" type="checkbox" className="mx-2" checked={receipt_form.form_value.completed} onChange={handleChange} />
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

        <button type="submit" className={(receipt_form.deleting ? "invisible" : "visible") + " btn btn-primary flex-grow-1"} disabled={String(receipt_form.form_value.quantity) === "" || String(receipt_form.form_value.total_cost) === ""}>
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
      <tr key={receipt.id} className={(!receipt.completed && "bg-warning") + " cursor-pointer"} onClick={() => onUpdate(receipt)} data-bs-toggle="modal" data-bs-target="#form_modal">
        <td className="text-center"><Moment format="DD/M/YY">{receipt.date_created}</Moment></td>
        <th className="text-center"> {String(receipt.material) === "1" ? "Gạo" : "Men"}</th>
        <td className="text-center d-none d-md-block">{receipt.quantity} cân</td>
        <td className="text-center"><NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td className="text-center custom-hidden">{receipt.note ? receipt.note : ".."}</td>
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
            <th scope="col" className="text-center custom-hidden">Ghi chú</th>
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
        <p>Chưa có dữ liệu</p>
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
      total_amount_rice: 0,
      total_amount_yeast: 0,
      loading: true,
    }

    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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


  getList() {
    this.hideFormModal();
    this.setState({ loading: true });
    const url = `${config.API_URL}/receipt/?material=${this.state.filter.material}`;
    axiosInstance.get(url).then(res => res.data).then(res => {
      this.setState({
        receipts: res.result,
        total_amount_rice: res.total_amount_rice ? res.total_amount_rice : 0,
        total_amount_yeast: res.total_amount_yeast ? res.total_amount_yeast : 0,
        loading: false
      })
    })
  }

  // on create -> reset form
  onCreate() {
    this.setState({
      receipt_form: {
        update_mode: false,
        deleting: false,
        form_value: { ...initForm }
      }
    })
  }

  // on update -> add field to form
  onUpdate(receipt) {

    this.setState((prevState) => {
      let receipt_form = { ...prevState };
      receipt_form.form_value = { ...receipt };
      receipt_form.update_mode = true;
      return { receipt_form: receipt_form };
    });
  }


  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
      this.setState({ receipt_form: { ...this.state.receipt_form, deleting: true } });

      const url = `${config.API_URL}/receipt/${id}/`;
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

  hideFormModal() {
    document.getElementById('close-modal-btn').click();
  }

  handleChange(event) {
    // const { name, value } = event.target
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // update form data to state
    this.setState((prevState) => {
      let receipt_form = { ...prevState.receipt_form };
      let form_value = receipt_form.form_value;

      form_value[name] = value;
      if (String(form_value["material"]) === "2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 30000;
      if (String(form_value["material"]) === "1" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 11000;
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
                      <div className="text-xs font-weight-bold text-primary mb-1">
                        Tổng gạo đã nhập</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <NumberFormat value={this.state.total_amount_rice} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" />
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
                      <div className="text-xs font-weight-bold text-primary mb-1">
                        Tổng men đã nhập</div>
                      {this.state.loading &&
                        <div className="text-center">
                          <div className="ms-3 spinner-border spinner-border-sm" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      }

                      {!this.state.loading &&
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          <NumberFormat value={this.state.total_amount_yeast} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" />
                        </div>
                      }
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
              <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#form_modal" onClick={() => this.onCreate()}>Thêm +</button>
            </div>
            <div className="">
              <select className="form-select" name="material" value={this.state.filter.material} onChange={this.handleFilter}>
                <option value="">---</option>
                <option value="1">Gạo</option>
                <option value="2">Men</option>
              </select>
            </div>
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
