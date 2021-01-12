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

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        authService.login(formData.email, formData.password).then( res => {
            history.push('/');
        })
                
    };

    return (
        <div>
            <form>
                <input
                    required
                    id="email"
                    placeholder="email"
                    name="email"
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