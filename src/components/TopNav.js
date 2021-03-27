import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

export default function TopNav(props) {
    const history = useHistory();
    const [loading, updateLoading] = useState(false)
    const [user, setUser] = useState({ factory_name: "Home" })


    const isLoginMatch = !!matchPath(
        useLocation().pathname,
        '/login/'
    );

    const onLogout = () => {
        updateLoading(true);

        authService.logout().then(res => {
            history.push('/');
            updateLoading(false);
            // setUser({ factory_name: "Home"})
        })
    };

    useEffect(() => {
        authService.getFactoryName().then(res => {
            setUser({ factory_name: res.factory_name })
        })
    }, [!isLoginMatch,]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">{user.factory_name}</Link>
                <div className="mr-0" id="navbarNav">
                    <Link className="nav-link d-inline-block text-primary" to="/kho/">Kho</Link>
                    <Link className="nav-link d-inline-block text-primary" to="/ban/">Bán</Link>
                    <Link className="nav-link d-inline-block text-primary" to="/nhap/">Nhập</Link>
                    {!isLoginMatch &&
                        <div className="nav-link d-inline-block text-primary cursor-pointer" onClick={onLogout} >

                            {!loading ? <span >Đăng xuất</span> :
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

