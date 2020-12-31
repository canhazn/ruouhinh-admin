import React, { Component } from 'react';
import styles from './About.module.css';

class About extends Component {
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h2>cuu-ho-oto.web.app</h2>
          <h4>Web app đang được phát triển đây là bản thử nghiệm.</h4>
        </div>
        <p>Thắc mắc của bạn có thể được giải đáp thông qua địa trỉ sau: </p>
        <p>Email:	&nbsp;
          <a href="mailto:help.cuuhooto@gmail.com?subject=Hỏi%20về%20cứu%20hộ%20ôtô">hotro.cuuhooto@gmail.com</a>
        </p>
        <p>Facebook: &nbsp; <a href="https://www.facebook.com/congdong.cuuhooto/" target="_blank" rel="noopener noreferrer">congdong.cuuhooto</a></p>
        <p>Blog: &nbsp; <a href="https://medium.com/@storys.cuuhooto" target="_blank" rel="noopener noreferrer">storys.cuuhooto</a></p>
        <p>Hotline: <a href="tel:0963697819" title="call">0963697819</a></p>
      </div>
    );
  }
}

export default About;