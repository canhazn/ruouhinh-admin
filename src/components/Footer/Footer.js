import React, { Component } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
class Footer extends Component {

  goBack() {
    this.props.history.goBack();
  }

  render() {
    let isAbout = this.props.location.pathname === '/ho-tro';
    return (
      <div className="footer">
        {isAbout ? (
          <ChevronLeftIcon onClick={() => this.goBack()}/>          
        ) : (
          <Link to={'/ho-tro'}>Hỗ trợ</Link>
        )}
        <span>Beta app</span>
      </div>
    );
  }
}

export default withRouter(Footer);