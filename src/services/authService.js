import axiosInstance from './Axios';
import { config } from './Constant';

export const authService = {
    login,
    logout,
    isAuthenticated,
    getUser,
    getFactoryName,
}

function isAuthenticated() {
    let user = localStorage.getItem('user');
    return !!user;
}

function getUser() {
    let user = localStorage.getItem('user');
    return user;
}

function getFactoryName() {
    let url = `${config.API_URL}/get_factory_name/`;
    return axiosInstance.get(url).then(res => res.data);
}


function login(email, password) {
    return axiosInstance.post(`token/`, {
        email: email,
        password: password,
    }).then((res) => {        
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);

        localStorage.setItem('user', JSON.stringify(res.data.user));
        axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + localStorage.getItem('access_token');
    });
}


function logout() {
    return axiosInstance.post('logout/blacklist/', {
        refresh_token: localStorage.getItem('refresh_token'),
    }).then(res => {        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        axiosInstance.defaults.headers['Authorization'] = null;
    });
}