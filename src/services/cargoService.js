import axiosInstance from './Axios';
import { config } from './Constant';

export const cargoService = {
    getList,
    createCargo,
    deleteCargo,
    updateCargo,
    getTotalOf
}

function getTotalOf(product_id) {
    const url = `${config.API_URL}/cargo/?get-total-of=${product_id}`;
    return axiosInstance.get(url).then(res => res.data)
}

function getList(search, completed) {
    const url = `${config.API_URL}/cargo/`;
    return axiosInstance.get(url).then(res => res.data)
}

function createCargo(cargo) {
    const url = `${config.API_URL}/cargo/`;
    return axiosInstance.post(url, cargo);
}

function deleteCargo(cargo_id) {
    const url = `${config.API_URL}/cargo/${cargo_id}/`;
    return axiosInstance.delete(url);
}

function updateCargo(cargo_id, value) {
    const url = `${config.API_URL}/cargo/${cargo_id}/`;
    return axiosInstance.put(url, value);
}