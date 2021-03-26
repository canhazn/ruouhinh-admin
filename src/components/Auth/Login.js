import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../../services/authService';


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
        
        if (!formData.email || !formData.password) return;
        updateLoading(true);

        authService.login(formData.email, formData.password).then(res => {
            history.push('/');
            updateLoading(false);
        })
    };

    return (
        <div>
            <form className="m-auto form-login">
                <legend>Đăng nhập:</legend>
                <div className="position-relative form-group mb-3">
                    <input required type="email" id="email" placeholder="email" name="email" onChange={handleChange} className="form-control"/>
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