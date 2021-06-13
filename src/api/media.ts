import { http } from './http-client';

const upload = (form: FormData) =>
    http.post<string[]>(`media/`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

const remove = (body: string[]) => http.delete(`media/`, { data: body });

interface IAttachment {
    body: string[];
    comment_id?: number;
    post_id?: number;
}
const attach = (body: IAttachment) => http.post(`media/attach`, body);
export const mediaApi = {
    upload,
    remove,
    attach,
};

export const getMediaUrl = (path: string | undefined) =>
    process.env.REACT_APP_MEDIA_URL! + path;
    export const getCompressedMediaUrl = (path: string | undefined) =>
    process.env.REACT_APP_MEDIA_URL! + "c_" + path;
