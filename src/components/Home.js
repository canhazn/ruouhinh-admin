import React, { Component, useState, useEffect } from 'react';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';
// import NumberFormatCustom from "./NumberFormatCustom";
import { orderService } from "services/orderService";
import { receiptService } from "services/receiptService";
import { notifyService } from "services/notifyService";
import { Wallet } from "react-bootstrap-icons";

function Square(props) {
    let { title, value } = { ...props }
    return (
        <div className="col-md-4">
            <div className="card border-left-primary  h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary mb-1">
                                {title}</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                <NumberFormat value={value} displayType={'text'} thousandSeparator={'.'} decimalSeparator="," suffix=" đ" />
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

function OrderThing(props) {

    const [total_amount, updateTotalAmount] = useState("");
    const [total_receipt, updateTotalReceipt] = useState("");

    useEffect(() => {

        orderService.getTotalInfo().then(res => {
            updateTotalAmount(res.total_amount ? res.total_amount : 0);
        });

        receiptService.getTotalInfo().then(res => {
            let total_amount_rice = res.total_amount_rice ? res.total_amount_rice : 0;
            let total_amount_yeast = res.total_amount_yeast ? res.total_amount_yeast : 0;
            updateTotalReceipt(total_amount_rice + total_amount_yeast);
        });

    }, [])


    return (
        <div className="row mt-3 g-3">
            <Square title="Tổng bán" value={total_amount}></Square>
            <Square title="Tổng nhập" value={total_receipt}></Square>
            <Square title="Lợi nhuận" value={total_amount - total_receipt}></Square>
        </div>
    )
}

function ListItems(props) {

    const [notifies, setNotifies] = useState([])
    const [loading, setLoading] = useState(false)


    let list_notify = notifies.map((item, index) => {
        return (
            <tr key={index}>
                <td>{item.verb}</td>
                <td>{item.actor.factory_name}</td>
                <td className="text-center"><Moment format="D/M/YY hh:mm">{item.timestamp}</Moment></td>
                <td className="w-50  custom-hidden">{item.description}</td>
            </tr>
        )
    });

    useEffect(() => {
        setLoading(true);
        notifyService.getNotify().then(res => {
            setNotifies(res.result);
            setLoading(false);
        })
    }, [])

    if (!notifies) return (
        <tbody></tbody>
    )

    return (
        <div className="table-responsive-md">
            <table className="table table-striped align-middle table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col" className="text-center">Verb</th>
                        <th scope="col" className="text-center">Actor</th>
                        <th scope="col" className="text-center ">Timestamp</th>
                        <th scope="col" className="text-center custom-hidden">Description</th>
                        
                    </tr>
                </thead>
                {!loading &&
                    <tbody>
                        {list_notify}
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
            {notifies.length === 0 && !loading && <div className="row text-center">
                <p>Không có dữ liệu</p>
            </div>
            }
        </div>
    )
}


class Home extends Component {
 
    render() {
        return (
            <div>
                <OrderThing></OrderThing>
                <legend className="mt-3">Home page</legend>
                <hr />
                <ListItems></ListItems>
            </div>
        )
    }
}

export default Home;
