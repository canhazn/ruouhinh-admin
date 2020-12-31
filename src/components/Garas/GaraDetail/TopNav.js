import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

// import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = {
    Root: {
        flexGrow: 1,
    },
    title: {
        marginLeft: '15px',
        flexGrow: 1,
    },
}

class TopNav extends Component {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    handleClick(event) {
        // this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    };


    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.Root}>
                <AppBar position="static" color="default">
                    <Toolbar disableGutters={true}>
                        <Typography variant="h6" className={classes.title} color="inherit">
                            {this.props.gara.name}
                        </Typography>

                        <IconButton edge="start" color="inherit" aria-label="Menu" onClick={this.handleClick.bind(this)}>
                            <MoreIcon />
                        </IconButton>
                        <Menu id="more-menu" anchorEl={anchorEl} open={open} onClose={this.handleClose}>
                            <MenuItem>
                                Cập nhật thông tin
                            </MenuItem>
                            <MenuItem>
                                Báo cáo
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>

        );

    }
}

export default withStyles(styles)(TopNav);