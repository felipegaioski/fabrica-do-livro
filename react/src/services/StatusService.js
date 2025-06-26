import axiosClient from '../api/axios-client';

export const getStatuses = (filters = {}, relationships = [], sort = []) => {
    const params = {
        ...filters,
        relationships: relationships.join(','),
        sort: sort.join(','),
    };

    return axiosClient.get('/statuses', { params });
};
