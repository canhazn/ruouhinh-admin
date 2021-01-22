/*jslint eqeq: true*/

import React, { Component } from 'react';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import { config } from '../Constant';
import axiosInstance from "../Axios";
import { Trash, Pen } from "react-bootstrap-icons"

const initForm = {
  quantity: "",
  total_cost: "",
  customer_name: "",
  product: "1", // rice material id = 1
  completed: true,
  note: ""
};

function ListItems(props) {
  let { orders, onDelete, onUpdate } = props;
  if (!orders) return (
    <tbody></tbody>
  )
  let listorders = orders.map((item, index) => {
    return (
      <tr key={item.id}>
        <td className="text-center"><Moment format="DD-M-YY">{item.date_created}</Moment></td>
        <td className="text-center"><NumberFormat value={item.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td className="text-center">{item.customer_name}</td>
        <td className="text-center custom-hidden">{item.product==="1" ? "20 lít" : "10 lít"}</td>
        <td className="text-center custom-hidden">{item.completed ? ".." : "nợ"}</td>
        <td className="text-center custom-hidden">{item.quantity}</td>
        <td className="text-center custom-hidden">{item.note ? item.note : ".."}</td>
        <td className="text-center">
          <span className="cursor-pointer mx-3" onClick={() => onUpdate(item)}>
            <Pen className=""></Pen>
          </span>
          <span className="cursor-pointer" onClick={() => onDelete(item.id)}>
            <Trash></Trash>
          </span>
        </td>
      </tr>
    )
  });

  return (
    <tbody>
      {listorders}
    </tbody>
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
      },
      loading: true,
      id: ""
    }
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
  }

  getList() {
    this.setState({ loading: true });
    let url = `${config.API_URL}/order/?search=${this.state.filter.search}`;

    axiosInstance.get(url).then(res => {
      this.setState({
        count: res.data.count,
        orders: res.data.results,
        next: res.data.next,
        previou: res.data.previou,        
        loading: false,
      })
    })
  }

  onDelete(id) {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      console.log("delete,", id)

      const url = `${config.API_URL}/order/${id}`;
      axiosInstance.delete(url).then(data => {
        console.log(this);
        this.getList();
      });
    }
  }

  onUpdate(receipt) {
    this.setState((prevState) => {
      let order_form = { ...prevState };
      order_form.form_value = { ...receipt };
      order_form.update_mode = true;
      return { order_form: order_form };
    });
  }

  cancelUpdate() {
    this.setState({
      order_form: {
        update_mode: false,
        form_value: { ...initForm }
      }
    })
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
      if (form_value["product"]==="1" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 500000;
      if (form_value["product"]==="2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 250000;      
      return { order_form: order_form };
    });
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

        this.setState({
          order_form: {
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
          <legend>Xuất</legend>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {/* Loai ruou */}
            <div className="form-group mb-3">
              <select className="form-control" name="product" value={this.state.order_form.form_value.product} onChange={this.handleChange} >
                <option value="1">Can 20 lit</option>
                <option value="2">Can 10 lit</option>
              </select>
            </div>

            {/* Customer */}
            <div className="mb-3">
              <input type="text" className="form-control mb-3" placeholder="Khách hàng" name="customer_name" value={this.state.order_form.form_value.customer_name} onChange={this.handleChange} required />
            </div>

            {/* Số can */}
            <div className="mb-3">
              <input type="number" className="form-control mb-3" placeholder="Số can" name="quantity" value={this.state.order_form.form_value.quantity} onChange={this.handleChange} required />
            </div>

            {/* Giá */}
            <div className="mb-3">
              <NumberFormatCustom className="form-control mb-3" placeholder="Giá" name="total_cost" value={this.state.order_form.form_value.total_cost} onChange={this.handleChange} thousandSeparator={true} suffix={' đ'} required />
            </div>

            {/* Ghi chú */}
            <div className="mb-3">
              <input type="text" className="form-control mb-3" placeholder="Ghi chú" name="note" value={this.state.order_form.form_value.note} onChange={this.handleChange} />
            </div>

            {/* Đã trả */}
            <div className="mb-3">
              <label htmlFor="completed">Đã thanh toán: </label>
              <input id="completed" name="completed" type="checkbox" className="mx-2" checked={this.state.order_form.form_value.completed} onChange={this.handleChange} />
            </div>

            {/* Submit btn */}
            <div className="mb-3 d-flex">
              {this.state.order_form.update_mode &&
                <div>
                  {/* For edit item: cancel button and id of item */}
                  <input type="number" name="id" defaultValue={this.state.order_form.form_value.id} hidden />
                  <span className={(this.state.order_form.sending ? "invisible" : "visible") + " btn btn-primary me-3 px-5"} onClick={this.cancelUpdate} >Hủy</span>
                </div>
              }

              <button type="submit" className="btn btn-primary w-100" disabled={this.state.order_form.form_value.quantity === "" || this.state.order_form.form_value.total_cost === ""}>
                {!this.state.order_form.sending &&
                  <span >{this.state.order_form.update_mode ? "Lưu thay đổi" : "Xuất"}</span>
                }
                {this.state.order_form.sending && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                  <span className="sr-only"></span>
                </div>}
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-8">
          <div className="row navbar filter">

            {/* limmit */}
            {/* <div className="col-2 mb-3">
              <label htmlFor="limmit">limmit:</label>
              <select className="form-select" name="limmit" value={this.state.filter.limmit} onChange={this.handleFilter} >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div> */}

            {/* Text search */}
            <div className="col-6 mr-0">
              <label htmlFor="search">Tìm kiếm:</label>
              <input type="text" className="form-control mb-3" placeholder="Tìm kiếm" name="search" value={this.state.filter.search} onChange={this.handleFilter} />
            </div>

          </div>
          <div className="table-responsive-md">
            <table className="table table-striped align-middle table-hover table-bordered">
              <thead>
                <tr>
                  {/* <th scope="col">#</th> */}
                  <th scope="col" className="text-center">Ngày</th>
                  <th scope="col" className="text-center ">Tổng tiền</th>
                  <th scope="col" className="text-center">Khách hàng</th>
                  <th scope="col" className="text-center custom-hidden">Loại</th>
                  <th scope="col" className="text-center custom-hidden">...</th>
                  <th scope="col" className="text-center custom-hidden">Số can</th>
                  <th scope="col" className="text-center custom-hidden">Ghi chú</th>
                  <th scope="col" className="text-center">Tùy chọn</th>
                </tr>
              </thead>
              {!this.state.loading && 
              <ListItems orders={this.state.orders} onUpdate={this.onUpdate} onDelete={this.onDelete}></ListItems>
              }
            </table>
            {this.state.loading &&

              <div className="ms-3 spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>

            }
            {this.state.orders.length === 0 && !this.state.loading && <div>
              <p>Emty data</p>
            </div>
            }
          </div>

        </div>
      </div>
    )
  }
}

export default Product;
