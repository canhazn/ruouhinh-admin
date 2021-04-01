import axiosInstance from './Axios';
import { config } from './Constant';

export const materialService = {
    getList,
}

function getList() {
    const url = `${config.API_URL}/material/`;
    return axiosInstance.get(url).then(res => res.data)
}

