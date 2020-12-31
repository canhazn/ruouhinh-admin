import React, { Component } from 'react';
import styles from './Home.module.css';
import ContainerContext from '../Container/ContainerContext';

class Home extends Component {

  static contextType = ContainerContext;

  constructor(props) {
    super(props);
    this.state = {
    
    };
  }


  render() {
  
    return (
      <div>
        chuoi 
      </div>
    )
  }
}

export default Home;
