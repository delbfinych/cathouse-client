import React from 'react';
import { Post } from '../../components/Post';
import { LeftPanel } from '../../components/LeftPanel';
import { Right } from './Right';
import { CreatePostForm } from '../../components/CreatePostForm';
import { IPost } from '../../api/post';
import { userApi } from '../../api/user';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loadFollowingWall, reset } from '../../store/slices/userPosts';

export const Index: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const {posts} = useAppSelector((state) => state.posts);
    React.useEffect(() => {
        (async () => {
            dispatch(reset());
            if (user) {
                dispatch(loadFollowingWall(user.id, 1));
            }
        })();
    }, [user]);
    return (
        <div style={{ alignItems: 'flex-start' }} className="d-flex">
            <LeftPanel></LeftPanel>
            <div
                className="d-flex flex-column"
                style={{ maxWidth: '35vw', minWidth: '35vw' }}
            >
                <CreatePostForm />
                {posts.map((post) => (
                    <Post key={post.post_id} {...post}></Post>
                ))}
            </div>
            <Right />
        </div>
    );
};
