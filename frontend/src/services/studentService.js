import api from './api';

const studentService = {
    getAll: (subjectId) => {
        const params = subjectId ? { subject: subjectId } : {};
        return api.get('/students/', { params });
    },

    getById: (id) => api.get(`/students/${id}/`),

    create: (data) => api.post('/students/', data),

    update: (id, data) => api.put(`/students/${id}/`, data),

    delete: (id) => api.delete(`/students/${id}/`),

    getBySubject: (subjectId) => api.get(`/students/by-subject/${subjectId}/`),
};

export default studentService;
