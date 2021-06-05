import React from 'react';
import { Post } from '../../components/Post';
import { LeftPanel } from '../../components/LeftPanel';
import { Right } from './Right';
import { CreatePostForm } from '../../components/CreatePostForm';
import { IPost } from '../../api/post';
import { userApi } from '../../api/user';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loadFollowingWall, reset } from '../../store/slices/userPosts';
import { useThrottledLazyLoading } from '../../hooks/useThrottleLazyLoading';

export const Index: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const { posts, total_pages } = useAppSelector((state) => state.posts);
    const [page, setPage] = React.useState(1);
    React.useEffect(() => {
        dispatch(reset());
    }, [user]);
    React.useEffect(() => {
        (async () => {
            if (user) {
                dispatch(loadFollowingWall(user.id, page));
            }
        })();
    }, [user, page]);

    useThrottledLazyLoading(page, total_pages, setPage, 1000);
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
