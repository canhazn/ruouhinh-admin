import React, { useState , Component } from 'react';
import { config } from '../../../Constant';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import axiosInstance from "../../../Axios";
import styles from "./Rice.module.css";

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
  material: 1 // rice material id = 1
};


function ListItems(props) {
  let receipts = props.receipts;

  let listReceipts = receipts.map((receipt, index) => {
    return (
      <tr key={receipt.id}>
        <th scope="row">{index}</th>
        <td><Moment format="DD-MM-YYYY">{receipt.date_created}</Moment></td>
        <td>{receipt.quantity} bao</td>
        <td><NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} decimalSeparator="." suffix=" đ" /></td>
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
      form_value: initForm
    }



    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getList() {
    const url = `${config.API_URL}/receipt/`;
    fetch(url).then(response => response.json()).then(data => {
      this.setState({ receipts: data })
    })
  }

  handleChange(event) {
    const {name, value} = event.target
    // const target = event.target;
    // const value = target.value;
    // const name = target.name;


    // update form data to state
    this.setState((prevState) => {
      let form_value = { ...prevState.form_value };
      form_value[name] = value;
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
      <div className="row">
        <div className={styles.bg_custom}></div>

        <div className="col-md-6">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-8">
                {/* Số bao */}
                <div className="mb-3">
                  <input type="number" className="form-control" placeholder="Số bao" name="quantity" value={this.state.form_value.quantity} onChange={this.handleChange} required />
                </div>
                {/* Giá */}
                <div className="mb-3">
                  <NumberFormatCustom className="form-control" placeholder="Giá" name="total_cost" value={this.state.form_value.total_cost} onChange={this.handleChange} thousandSeparator={true} suffix={' đ'} required />
                </div>
              </div>
              <div className="col-4">

                <input type="submit" className="btn btn-primary w-100 save-btn" value="Nhập" disabled={this.state.form_value.quantity === "" || this.state.form_value.total_cost === ""} />
              </div>
            </div>

          </form>
        </div>

        <div className="col-md-6">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ngày</th>
                <th scope="col">Số bao</th>
                <th scope="col">Tổng tiền</th>
              </tr>
            </thead>
            <ListItems receipts={this.state.receipts}></ListItems>

          </table>
        </div>
      </div>
    )
  }
}

export default Rice;
