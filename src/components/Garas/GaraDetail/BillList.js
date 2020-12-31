import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import styles from './BillList.module.css';

import { config } from '../../../Constant';

class BillList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            billList: [],
            isLoaded: false
        };
    }

    getBills() {
        const place_id = this.props.place_id;

        const url = `${config.API_URL}/bills/${place_id}`;
        fetch(url).then(response => response.json()).then(data => {
            console.log(data);
            this.setState({ billList: data, isLoaded: true })
        })
    }

    componentDidMount() {
        this.getBills();
    }

    render() {
        if (this.state.isLoaded && this.state.billList.length > 0) {
            const billList = this.state.billList.slice();
            const listGaraElement = billList.map((bill, index) => {
                return (
                    <li key={bill.place_id + bill.timestamp}>
                        <div className={styles.bill} >
                            <Grid container alignItems="center">
                                <Grid item xs>
                                    <Typography gutterBottom variant="h6">
                                        {bill.problem}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography gutterBottom variant="h6">
                                        <NumberFormat value={bill.totalAmount} displayType={'text'} suffix={' đ'} thousandSeparator={true} />
                                    </Typography>
                                </Grid>
                            </Grid>
                            <div>{bill.feedback}</div>
                            <div>{bill.name}</div>
                            <div>{new Date(bill.timestamp).toLocaleString("vn-VN")}</div>
                        </div>
                        {index !== billList.length - 1 && <Divider></Divider>}
                    </li>
                )
            })

            return (
                <ul className={styles.bill_list}>{listGaraElement}</ul>
            )
        }
        return (
            <div className={styles.align_center}>
                {!this.state.isLoaded && <CircularProgress size={20} />}
                {this.state.isLoaded && this.state.billList.length === 0 && "Chưa ghi nhận lượt hỗ trợ nào!"}
            </div>
        );

    }
}

export default BillList;