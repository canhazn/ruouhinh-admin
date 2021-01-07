import React, { useState } from 'react';
import axiosInstance from '../../Axios';
import { useHistory } from 'react-router-dom';



export default function Login() {
    const history = useHistory();
    const initialFormData = Object.freeze({
        username: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axiosInstance
            .post(`token/`, {
                username: formData.username,
                password: formData.password,
            })
            .then((res) => {
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token');
                history.push('/');
                //console.log(res);
                //console.log(res.data);
            });
    };

    return (
        <div>
            <form>
                <input
                    required
                    id="username"
                    placeholder="Username"
                    name="username"
                    onChange={handleChange}
                />
                <input

                    required
                    fullWidth
                    name="password"
                    placeholder="Password"
                    type="password"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                >
                    Sign In
				    </button>
            </form>
        </div>

    );
}