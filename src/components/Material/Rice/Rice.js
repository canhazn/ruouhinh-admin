import React, { Component } from 'react';
import { config } from '../../../Constant';



function ListItems(props) {
  let receipts = props.receipts;

  let listReceipts = receipts.map(receipt => {
    return (
      <li className="list-item" key={receipt.id}>
        <p>{receipt.factory.title}</p>
        <p>{receipt.material.title}</p>
        <p>{receipt.quantity}</p>
        <p>{receipt.total_cost}</p>
        <p>{receipt.date_created}</p>
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
    }
  }

  getList() {
    const url = `${config.API_URL}/receipt/`;
    fetch(url).then(response => response.json()).then(data => {
      this.setState({ receipts: data })
    })
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">

          {/* Số bao */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Số bao</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Số bao"></input>
          </div>

          {/* Giá */}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Giá</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Giá"></input>
          </div>
        </div>

        <div className="col-md-6">
          <ListItems receipts={this.state.receipts}></ListItems>
        </div>
      </div>
    )
  }
}

export default Rice;
