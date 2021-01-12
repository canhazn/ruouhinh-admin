import React, { Component } from 'react';

import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

const initForm = {
  quantity: "",
  total_cost: "",
  product: 1 // rice material id = 1
};



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



  handleChange(event) {
    const { name, value } = event.target;

    // update form data to state
    this.setState((prevState) => {
      let form_value = { ...prevState.form_value };
      form_value[name] = value;
      return { form_value };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // // Validate data
    // if (this.state.form_value.quantity === "" || this.state.form_value.total_cost === "") {
    //   return;
    // }

    // const url = `${config.API_URL}/receipt/`;
    // let value = JSON.stringify(this.state.form_value);

    // axiosInstance.post(url, value).then(data => {
    //   console.log(data);
    //   this.getList();
    //   this.setState((prevState) => {
    //     let form_value = initForm;
    //     return { form_value };
    //   });
    // });
  }

  render() {

    return (
      <div className="row">
        <div className="col-md-6">

          <form onSubmit={this.handleSubmit}>
            <div className="row mt-3">
              <div className="col-8">

                {/* Loai ruou */}
                <div class="form-group mb-3">
                  <select class="form-control" >
                    <option>Can 20 lit</option>
                    <option>Can 10 lit</option>
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
              </div>
              <div className="col-4">
                <input type="submit" className="btn btn-primary w-100 save-btn" value="Nhập" disabled={this.state.form_value.quantity == "" || this.state.form_value.total_cost == ""} />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Product;
