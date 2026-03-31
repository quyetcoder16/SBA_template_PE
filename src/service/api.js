import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getShoes = (name = '', category = '', page = 0, size = 10) => {
    return api.get('/shoes/search', {
        params: {
            name: name || undefined,
            category: category || undefined,
            page,
            size,
            sortBy: 'shoesName',
            direction: 'asc'
        }
    });
};

export const getCategories = () => {
    return api.get('/categories');
};

export const getShoesById = (id) => {
    return api.get(`/shoes/${id}`);
};

export const createShoes = (shoes) => {
    return api.post('/shoes', shoes);
};

export const updateShoes = (id, shoes) => {
    return api.put(`/shoes/${id}`, shoes);
};

export const deleteShoes = (id) => {
    return api.delete(`/shoes/${id}`);
};

export default api;