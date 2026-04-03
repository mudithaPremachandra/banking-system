import api from './api';

export const userService = {
    updateProfile: async (data: { fullName?: string; phone?: string }) => {
        const { data: res } = await api.patch('/auth/me/profile', data);
        return res.data || res;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const { data: res } = await api.post('/auth/me/change-password', { currentPassword, newPassword });
        return res;
    },

    getSessions: async (): Promise<{ id: string; createdAt: string; expiresAt: string }[]> => {
        const { data: res } = await api.get('/auth/me/sessions');
        return res.data || res;
    },
};
