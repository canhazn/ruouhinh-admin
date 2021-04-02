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
        if (isLoginMatch) return;
        authService.getFactoryName().then(res => {
            setUser({ factory_name: res.factory_name })
        })
    }, [!isLoginMatch]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-none d-md-block">
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-md-none d-block">
                <div className="container">

                    <div className="w-100 pb-2 border-bottom text-center d-md-none d-block">
                        <Link className="navbar-brand m-auto" to="/">{user.factory_name}</Link>
                    </div>

                    <div className="d-flex justify-content-between w-100" id="navbarNav">
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
        </div>
    );
}

