import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only redirect if not already on login page to avoid loops
            if (!window.location.pathname.includes('/auth/login')) {
                // We can't use router here easily, so we might need to dispatch an event
                // or let the UI handle the error.
                // For now, let's just clear the token
                localStorage.removeItem('access_token');
                // window.location.href = '/auth/login'; // Optional: force redirect
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const login = async (data: any) => {
    const { data: res } = await api.post('/auth/login', data);
    if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
    }
    return res;
};

export const logout = () => {
    localStorage.removeItem('access_token');
};

export const getCurrentUser = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

// User Management APIs
export const fetchUsers = async () => {
    const { data } = await api.get('/auth/users');
    return data;
};

export const createUser = async (data: any) => {
    const { data: res } = await api.post('/auth/register', data);
    return res;
};

export const updateUser = async (id: string, data: any) => {
    const { data: res } = await api.patch(`/auth/users/${id}`, data);
    return res;
};

export const deleteUser = async (id: string) => {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
};

// API Key Management APIs
export const fetchApiKeys = async () => {
    const { data } = await api.get('/auth/api-keys');
    return data;
};

export const createApiKey = async (data: any) => {
    const { data: res } = await api.post('/auth/api-keys', data);
    return res;
};

export const updateApiKey = async (id: string, data: any) => {
    const { data: res } = await api.patch(`/auth/api-keys/${id}`, data);
    return res;
};

export const deleteApiKey = async (id: string) => {
    const { data } = await api.delete(`/auth/api-keys/${id}`);
    return data;
};

// Template APIs
export const fetchTemplates = async () => {
    const { data } = await api.get('/templates');
    return data;
};

export const fetchTemplate = async (id: string) => {
    const { data } = await api.get(`/templates/${id}`);
    return data;
};

export const createTemplate = async (data: any) => {
    const { data: res } = await api.post('/templates', data);
    return res;
};

export const updateTemplate = async (id: string, data: any) => {
    const { data: res } = await api.patch(`/templates/${id}`, data);
    return res;
};

export const createVersion = async (templateId: string, data: any) => {
    const { data: res } = await api.post(`/templates/${templateId}/versions`, data);
    return res;
};

export const previewTemplate = async (data: any) => {
    const { data: res } = await api.post('/templates/preview', data);
    return res;
};

export const sendEmail = async (id: string, data: any) => {
    const { data: res } = await api.post(`/templates/${id}/send`, data);
    return res;
};

export const fetchStats = async () => {
    const { data } = await api.get('/templates/stats/overview');
    return data;
};

// SMTP APIs
export const fetchSmtpConfigs = async () => {
    const { data } = await api.get('/smtp');
    return data;
};

export const createSmtpConfig = async (data: any) => {
    const { data: res } = await api.post('/smtp', data);
    return res;
};

export const updateSmtpConfig = async (id: string, data: any) => {
    const { data: res } = await api.patch(`/smtp/${id}`, data);
    return res;
};

export const deleteSmtpConfig = async (id: string) => {
    const { data } = await api.delete(`/smtp/${id}`);
    return data;
};

export const testSmtpConnection = async (id: string) => {
    const { data } = await api.post(`/smtp/${id}/test`);
    return data;
};

// A/B Testing APIs
export const createVariant = async (templateId: string, data: any) => {
    const { data: res } = await api.post(`/ab-testing/templates/${templateId}/variants`, data);
    return res;
};

export const fetchVariants = async (templateId: string) => {
    const { data } = await api.get(`/ab-testing/templates/${templateId}/variants`);
    return data;
};

export const updateTrafficSplit = async (versionId: string, trafficSplit: number) => {
    const { data } = await api.patch(`/ab-testing/variants/${versionId}/traffic-split`, { trafficSplit });
    return data;
};

export const fetchABTestResults = async (templateId: string) => {
    const { data } = await api.get(`/ab-testing/templates/${templateId}/results`);
    return data;
};

export const declareWinner = async (templateId: string, winnerVersionId: string) => {
    const { data } = await api.post(`/ab-testing/templates/${templateId}/declare-winner`, { winnerVersionId });
    return data;
};

// Translation APIs
export const fetchTranslations = async (templateId: string) => {
    const { data } = await api.get(`/templates/${templateId}/translations`);
    return data;
};

export const fetchTranslation = async (templateId: string, language: string) => {
    const { data } = await api.get(`/templates/${templateId}/translations/${language}`);
    return data;
};

export const createTranslation = async (templateId: string, translationData: any) => {
    const { data } = await api.post(`/templates/${templateId}/translations`, translationData);
    return data;
};

export const updateTranslation = async (templateId: string, language: string, translationData: any) => {
    const { data } = await api.put(`/templates/${templateId}/translations/${language}`, translationData);
    return data;
};

export const deleteTranslation = async (templateId: string, language: string) => {
    const { data } = await api.delete(`/templates/${templateId}/translations/${language}`);
    return data;
};

export const setDefaultTranslation = async (templateId: string, language: string) => {
    const { data } = await api.post(`/templates/${templateId}/translations/${language}/set-default`);
    return data;
};

// Webhook APIs
export const fetchWebhooks = async () => {
    const { data } = await api.get('/webhooks');
    return data;
};

export const fetchWebhook = async (id: string) => {
    const { data } = await api.get(`/webhooks/${id}`);
    return data;
};

export const createWebhook = async (webhookData: any) => {
    const { data } = await api.post('/webhooks', webhookData);
    return data;
};

export const updateWebhook = async (id: string, webhookData: any) => {
    const { data } = await api.patch(`/webhooks/${id}`, webhookData);
    return data;
};

export const deleteWebhook = async (id: string) => {
    const { data } = await api.delete(`/webhooks/${id}`);
    return data;
};

export const testWebhook = async (id: string) => {
    const { data } = await api.post(`/webhooks/${id}/test`);
    return data;
};

export const fetchWebhookDeliveries = async (webhookId: string) => {
    const { data } = await api.get(`/webhooks/${webhookId}/deliveries`);
    return data;
};
