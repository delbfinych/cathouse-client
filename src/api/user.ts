import { IPost } from './post';
import { http } from './http-client';
export enum Roles {
    USER = 1,
    ADMIN = 3,
    MODERATOR = 2,
}

export interface IUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    createdAt: string;
    followers_count: number;
    following_count: number;
    background_image_url?: string;
    followed_by_me: number | null;
    description?: string;
    role: Roles;
}
const getById = (id: number) => http.get<IUser>(`/user/${id}`);

export type IUserCard = Pick<
    IUser,
    'id' | 'avatar_url' | 'username' | 'first_name' | 'last_name'
>;

export type IUserWithFollowInfo = IUserCard & { followed_by_me: number | null };

const getFollowing = (id: number, page: number) =>
    http.get<IPaginationResponse<IUserWithFollowInfo>>(
        `user/${id}/following?page=${page}`
    );

const getFollowers = (id: number, page: number) =>
    http.get<IPaginationResponse<IUserWithFollowInfo>>(
        `user/${id}/followers?page=${page}`
    );

const follow = (id: number) => http.post(`user/${id}/follow`);

const unfollow = (id: number) => http.post(`user/${id}/unfollow`);

const search = (query: string, page: number) =>
    http.get<IPaginationResponse<IUserWithFollowInfo>>(
        `user/search?query=${query}&page=${page}`
    );
export interface IPaginationResponse<T> {
    page: number;
    result: T[];
    total_pages: number;
    total_count: number;
}
const getFolliwingPosts = (id: number, page: number) =>
    http.get<IPaginationResponse<IPost>>(
        `user/${id}/posts/following?page=${page}`
    );

const getPosts = (id: number, page: number) =>
    http.get<IPaginationResponse<IPost>>(`user/${id}/posts?page=${page}`);

export type IUpdateUserData = Pick<
    IUser,
    | 'avatar_url'
    | 'background_image_url'
    | 'first_name'
    | 'last_name'
    | 'description'
    | 'username'
>;
const update = (id: number, data: IUpdateUserData) =>
    http.post<IUpdateUserData>(`user/${id}`, { ...data });

export const userApi = {
    getById,
    getFollowing,
    getFollowers,
    follow,
    unfollow,
    getFolliwingPosts,
    getPosts,
    search,
    update,
};
