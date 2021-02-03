import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import { authService } from './Auth/authService';
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
        let user = JSON.parse(authService.getUser());
        if (user) setUser({ factory_name: user.factory_name })
    }, [!isLoginMatch,]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/xuat/">{isLoginMatch ? "Home" : user.factory_name}</Link>
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

