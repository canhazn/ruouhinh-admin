import axiosInstance from './Axios';
import { config } from './Constant';

export const productService = {
    getList,
    createProduct,
    deleteProduct,
    updateProduct,
    getTotalInfo
}

function getTotalInfo() {
    const url = `${config.API_URL}/product/?get-total-info=all`;
    return axiosInstance.get(url).then(res => res.data)
}

function getList() {
    const url = `${config.API_URL}/product/`;
    return axiosInstance.get(url).then(res => res.data)
}

function createProduct(product) {
    const url = `${config.API_URL}/product/`;
    return axiosInstance.post(url, product);
}

function deleteProduct(product_id) {
    const url = `${config.API_URL}/product/${product_id}/`;
    return axiosInstance.delete(url);
}

function updateProduct(product_id, value) {
    const url = `${config.API_URL}/product/${product_id}/`;
    return axiosInstance.put(url, value);
}