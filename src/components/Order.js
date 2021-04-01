/*jslint eqeq: true*/

import React, { Component, useState, useEffect } from 'react';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import { Wallet } from "react-bootstrap-icons"

import { orderService } from "services/orderService"
import { productService } from "services/productService"
import { cargoService } from "services/cargoService"
import moment from "moment";

const initForm = {

  quantity: "",
  cargo: {},
  total_cost: "",
  customer_name: "",
  completed: true,
  note: ""
};

function OrderForm(props) {
  let { order_form, handleChange, handleSubmit, onDelete } = props;

  const [products, setProducts] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    productService.getList().then(res => setProducts(res.result))
  }, []);

  useEffect(() => {
    let product_id = order_form.form_value.product ? order_form.form_value.product : 1;
    cargoService.getListOf(product_id).then(res => setCargos(res.result));

    // If update_mode set selected product_id
    // else do nothing so default selected is first element
    // if (order_form.update_mode) {
    // setSelectedProduct(product_id);
    // }
  }, [order_form.form_value.product]);


  let selectProducts = products.map(product => {
    return (
      <option key={product.id} value={product.id}>{product.title}</option>
    )
  })

  let selectCargos = cargos.map(cargo => {
    cargo.date_created = moment(cargo.date_created).format('L')
    return (
      <option key={cargo.id} value={cargo.id}>{cargo.quantity}_{cargo.real_quantity}_{cargo.date_created}</option>
    )
  })

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <select className="form-select" name="product" value={order_form.form_value.product} onChange={handleChange} required>
          {selectProducts}
        </select>
      </div>

      <div className="mb-3">
        <select className="form-select" name="cargo" value={order_form.form_value.cargo} onChange={handleChange} required>
          <option value="">----</option>
          {selectCargos}
        </select>
      </div>

      {/* Customer */}
      <div className="mb-3">
        <input type="text" className="form-control mb-3" placeholder="Khách hàng" name="customer_name" value={order_form.form_value.customer_name} onChange={handleChange} required />
      </div>

      {/* Số can */}
      <div className="mb-3">
        <input type="number" className="form-control mb-3" placeholder="Số lít" name="quantity" value={order_form.form_value.quantity} onChange={handleChange} required />
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

        <button type="submit" className={(order_form.deleting ? "invisible" : "visible") + " btn btn-primary flex-grow-1"} disabled={order_form.disabled}>
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

  const [products, setProducts] = useState([])

  useEffect(() => {
    productService.getList().then(res => {
      let listProduct = []
      res.result.map(product => listProduct[product.id] = product.title)
      setProducts(listProduct)
    })
  }, [])


  if (!orders) return (
    <tbody></tbody>
  )
  let listorders = orders.map((item, index) => {
    return (
      <tr key={item.id} className={(!item.completed && "bg-warning") + " cursor-pointer"} onClick={() => onUpdate(item)} data-bs-toggle="modal" data-bs-target="#form_modal">
        <td className="text-center"><Moment format="DD/M/YY">{item.date_created}</Moment></td>
        <td className="text-center"><NumberFormat value={item.total_cost} displayType={'text'} thousandSeparator={'.'} decimalSeparator="," suffix=" đ" /></td>
        <td className="text-center">{item.customer_name}</td>
        <th className="text-center custom-hidden"> {products[item.cargo.product]}</th>
        <td className="text-center custom-hidden">{item.quantity} lít</td>
        <td className="text-center custom-hidden">{item.note ? item.note : ".."}</td>
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
            <th scope="col" className="text-center custom-hidden">Số lít</th>
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
        <p>Không có dữ liệu</p>
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
      filter: {
        limmit: "",
        search: "",
        completed: ""
      },
      orders: [],
      order_form: {
        form_value: { ...initForm },
        update_mode: false,
        sending: false,
        deleting: false,
        disabled: true
      },
      loading: true,
      total_amount: 0,
      total_cash: 0,
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
    orderService.getList(this.state.filter.search, this.state.filter.completed).then(res => {
      this.setState({
        orders: res.result,
        loading: false,
        total_amount: res.total_amount ? res.total_amount : 0,
        total_cash: res.total_cash ? res.total_cash : 0
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
  onUpdate(order) {
    this.setState((prevState) => {
      // copy object so it prevent change original object
      let order_form = { ...prevState.order_form };
      let orderObject = { ...order };

      // save cargo_id, product_id to parent object
      orderObject.cargo = order.cargo.id;
      orderObject.product = order.cargo.product;

      // return order_form state
      order_form.form_value = { ...orderObject };
      order_form.update_mode = true;
      return { order_form: order_form, };
    });
  }

  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
      this.setState({ order_form: { ...this.state.order_form, deleting: true } });

      orderService.deleteOrder(id).then(data => {
        this.setState({
          order_form: {
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

      // update form value(order_form)
      form_value[name] = value;
      if (name === "quantity") form_value["total_cost"] = form_value["quantity"] * 25000;
      order_form.disabled = false;
      return { order_form: order_form, };
    });
  }

  hideFormModal() {
    document.getElementById('close-modal-btn').click();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ order_form: { ...this.state.order_form, sending: true } });
    let order_id = this.state.order_form.form_value.id;
    let value = JSON.stringify(this.state.order_form.form_value);


    if (this.state.order_form.update_mode) {
      // Update item
      orderService.updateOrder(order_id, value).then(data => {
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
      orderService.createOrder(value).then(data => {
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

          <legend>Bán</legend>
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
            {/* nex tings */}
            <div className="col-12">
              <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary mb-1">
                        Tiền rượu đã thu</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <NumberFormat className={this.state.total_cash === this.state.total_amount ? "text-success" : "text-warning"} value={this.state.total_cash} displayType={'text'} thousandSeparator={'.'} decimalSeparator="," suffix="" />
                        <span className="mx-1">/</span>
                        <NumberFormat className={this.state.total_cash === this.state.total_amount ? "text-success" : "text-primary"} value={this.state.total_amount} displayType={'text'} thousandSeparator={'.'} decimalSeparator="," suffix=" đ" />
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
          <div className="navbar d-flex justify-content-between align-items-baseline">

            <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#form_modal" onClick={() => this.onCreate()}>Thêm +</button>

            <div className="flex-grow-1">
            </div>
            <div className="w-50 me-3">
              <input type="text" className="form-control mb-3 " placeholder="Khách hàng" name="search" value={this.state.filter.search} onChange={this.handleFilter} />
            </div>

            <div className="col-auto">
              <select className="form-select  " name="completed" value={this.state.filter.completed} onChange={this.handleFilter}>
                <option value="">---</option>
                <option value="False">Nợ</option>
              </select>
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
