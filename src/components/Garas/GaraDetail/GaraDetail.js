import React, { Component } from 'react';
import styles from './GaraDetail.module.css';
import TopNav from './TopNav';
import Button from '@material-ui/core/Button';
import ContainerContext from '../../Container/ContainerContext';

import Divider from '@material-ui/core/Divider';
import InfoIcon from '@material-ui/icons/Info';
import DirectionsIcon from '@material-ui/icons/Directions';
import RateReviewIcon from '@material-ui/icons/RateReview';

import Support from './Support.js';
import BillList from './BillList.js';
import { config } from '../../../Constant';

class GaraDetail extends Component {
  static contextType = ContainerContext;

  constructor(props) {
    super(props);

    this.state = {
      gara: {},
      isLoaded: false
    }
  }

  getGaraDetail() {
    const place_id = this.props.match.params.garaId;
    if (this.context.garas.list.length > 0) {
      let gara = this.context.garas.list.find(gara => gara.place_id === place_id);
      this.setState({ gara: gara, isLoaded: true });
      return;
    }

    const url = `${config.API_URL}/garas/${place_id}`;
    fetch(url).then(response => response.json()).then(data => {
      console.log(data);
      this.setState({ gara: data, isLoaded: true })
    })
  }

  componentDidMount() {
    this.getGaraDetail();
  }

  goBack() {
    this.props.history.push('/garas');
  }

  render() {
    return (
      <div>
        <TopNav gara={this.state.gara} />
        {this.state.isLoaded && (
          <React.Fragment>
            {this.state.gara.formatted_phone_number ? (
              <React.Fragment>
                <div className={styles.contact}>
                  <Button href={"tel:" + this.state.gara.formatted_phone_number} title="call" variant="contained" color="primary" >{this.state.gara.formatted_phone_number} - Liên hệ</Button>
                  <Support place_id={this.state.gara.place_id} />
                </div>
                <ul className={styles.google_place_detail}>
                  <Divider></Divider>
                  <li>
                    <InfoIcon color="action" />
                    <span>Thông tin từ Google Map:</span>
                  </li>

                  <li>
                    <DirectionsIcon color="action" />
                    <a className={styles.google_formatted_address} target="_blank" rel="noopener noreferrer" href={this.state.gara.url}>{this.state.gara.formatted_address}</a>
                  </li>

                  <li>
                    {this.state.gara.rating ? (
                      <React.Fragment>
                        <RateReviewIcon color="action" />
                        <span>Đánh giá: {this.state.gara.rating}/5 ({this.state.gara.user_ratings_total} lượt)</span>
                      </React.Fragment>
                    ) : (
                        <React.Fragment>
                          <RateReviewIcon color="action" />
                          <span>Đánh giá: Chưa có thông tin</span>
                        </React.Fragment>
                      )}
                  </li>
                  <Divider></Divider>
                </ul>
                <BillList place_id={this.state.gara.place_id} />
              </React.Fragment>
                ) : (
                <React.Fragment>
                  <div className={styles.contact}>
                    <p>Gara này đang thiếu thông tin</p>
                    <p>Cập nhật thông tin qua <a target="_blank" rel="noopener noreferrer" href={this.state.gara.url}>Google Map</a></p>                    
                  </div>
                </React.Fragment>
                )}
          </React.Fragment>
            )}
      </div>
        );

        }
      }
      
export default GaraDetail;