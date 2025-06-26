import axiosClient from '../api/axios-client';

export const getTask = (id, options = {}) => {
    return axiosClient.get(`/tasks/${id}`, {
        params: options
    });
};

export const getTasks = (filters = {}, relationships = [], sort = []) => {
    const params = {
        ...filters,
        relationships: relationships.join(','),
        sort: sort.join(','),
    };

    return axiosClient.get('/tasks', { params });
};

export const storeTask = (payload) => {
    return axiosClient.post('/tasks', payload);
};

export const updateTask = (id, payload) => {
    return axiosClient.put(`/tasks/${id}`, payload);
};

export const deleteTask = (id) => {
    return axiosClient.delete(`/tasks/${id}`);
};
