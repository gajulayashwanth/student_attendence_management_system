import api from './api';

const subjectService = {
    getAll: () => api.get('/subjects/'),

    getById: (id) => api.get(`/subjects/${id}/`),

    create: (data) => api.post('/subjects/', data),

    update: (id, data) => api.put(`/subjects/${id}/`, data),

    delete: (id) => api.delete(`/subjects/${id}/`),

    getMySubjects: () => api.get('/subjects/my-subjects/'),
};

export default subjectService;
