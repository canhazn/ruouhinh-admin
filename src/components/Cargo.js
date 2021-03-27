/*jslint eqeq: true*/

import React, { Component, useState, useEffect } from 'react';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
import NumberFormatCustom from "./NumberFormatCustom";
import { Wallet } from "react-bootstrap-icons"

import { cargoService } from "services/cargoService"
import { productService } from "services/productService"

const initForm = {
  product: "1", // rice product id = 1  
  quantity: "",
  note: "",
  id: "",
};



function CargoForm(props) {
  let { cargo_form, handleChange, handleSubmit, onDelete } = props;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getList().then(res => {
      setProducts(res.result)
    })
  }, []);

  let selectProducts = products.map(product => {
    return (
      <option key={product.id} value={product.id}>{product.title}</option>
    )
  })

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <select className="form-select" name="product" value={cargo_form.form_value.product} onChange={handleChange} >
          {selectProducts}
        </select>
      </div>

      <div className="mb-3">
        <input type="number" className="form-control" placeholder="Số lít" name="quantity" value={cargo_form.form_value.quantity} onChange={handleChange} required />
      </div>

      {/* Ghi chú */}
      <div className="mb-3">
        <input type="text" className="form-control mb-3" placeholder="Ghi chú" name="note" value={cargo_form.form_value.note} onChange={handleChange} />
      </div>

      {/* Submit btn */}
      <div className="mb-3 d-flex">
        {cargo_form.update_mode &&
          <div>
            {/* For edit item: cancel button and id of item */}
            <input type="number" name="id" defaultValue={cargo_form.form_value.id} hidden />
            <div className={(cargo_form.sending ? "invisible" : "visible") + " btn btn-secondary px-3 me-3"} onClick={() => onDelete(cargo_form.form_value.id)} >
              Xóa
              {cargo_form.deleting && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>}
            </div>
          </div>
        }

        <button type="submit" className={(cargo_form.deleting ? "invisible" : "visible") + " btn btn-primary flex-grow-1"} disabled={String(cargo_form.form_value.quantity) === "" || String(cargo_form.form_value.total_cost) === ""}>
          {!cargo_form.sending &&
            <span >{cargo_form.update_mode ? "Lưu thay đổi" : "Nhập"}</span>
          }
          {cargo_form.sending && <div className="ms-3 spinner-border spinner-border-sm" role="status">
            <span className="sr-only"></span>
          </div>}
        </button>
      </div>
    </form>
  )
}



function ListItems(props) {
  let { cargos, onUpdate, loading } = props;

  const [products, setProducts] = useState([])

  useEffect(() => {
    productService.getList().then(res => {
      let listProduct = []
      res.result.map(product => {
        listProduct[product.id] = product.title
      })
      setProducts(listProduct)
    })
  }, [])

  if (!cargos) return (
    <tbody></tbody>
  )

  let listCargos = cargos.map((cargo, index) => {
    return (
      <tr key={cargo.id} onClick={() => onUpdate(cargo)} data-bs-toggle="modal" data-bs-target="#form_modal">
        <td className="text-center"><Moment format="DD/M/YY">{cargo.date_created}</Moment></td>
        <th className="text-center"> {products[cargo.product]}</th>
        <td className="text-center d-none d-md-block">{cargo.quantity} lít</td>
        <td className="text-center custom-hidden">{cargo.note ? cargo.note : ".."}</td>
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
            <th scope="col" className="text-center custom-hidden">Ghi chú</th>
          </tr>
        </thead>
        {!loading &&
          <tbody>
            {listCargos}
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
      {cargos.length === 0 && !loading && <div className="row text-center">
        <p>Không có dữ liệu</p>
      </div>
      }
    </div>
  )
}


function Square(props) {
  let { title, product_id } = { ...props }
  const [total_amount, setTotalAmount] = useState(0);

  useEffect(() => {
    cargoService.getTotalOf(product_id).then(res => {
      setTotalAmount(res.total_amount)
    })
  }, []);

  return (
    <div className="col-12">
      <div className="card border-left-primary  h-100 py-2">
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold text-primary mb-1">
                Tổng {title}</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                <NumberFormat value={total_amount} displayType={'text'} thousandSeparator={' '} decimalSeparator="," suffix=" lít" />
              </div>
            </div>
            <div className="col-auto">
              <Wallet width="32" height="32"></Wallet>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryBoxView(props) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getList().then(res => {
      setProducts(res.result)
    })
  }, []);

  let list_square = products.map(product => <Square title={product.title} product_id={product.id}></Square>)

  return (
    <div className="row mt-3 g-3">      
      {list_square}
    </div>
  )
}

class Rice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cargos: [],
      form_value: initForm,
      update_mode: false,
      id: "",
      filter: {
        limmit: "",
        product: ""
      },
      cargo_form: {
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

    cargoService.getList(this.state.filter.product).then(res => {
      this.setState({
        cargos: res.result,
        loading: false
      })
    })
  }

  // on create -> reset form
  onCreate() {
    this.setState({
      cargo_form: {
        update_mode: false,
        deleting: false,
        form_value: { ...initForm }
      }
    })
  }

  // on update -> add field to form
  onUpdate(cargo) {

    this.setState((prevState) => {
      let cargo_form = { ...prevState };
      cargo_form.form_value = { ...cargo };
      cargo_form.update_mode = true;
      return { cargo_form: cargo_form };
    });
  }


  onDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
      this.setState({ cargo_form: { ...this.state.cargo_form, deleting: true } });

      cargoService.deleteCargo(id).then(data => {
        this.setState({
          cargo_form: {
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
      let cargo_form = { ...prevState.cargo_form };
      let form_value = cargo_form.form_value;

      form_value[name] = value;
      if (String(form_value["product"]) === "2" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 30000;
      if (String(form_value["product"]) === "1" && name !== "total_cost") form_value["total_cost"] = form_value["quantity"] * 11000;
      return { cargo_form: cargo_form };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ cargo_form: { ...this.state.cargo_form, sending: true } });

    // Validate data
    if (this.state.cargo_form.form_value.quantity === "" || this.state.cargo_form.form_value.total_cost === "") {
      return;
    }

    let cargo_id = this.state.cargo_form.form_value.id;
    let value = JSON.stringify(this.state.cargo_form.form_value);

    if (this.state.cargo_form.update_mode) {
      // Update item
      cargoService.updateCargo(cargo_id, value).then(data => {
        this.getList();

        this.setState({
          cargo_form: {
            update_mode: false,
            sending: false,
            form_value: { ...initForm }
          }
        });
      });
    } else {
      // Create item
      cargoService.createCargo(value).then(data => {
        this.setState({
          cargo_form: {
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
          <legend>Kho</legend>
          <hr />
            <SummaryBoxView></SummaryBoxView>

          {/* form_modal */}
          <div className="modal fade" id="form_modal" tabIndex="-1" aria-labelledby="form_modelLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="form_modelLabel">{this.state.cargo_form.form_value.id ? "Chi tiết" : "Nhập"}</h5>
                  <button id="close-modal-btn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <CargoForm cargo_form={this.state.cargo_form} onDelete={this.onDelete} handleChange={this.handleChange} handleSubmit={this.handleSubmit}></CargoForm>
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
              <select className="form-select" name="product" value={this.state.filter.product} onChange={this.handleFilter}>
                <option value="">---</option>
                <option value="1">Gạo</option>
                <option value="2">Men</option>
              </select>
            </div>
          </div>

          <div className="">
            <ListItems cargos={this.state.cargos} onUpdate={this.onUpdate} onDelete={this.onDelete} loading={this.state.loading}></ListItems>
          </div>

        </div>
      </div >
    )
  }
}

export default Rice;
