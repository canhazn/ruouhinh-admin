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

        authService.login(formData.email, formData.password).then(res => {
            history.push('/');
        })

    };

    return (
        <div>

            {/* <form>
                <img class="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
                <label for="inputEmail" class="visually-hidden">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" />
                <label for="inputPassword" class="visually-hidden">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" />
                <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                <p class="mt-5 mb-3 text-muted">© 2017-2021</p>
            </form> */}


            <form className="m-auto form-login">
                <legend>Login:</legend>
                <div class="position-relative form-group mb-3">
                    <input required id="email" placeholder="email" name="email" onChange={handleChange} className="form-control" />
                </div>

                <div class="position-relative form-group mb-3">
                    <input required name="password" placeholder="Password" type="password" id="password" onChange={handleChange} className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign In</button>
            </form>
        </div>

    );
}