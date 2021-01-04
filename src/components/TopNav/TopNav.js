import React from 'react';
import { Link } from 'react-router-dom';

class TopNav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">                    
                    <Link className="navbar-brand" to="/">Home</Link>
                    <div className="mr-0" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link"  to="/xuat/">Xuất</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/material/">Nhập</a>
                            </li>                           
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default TopNav;