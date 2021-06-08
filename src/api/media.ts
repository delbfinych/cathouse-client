import { http } from './http-client';

const upload = (form: FormData) =>
    http.post<string[]>(`media/`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const mediaApi = {
    upload,
};
