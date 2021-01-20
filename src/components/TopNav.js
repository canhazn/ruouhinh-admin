import React from 'react';
import { Link } from 'react-router-dom';

class TopNav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/xuat/">Home</Link>
                    <div className="mr-0" id="navbarNav">
                        <Link className="nav-link d-inline-block" to="/xuat/">Xuất</Link>
                        <Link className="nav-link d-inline-block" to="/material/">Nhập</Link>
                        <Link className="nav-link d-inline-block" to="/logout/">Logout</Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default TopNav;