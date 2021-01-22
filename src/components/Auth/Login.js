import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from './authService';


export default function Login() {
    const history = useHistory();

    const initialFormData = Object.freeze({
        email: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);
    const [loading, updateLoading] = useState(false)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        if (!formData.email || !formData.password) return;
        updateLoading(true);

        authService.login(formData.email, formData.password).then(res => {
            history.push('/');
            updateLoading(false);
        })
    };

    return (
        <div>

            {/* <form>
                <img className="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <label for="inputEmail" className="visually-hidden">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
                <label for="inputPassword" className="visually-hidden">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-muted">© 2017-2021</p>
            </form> */}


            <form className="m-auto form-login">
                <legend>Đăng nhập:</legend>
                <div className="position-relative form-group mb-3">
                    <input required id="email" placeholder="email" name="email" onChange={handleChange} className="form-control"/>
                </div>

                <div className="position-relative form-group mb-3">
                    <input required name="password" placeholder="Password" type="password" id="password" onChange={handleChange} className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={loading || !formData.email || !formData.password}>
                    <span >Đăng nhập</span>
                    {loading && <div className="ms-3 spinner-border spinner-border-sm" role="status">
                        <span className="sr-only"></span>
                    </div>}
                </button>
            </form>
        </div>

    );
}