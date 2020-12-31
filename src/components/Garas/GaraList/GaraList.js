import React, { Component } from 'react';
import styles from './GaraList.module.css';
import ContainerContext from '../../Container/ContainerContext';
import CircularProgress from '@material-ui/core/CircularProgress';

import Gara from './Gara';
import { config } from '../../../Constant';

export class GaraList extends Component {

    static contextType = ContainerContext;

    componentDidMount() {
        if (!this.context.location.isLoaded) {
            this.context.location.detechLocation()
                .then(coords => this.getGaras(coords))
                .then(list => this.context.garas.updateList(list))
                .catch(err => this.props.history.push('/'));
        }

        if (this.context.location.isLoaded && !this.context.location.error) {
            this.getGaras(this.context.location.coords)
                .then(list => this.context.garas.updateList(list))
                .catch(error => {
                    console.log(error);
                })
        }
    }

    async getGaras(coords) {
        const url = `${config.API_URL}/garas?lat=${coords.lat}&lng=${coords.lng}`;
        const response = await fetch(url);
        return await response.json();
    }

    render() {
        if (this.context.garas.isLoaded) {
            const listGara = this.context.garas.list.slice();
            const listGaraElement = listGara.map((gara) => {
                return (
                    <li key={gara.place_id}>
                        <Gara gara={gara} />
                    </li>
                )
            })

            return (
                <ul className={styles.gara_list}> {listGaraElement}</ul>
            )
        }

        return (
            <div className={styles.showLoading} >
                <CircularProgress size={30} />
            </div>
        )
    }
}

export default GaraList;