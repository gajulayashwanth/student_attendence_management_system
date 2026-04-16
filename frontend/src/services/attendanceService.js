import api from './api';

const attendanceService = {
    markBulk: (data) => api.post('/attendance/mark/', data),

    getDaily: (subjectId, date) => {
        const params = { subject: subjectId };
        if (date) params.date = date;
        return api.get('/attendance/daily/', { params });
    },

    getMonthly: (subjectId, month, year) =>
        api.get('/attendance/monthly/', {
            params: { subject: subjectId, month, year },
        }),

    getDashboardStats: () => api.get('/attendance/dashboard-stats/'),

    getAudit: (filters) => api.get('/attendance/audit/', { params: filters }),
};

export default attendanceService;
