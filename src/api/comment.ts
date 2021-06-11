import { http } from './http-client';

export interface IComment {
    comment_id: number;
    post_id: number;
    author_id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    likes_count: number;
    dislikes_count: number;
    liked_by_me: number | null;
    author_first_name: string;
    author_last_name: string;
    author_avatar_url: string;
    attachments: string[]
}
const getById = (id: number) => http.get<IComment>(`/comment/${id}`);

const like = (id: number) => http.post(`/comment/${id}/like`);

const dislike = (id: number) => http.post(`/comment/${id}/dislike`);

const deleteById = (id: number) => http.delete(`/comment/${id}`);

const update = (id: number, data: { message: string }) =>
    http.post<IComment>(`/comment/${id}`, data);

export const commentApi = { getById, like, dislike, deleteById, update };
