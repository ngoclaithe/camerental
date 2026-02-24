import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: ((import.meta as any).env.VITE_API_URL || 'http://localhost:3000') + '/api/v1',
    withCredentials: true,
});

export const authApi = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }).then((res: AxiosResponse) => res.data),
    logout: () => api.post('/auth/logout').then((res: AxiosResponse) => res.data),
    getMe: () => api.post('/auth/me').then((res: AxiosResponse) => res.data),
};

export const equipmentApi = {
    findAll: () => api.get('/equipments').then((res: AxiosResponse) => res.data),
    findOne: (id: string) => api.get(`/equipments/${id}`).then((res: AxiosResponse) => res.data),
    create: (data: any) => api.post('/equipments', data).then((res: AxiosResponse) => res.data),
    update: (id: string, data: any) => api.patch(`/equipments/${id}`, data).then((res: AxiosResponse) => res.data),
    delete: (id: string) => api.delete(`/equipments/${id}`).then((res: AxiosResponse) => res.data),
};

export const customerApi = {
    findAll: () => api.get('/customers').then((res: AxiosResponse) => res.data),
    create: (data: any) => api.post('/customers', data).then((res: AxiosResponse) => res.data),
    update: (id: string, data: any) => api.patch(`/customers/${id}`, data).then((res: AxiosResponse) => res.data),
};

export const userApi = {
    findAll: () => api.get('/users').then((res: AxiosResponse) => res.data),
    create: (data: any) => api.post('/users', data).then((res: AxiosResponse) => res.data),
};

export const orderApi = {
    findAll: () => api.get('/orders').then((res: AxiosResponse) => res.data),
    create: (data: any) => api.post('/orders', data).then((res: AxiosResponse) => res.data),
    updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }).then((res: AxiosResponse) => res.data),
};

export const calendarApi = {
    get: (from: string, to: string) => api.get(`/calendar?from=${from}&to=${to}`).then((res: AxiosResponse) => res.data),
};

export const reportApi = {
    getSummary: () => api.get('/reports/summary').then((res: AxiosResponse) => res.data),
};

export const uploadApi = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', (import.meta as any).env.VITE_CLOUDINARY_PRESET_NAME);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${(import.meta as any).env.VITE_CLOUDINARY_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        return data;
    }
};

export default api;
