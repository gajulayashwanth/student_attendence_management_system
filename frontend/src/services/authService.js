import api from './api';

const authService = {
    register: (data) => api.post('/accounts/register/', data),

    login: (data) => api.post('/accounts/login/', data),

    adminLogin: (data) => api.post('/accounts/admin-login/', data),

    refreshToken: (refresh) => api.post('/accounts/token/refresh/', { refresh }),

    getProfile: () => api.get('/accounts/profile/'),

    updateProfile: (data) => api.patch('/accounts/profile/', data),

    checkApproval: () => api.get('/accounts/check-approval/'),

    getTeachers: (status) => {
        const params = status ? { status } : {};
        return api.get('/accounts/teachers/', { params });
    },

    approveTeacher: (id, isApproved) =>
        api.patch(`/accounts/teachers/${id}/approve/`, { is_approved: isApproved }),

    deleteTeacher: (id) => api.delete(`/accounts/teachers/${id}/delete/`),
};

export default authService;
