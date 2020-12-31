import React from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import NumberFormat from 'react-number-format';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import ContainerContext from '../../Container/ContainerContext';

import { config } from './../../../Constant';

function FormTransition(props) {
  return <Slide direction="down" {...props} />;
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
            name: "totalAmount",
            value: values.value
          },
        });
      }}
      thousandSeparator
      suffix=" đ"
    />
  );
}


class Support extends React.Component {

  static contextType = ContainerContext;

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      shouldDisableSubmit: false,
      submitState: "Gửi - tạo hóa đơn",
      formData: {
        name: null,
        phone: null,
        problem: null,
        totalAmount: null,
        feedback: null
      },
      errors: {},
    };
  }

  componentDidMount() {
    // console.log(this.props.place_id);
  }

  openForm = () => {
    this.setState({ isOpen: true });
  };

  closeForm = () => {
    this.setState({ isOpen: false });
  }

  getBillList() {
    
  }

  summitForm = () => {

    let valid = this.validateField();
    if (!valid) return;

    const url = `${config.API_URL}/bills`;
    let formData = { ...this.state.formData };
    formData["place_id"] = this.props.place_id;
    formData["coords"] = this.context.location.coords;
    this.setState({ submitState: "Đang gửi" });
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }).then(res => {
      if (res.status === 200) console.log("ok");
      this.getBillList();
      setTimeout(() => {
        this.setState({ submitState: "Đã gửi!", shouldDisableSubmit: true });
      }, 1000);
      setTimeout(() => {        
        this.setState({ formData: {}, isOpen: false });
      }, 1300);
      // res.json().then(m => console.log(m))
    });
  };

  validateField(name) {
    let formData = { ...this.state.formData };
    let errors = { ...this.state.errors };
    let isValid = true;
    if (name) {
      errors[name] = !formData[name] ? "Không được để trống" : null;
    } else {
      let fields = ['name', 'phone', 'problem', 'totalAmount', 'feedback'];
      fields.forEach(name => errors[name] = !formData[name] ? "Không được để trống" : null);
    }

    this.setState({
      errors: errors
    });

    Object.keys(errors).forEach(item => {
      if (!!errors[item]) isValid = false;
    })

    return isValid;
  }

  handleBillForm = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let formData = { ...this.state.formData };
    formData[name] = value;

    this.setState({
      formData: formData,
    }, () => {
      this.validateField(name);
    });
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="secondary" onClick={this.openForm}>Hỗ trợ bảo vệ chủ xe</Button>
        <Dialog
          open={this.state.isOpen}
          fullScreen={this.props.fullScreen}
          TransitionComponent={FormTransition}
          keepMounted                    
          onClose={this.closeForm}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          {/* <DialogTitle id="alert-dialog-slide-title">
            Tạo hóa đơn
          </DialogTitle> */}
          <FormControl>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Để hỗ trợ bảo vệ quyền lợi chủ xe, chúng tôi sẽ ghi lại hóa đơn, đánh giá, nhận xét của bạn về Gara này.                 
            </DialogContentText>
              <TextField
                label="Họ và tên"
                type="text"
                fullWidth
                margin="normal"
                variant="outlined"
                value={this.state.name}
                name="name"
                onChange={this.handleBillForm}
                error={!!this.state.errors.name}
                helperText={this.state.errors.name}
              />
              <TextField
                label="Số điện thoại"
                type="tel"
                fullWidth
                margin="normal"
                variant="outlined"
                name="phone"
                onChange={this.handleBillForm}
                error={!!this.state.errors.phone}
                helperText={this.state.errors.phone}
              />
              <TextField
                label="Mô tả hỏng hóc"
                placeholder="Xịt lốp, Nổ lốp, Ắc qui hết điện, Tai nạn, Đèn pha hỏng ..."
                type="text"
                fullWidth
                margin="normal"
                variant="outlined"
                name="problem"
                onChange={this.handleBillForm}
                error={!!this.state.errors.problem}
                helperText={this.state.errors.problem}
              />
              <TextField
                variant="outlined"
                label="Giá thành"
                fullWidth
                margin="normal"
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
                name="totalAmount"
                onChange={this.handleBillForm}
                error={!!this.state.errors.totalAmount}
                helperText={this.state.errors.totalAmount}
              />
              <TextField
                label="Đánh giá về cách làm việc của gara này"
                multiline
                rows="4"
                rowsMax="15"
                fullWidth
                margin="normal"
                variant="outlined"
                name="feedback"
                onChange={this.handleBillForm}
                error={!!this.state.errors.feedback}
                helperText={this.state.errors.feedback}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeForm} color="primary">
                Đóng
              </Button>

              <Button onClick={this.summitForm} color="primary" disabled={this.state.shouldDisableSubmit}>
                {this.state.submitState}
              </Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      </div>
    );
  }
}

Support.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(Support);