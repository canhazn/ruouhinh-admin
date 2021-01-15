import React, { Component } from 'react';

import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import { config } from '../../Constant';
import axiosInstance from "../../Axios";

const initForm = {
  quantity: "",
  total_cost: "",
  customer_name: "",
  product: 1, // rice material id = 1
  completed: true,
  note: ""
};


function ListItems(props) {
  let orders = props.orders;

  let listorders = orders.map((order, index) => {
    return (
      <tr key={order.id}>
        <th scope="row">{index}</th>
        <td><Moment format="DD-MM-YYYY">{order.date_created}</Moment></td>
        <td>{order.customer_name}</td>
        <td>{order.quantity} can</td>
        <td>{order.completed ? "" : "nợ"}</td>
        <td><NumberFormat value={order.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
        <td>{order.note} </td>
      </tr>
    )
  });

  return (
    <tbody>
      {listorders}
    </tbody>
  )
}


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



class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      form_value: initForm
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getList() {
    const url = `${config.API_URL}/order/`;
    fetch(url).then(response => response.json()).then(data => {
      this.setState({ orders: data })
    })
  }

  handleChange(event) {
    // const { name, value } = event.target;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;    
    const name = target.name;

    console.log(value);
    // update form data to state
    this.setState((prevState) => {
      let form_value = { ...prevState.form_value };
      form_value[name] = value;
      if (form_value["product"] == 1 && name == "quantity") form_value["total_cost"] = value * 500000;
      if (form_value["product"] == 2 && name == "quantity") form_value["total_cost"] = value * 250000;
      return { form_value };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const url = `${config.API_URL}/order/`;
    let value = JSON.stringify(this.state.form_value);

    axiosInstance.post(url, value).then(data => {
      console.log(data);
      this.getList();
      this.setState((prevState) => {
        let form_value = initForm;
        return { form_value };
      });
    });
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-md-6">
          <legend>Bán rượu</legend>
          <hr/>
          <form onSubmit={this.handleSubmit}>
            {/* Loai ruou */}
            <div className="form-group mb-3">
              <select className="form-control" name="product" value={this.state.form_value.product} onChange={this.handleChange} >
                <option value="1">Can 20 lit</option>
                <option value="2">Can 10 lit</option>
              </select>
            </div>

            {/* Customer */}
            <div className="mb-3">
              <input type="text" className="form-control mb-3" placeholder="Khách hàng" name="customer_name" value={this.state.form_value.customer_name} onChange={this.handleChange} required />
            </div>

            {/* Số can */}
            <div className="mb-3">
              <input type="number" className="form-control mb-3" placeholder="Số can" name="quantity" value={this.state.form_value.quantity} onChange={this.handleChange} required />
            </div>

            {/* Giá */}
            <div className="mb-3">
              <NumberFormatCustom className="form-control mb-3" placeholder="Giá" name="total_cost" value={this.state.form_value.total_cost} onChange={this.handleChange} thousandSeparator={true} suffix={' đ'} required />
            </div>

            {/* Ghi chú */}
            <div className="mb-3">
              <input type="text" className="form-control mb-3" placeholder="Ghi chú" name="note" value={this.state.form_value.note} onChange={this.handleChange} />
            </div>

            {/* Đã trả */}
            <div className="mb-3">
              <label htmlFor="completed">Đã thanh toán: </label>
              <input id="completed" name="completed" type="checkbox" className="mx-2" checked={this.state.form_value.completed} onChange={this.handleChange} />
            </div>

            <input type="submit" className={ (this.state.form_value.completed ? 'btn-primary' : 'btn-secondary') + " btn w-50 save-btn" } value="Nhập" disabled={this.state.form_value.quantity == "" || this.state.form_value.total_cost == ""} />

          </form>
        </div>

        <div className="col-md-6">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ngày</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Số can</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Đã thanh toán</th>
                <th scope="col">Ghi chú</th>
              </tr>
            </thead>
            <ListItems orders={this.state.orders}></ListItems>
          </table>
        </div>
      </div>
    )
  }
}

export default Product;
