/*jslint eqeq: true*/

import React, { Component } from 'react';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import { config } from '../Constant';
import axiosInstance from "../Axios";
import { Wallet } from "react-bootstrap-icons"
// import $ from 'jquery';

const initForm = {
  quantity: "",
  total_cost: "",
  customer_name: "",
  product: "1", // rice material id = 1
  completed: true,
  note: ""
};

function OrderForm(props) {
  let { order_form, handleChange, handleSubmit, onDelete } = props;
  return (
    <form onSubmit={handleSubmit}>
      {/* Loai ruou */}
      <div className="form-group mb-3">
        <select className="form-select" name="product" value={order_form.form_value.product} onChange={handleChange} >
          <option value="1">Can 20 lit</option>
          <option value="2">Can 10 lit</option>
        </select>
      </div>

      {/* Customer */}
      <div className="mb-3">
        <input type="text" className="form-control mb-3" placeholder="Khách hàng" name="customer_name" value={order_form.form_value.customer_name} onChange={handleChange} required />
      </div>

      {/* Số can */}
      <div className="mb-3">
        <input type="number" className="form-control mb-3" placeholder="Số can" name="quantity" value={order_form.form_value.quantity} onChange={handleChange} required />
      </div>

      {/* Giá */}
      <div className="mb-3">
        <NumberFormatCustom className="form-control mb-3" placeholder="Giá" name="total_cost" value={order_form.form_value.total_cost} onChange={handleChange} thousandSeparator={true} suffix={' đ'} required />
      </div>

      {/* Ghi chú */}
      <div className="mb-3">
        <input type="text" className="form-control mb-3" placeholder="Ghi chú" name="note" value={order_form.form_value.note} onChange={handleChange} />
      </div>

      {/* Đã trả */}
      <div className="mb-3">
        <label htmlFor="completed">Đã thanh toán: </label>
        <input id="completed" name="completed" type="checkbox" className="mx-2" checked={order_form.form_value.completed} onChange={handleChange} />
      </div>

      {/* Submit btn */}
      <div className="mb-3 d-flex">
        {order_form.update_mode &&
          <div>
            {/* For edit item: cancel button and id of item */}
            <input type="number" name="id" defaultValue={order_form.form_value.id} hidden />
            <div className={(order_form.sending ? "invisible" : "visible") + " btn btn-secondary me-3 px-3"} onClick={() => onDelete(order_form.form_value.id)} >
              Xóa
              {order_form.deleting && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>}
            </div>
          </div>
        }

        <button type="submit" className={(order_form.deleting ? "invisible" : "visible") + " btn btn-primary flex-grow-1"} disabled={order_form.form_value.quantity === "" || order_form.form_value.total_cost === ""}>
          {!order_form.sending &&
            <span >{order_form.update_mode ? "Lưu thay đổi" : "Xuất"}</span>
          }
          {order_form.sending && <div className="ms-3 spinner-border spinner-border-sm" role="status">
            <span className="sr-only"></span>
          </div>}
        </button>
      </div>
    </form>
  )
}

function ListItems(props) {
  let { orders, onUpdate, loading } = props;
  if (!orders) return (
    <tbody></tbody>
  )
  let listorders = orders.map((item, index) => {
    return (
      <tr key={item.id} className={(!item.completed && "bg-warning") + " cursor-pointer"} onClick={() => onUpdate(item)} data-bs-toggle="modal" data-bs-target="#form_modal">
        <td className="text-center"><Moment format="DD/M/YY">{item.date_created}</Moment></td>
        <td className="text-center"><NumberFormat value={item.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td className="text-center">{item.customer_name}</td>
        <td className="text-center custom-hidden">{String(item.product) === "1" ? "20 lít" : "10 lít"}</td>
        {/* <td className="text-center custom-hidden">{item.completed ? ".." : "nợ"}</td> */}
        <td className="text-center custom-hidden">{item.quantity}</td>
        <td className="text-center custom-hidden">{item.note ? item.note : ".."}</td>
        {/* <td className="text-center custom-hidden">
          <span className="cursor-pointer mx-3" >
            <Pen className=""></Pen>
          </span>
          <span className="cursor-pointer" onClick={() => onDelete(item.id)}>
            <Trash></Trash>
          </span> 
        </td> */}
      </tr>
    )
  });

  return (
    <div className="table-responsive-md">
      <table className="table table-striped align-middle table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col" className="text-center">Ngày</th>
            <th scope="col" className="text-center ">Tổng tiền</th>
            <th scope="col" className="text-center">Khách hàng</th>
            <th scope="col" className="text-center custom-hidden">Loại</th>
            <th scope="col" className="text-center custom-hidden">Số can</th>
            <th scope="col" className="text-center custom-hidden">Ghi chú</th>
          </tr>
        </thead>
        {!loading &&
          <tbody>
            {listorders}
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
      {orders.length === 0 && !loading && <div className="row text-center">
        <p>Emty data</p>
      </div>
      }
    </div>
  )
}


class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      next: `${config.API_URL}/order/`,
      previou: null,
      filter: {
        limmit: "",
        search: ""
      },
      orders: [],
      order_form: {
        form_value: { ...initForm },
        update_mode: false,
        sending: false,
        deleting: false,
      },
      loading: true,
      id: ""
    }
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getList() {
    this.hideFormModal();
    this.setState({ loading: true });
    let url = `${config.API_URL}/order/?search=${this.state.filter.search}`;

    axiosInstance.get(url).then(res => {
      this.setState({
        orders: res.data,
        loading: false,
      })
    })
  }

  // on create -> reset form
  onCreate() {
    this.setState({
      order_form: {
        update_mode: false,
        deleting: false,
        form_value: { ...initForm }
      }
    })
  }

  // on update -> add field to form
  onUpdate(receipt) {
    this.setState((prevState) => {
      let order_form = { ...prevState };
      order_form.form_value = { ...receipt };
      order_form.update_mode = true;
      return { order_form: order_form };
    });
  }

  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
      this.setState({ order_form: { ...this.state.order_form, deleting: true } });

      const url = `${config.API_URL}/order/${id}/`;
      axiosInstance.delete(url).then(data => {

        this.setState({
          order_form: {
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

  handleChange(event) {
    // const { name, value } = event.target;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // update form data to state
    this.setState((prevState) => {
      let order_form = { ...prevState.order_form };
      let form_value = order_form.form_value;
      form_value[name] = value;
      if (String(form_value["product"]) === "1" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 500000;
      if (String(form_value["product"]) === "2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 250000;
      return { order_form: order_form };
    });
  }

  hideFormModal() {
    document.getElementById('close-modal-btn').click();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ order_form: { ...this.state.order_form, sending: true } });

    const url = `${config.API_URL}/order/`;
    let value = JSON.stringify(this.state.order_form.form_value);


    if (this.state.order_form.update_mode) {
      // Update item
      axiosInstance.put(`${config.API_URL}/order/${this.state.order_form.form_value.id}/`, value).then(data => {


        this.getList();
        this.setState({
          order_form: {
            update_mode: false,
            sending: false,
            form_value: { ...initForm }
          }
        });
      });
    } else {
      // Create item
      axiosInstance.post(url, value).then(data => {

        this.getList();
        this.setState({
          order_form: {
            update_mode: false,
            sending: false,
            form_value: { ...initForm }
          }
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

          <legend>Xuất</legend>
          <hr />

          {/* form_modal */}
          <div className="modal fade" id="form_modal" tabIndex="-1" aria-labelledby="form_modelLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="form_modelLabel">{this.state.order_form.form_value.id ? "Chi tiết" : "Xuất"}</h5>
                  <button id="close-modal-btn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <OrderForm order_form={this.state.order_form} onDelete={this.onDelete} handleChange={this.handleChange} handleSubmit={this.handleSubmit}></OrderForm>
                </div>
              </div>
            </div>
          </div>


          {/* things */}

          <div className="row">
            {/* <div className="col-12">
              <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Earnings (Monthly)</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                    </div>
                    <div className="col-auto">
                      <CartCheckFill width="32" height="32"></CartCheckFill>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="col-12">
              <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Bán ra</div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <NumberFormat value={
                          this.state.orders.length && this.state.orders.map(order => order.total_cost).reduce((previousValue, currentValue) => previousValue + currentValue)
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

        </div>

        <div className="col-md-8 mt-md-0 mt-3">
          <div className="d-flex justify-content-between">
            <div className="">
              <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#form_modal" onClick={() => this.onCreate()}>Thêm +</button>
            </div>
            <div className="">
              <input type="text" className="form-control mb-3" placeholder="Khách hàng" name="search" value={this.state.filter.search} onChange={this.handleFilter} />
            </div>
          </div>
          <div className="">
            <ListItems orders={this.state.orders} onUpdate={this.onUpdate} loading={this.state.loading}></ListItems>
          </div>
        </div>
      </div>
    )
  }
}

export default Product;
