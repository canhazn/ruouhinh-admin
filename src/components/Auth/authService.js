import axiosInstance from '../../Axios';

export const authService = {
    login,
    logout,
    isAuthenticated,
}

function isAuthenticated() {
    let user = localStorage.getItem('user');    
    return !!user;
}


function login(email, password) {
    return axiosInstance.post(`token/`, {
        email: email,
        password: password,
    }).then((res) => {
        console.log(res)
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
        console.log(res);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        axiosInstance.defaults.headers['Authorization'] = null;
    });
}