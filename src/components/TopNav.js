import React, { useState } from 'react';
import { useHistory,  useLocation, matchPath } from 'react-router-dom';
import { authService } from './Auth/authService';
import { Link } from 'react-router-dom';

export default function TopNav(props) {
    const history = useHistory();
    const [loading, updateLoading] = useState(false)

    const isLoginMatch = !!matchPath(
        useLocation().pathname,
        '/login/'
    );

    const onLogout = () => {
        updateLoading(true);

        authService.logout().then(res => {
            history.push('/');
            updateLoading(false);
        })
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/xuat/">Home</Link>
                <div className="mr-0" id="navbarNav">
                    <Link className="nav-link d-inline-block text-primary" to="/xuat/">Xuất</Link>
                    <Link className="nav-link d-inline-block text-primary" to="/material/">Nhập</Link>
                    {!isLoginMatch &&
                        <div className="nav-link d-inline-block text-primary cursor-pointer" onClick={onLogout} >
                            <span >Đăng xuất</span>
                            {loading &&
                                <div className="ms-2 spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </nav>
    );
}

