import React, { useEffect } from 'react';
import axiosInstance from '../../Axios';
import { useHistory } from 'react-router-dom';
import { authService } from './authService';


export default function SignUp() {
	const history = useHistory();

	useEffect(() => {
		authService.logout().then( res => {
			history.push('/login');
		})
	});
	return <div>Logout</div>;
}