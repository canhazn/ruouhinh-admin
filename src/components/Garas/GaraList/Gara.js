import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk'
import styles from './Gara.module.css';
class Gara extends Component {
    render() {
        return (
            <Link to={'/garas/' + this.props.gara.place_id}>
                <Card className={styles.gara_item}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.props.gara.name}
                            </Typography>
                            <Typography className={styles.google_formatted_address} component="p">
                                {this.props.gara.formatted_address}
                            </Typography>
                            {this.props.gara.formatted_phone_number &&
                                <div className={styles.bar}>
                                    <PhoneInTalkIcon />
                                </div>
                            }

                        </CardContent>
                    </CardActionArea >
                </Card >
            </Link>
        )
    }
}

export default Gara;