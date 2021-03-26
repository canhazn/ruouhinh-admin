import axiosInstance from './Axios';
import { config } from './Constant';

export const notifyService = {
    getNotify,
}

function getNotify() {
    let url = `${config.API_URL}/notify/`;
    return axiosInstance.get(url).then(res => res.data);
}
