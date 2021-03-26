import axiosInstance from './Axios';
import { config } from './Constant';

export const orderService = {
    getList,
    createOrder,
    deleteOrder,
    updateOrder,
    getTotalInfo
}

function getTotalInfo() {
    const url = `${config.API_URL}/order/?get-total-info=all`;
    return axiosInstance.get(url).then(res => res.data)
}

function getList(search, completed) {
    const url = `${config.API_URL}/order/?search=${search}&completed=${completed}`;
    return axiosInstance.get(url).then(res => res.data)
}

function createOrder(order) {
    const url = `${config.API_URL}/order/`;
    return axiosInstance.post(url, order);
}

function deleteOrder(order_id) {
    const url = `${config.API_URL}/order/${order_id}/`;
    return axiosInstance.delete(url);
}

function updateOrder(order_id, value) {
    const url = `${config.API_URL}/order/${order_id}/`;
    return axiosInstance.put(url, value);
}