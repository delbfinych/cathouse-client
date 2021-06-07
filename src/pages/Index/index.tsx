import React from 'react';
import { Post } from '../../components/Post';
import { LeftPanel } from '../../components/LeftPanel';
import { Right } from './Right';
import { CreatePostForm } from '../../components/CreateForm/CreatePostForm';
import { IPost } from '../../api/post';
import { userApi } from '../../api/user';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
    addPost,
    loadFollowingWall,
    reset,
} from '../../store/slices/userPosts';
import { useThrottledLazyLoading } from '../../hooks/useThrottleLazyLoading';
import clsx from 'clsx';
import styles from './Styles.module.scss';
import { Loader } from '../../components/Loader/Loader';
import { useHistory } from 'react-router';

export const Index: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const { posts, total_pages, loading } = useAppSelector(
        (state) => state.posts
    );
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

    const handleSubmit = async (text: string) => {
        dispatch(addPost(text));
    };
    
    useThrottledLazyLoading(page, total_pages, setPage, 1000);
    return (
        <div style={{ alignItems: 'flex-start' }} className="d-flex">
            <LeftPanel></LeftPanel>
            <div className={styles.middle}>
                <CreatePostForm onSubmit={handleSubmit} />
                {posts.map((post) => (
                    <Post key={post.post_id} {...post}></Post>
                ))}
                {loading && (
                    <div className="d-flex jc-center">
                        <Loader color="blue" height="50px" width="50px" />
                    </div>
                )}
            </div>
            <Right />
        </div>
    );
};
