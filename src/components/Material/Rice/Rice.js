import React, { Component } from 'react';
import { config } from '../../../Constant';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';



function ListItems(props) {
  let receipts = props.receipts;

  let listReceipts = receipts.map(receipt => {
    return (
      <li className="list-group-item" key={receipt.id}>
        <p>{receipt.factory.title}</p>

        <span className="mx-2">
          <Moment format="DD-MM-YYYY">
            {receipt.date_created}
          </Moment>
        </span>

        <span className="mx-2">{receipt.quantity} bao</span>
        <NumberFormat value={receipt.total_cost} displayType={'text'} thousandSeparator={true} suffix=" đ" />
      </li>
    )
  });

  return (
    <ul className="list-group">
      {listReceipts}
    </ul>
  )
}


class Rice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      receipts: [],
      form_value: {
        quantity: 0,
        total_cost: 0
      }
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
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState((prevState) => {
      let form_value = { ...prevState.form_value };
      form_value[name] = value;
      return { form_value };
    });
  }

  handleSubmit(event) {    
    event.preventDefault();
    console.log(this.state.form_value);
    const url = `${config.API_URL}/receipt/`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.form_value)
    }).then(data => {
      console.log(data);
    })
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <p>input</p>

          <form onSubmit={this.handleSubmit}>
            {/* Số bao */}
            <div className="mb-3">
              <label className="form-label">Số bao</label>
              <input type="number" className="form-control" placeholder="Số bao" name="quantity" value={this.state.form_value.quantity} onChange={this.handleChange} />
            </div>

            {/* Giá */}
            <div className="mb-3">
              <label className="form-label">Giá</label>
              <input type="number" className="form-control" placeholder="Giá" name="total_cost" value={this.state.form_value.total_cost} onChange={this.handleChange} />
            </div>

            <input type="submit" value="Nhập" />
          </form>
        </div>

        <div className="col-md-6">
          <ListItems receipts={this.state.receipts}></ListItems>
        </div>
      </div>
    )
  }
}

export default Rice;
