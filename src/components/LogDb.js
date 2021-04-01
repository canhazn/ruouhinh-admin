import React, { Component } from 'react';
import Moment from 'react-moment';
// import NumberFormat from 'react-number-format';
// import NumberFormatCustom from "./NumberFormatCustom";
import { config } from '../services/Constant';
import axiosInstance from "../services/Axios";

function ListItems(props) {
    let { notifies, loading } = props;
    if (!notifies) return (
        <tbody></tbody>
    )
    let list_notify = notifies.map((item, index) => {
        return (
            <tr key={item.id}>
                <td>{ item.verb }</td>
                <td>{ item.actor.factory_name }</td>
                <td className="text-center"><Moment format="D/M/YY hh:mm">{item.timestamp}</Moment></td>
                <td className="w-50">{ item.description }</td>                
            </tr>
        )
    });

    return (
        <div className="table-responsive-md">
            <table className="table table-striped align-middle table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col" className="text-center">Verb</th>
                        <th scope="col" className="text-center">Actor</th>
                        <th scope="col" className="text-center ">Timestamp</th>
                        <th scope="col" className="text-center custom-hidden">Description</th>
                        {/* <th scope="col" className="text-center custom-hidden">Số can</th> */}
                        {/* <th scope="col" className="text-center custom-hidden">Ghi chú</th> */}
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


class LogDb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notifies: [],
            loading: true
        }
    }

    getList() {

        let url = `${config.API_URL}/logdb/`;

        axiosInstance.get(url).then(res => res.data).then(res => {            
            this.setState({
                notifies: res.result,
                loading: false,
            })
        })
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        return (
            <div>
                <legend className="mt-3">Db Log</legend>
                <hr/>
                <ListItems notifies={this.state.notifies} loading={this.state.loading}></ListItems>
            </div>
        )
    }
}

export default LogDb;
