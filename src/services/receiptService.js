import axiosInstance from './Axios';
import { config } from './Constant';

export const receiptService = {
    getList,
    createReceipt,
    deleteReceipt,
    updateReceipt,
    getTotalInfo
}

function getTotalInfo() {
    const url = `${config.API_URL}/receipt/?get-total-info=all`;
    return axiosInstance.get(url).then(res => res.data)
}

function getList(material) {
    const url = `${config.API_URL}/receipt/?material=${material}`;    
    return axiosInstance.get(url).then(res => res.data)
}

function createReceipt(form) {
    const url = `${config.API_URL}/receipt/`;
    return axiosInstance.post(url, form);
}

function deleteReceipt(receipt_id) {
    const url = `${config.API_URL}/receipt/${receipt_id}/`;
    return axiosInstance.delete(url);
}

function updateReceipt(receipt_id, value) {
    const url = `${config.API_URL}/receipt/${receipt_id}/`;
    return axiosInstance.put(url, value);
}