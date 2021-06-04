import { IPaginationResponse } from './user';
import { IComment } from './comment';
// import useAxios from 'axios-hooks';
import { http } from './http-client';

export interface IPost {
    post_id: number;
    author_id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    likes_count: number;
    dislikes_count: number;
    liked_by_me: number | null;
    comments_count: number;
}
const create = (data: { message: string }) => http.post<IPost>(`/post`, data);

const getById = (id: number) => http.get<IPost>(`/post/${id}`);

const like = (id: number) => http.post(`/post/${id}/like`);

const dislike = (id: number) => http.post(`/post/${id}/dislike`);

const deleteById = (id: number) => http.delete(`/post/${id}`);

const update = (id: number, data: { message: string }) =>
    http.post<IPost>(`/post/${id}`, data);

const getCommenets = (id: number, page: number) =>
    http.get<IPaginationResponse<IComment>>(`/post/${id}/comments?page=${page}`);

const addComment = (id: number, data: { message: string }) =>
    http.post<IComment>(`/post/${id}/comments`, data);

export const postApi = {
    getById,
    like,
    dislike,
    deleteById,
    update,
    getCommenets,
    addComment,
    create,
};
