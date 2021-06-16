import React from 'react';
import { Post } from '../../components/Post';
import { LeftPanel } from '../../components/LeftPanel';
import { Right } from './Right';
import { CreatePostForm } from '../../components/CreateForm/CreatePostForm';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
    addPost,
    loadFollowingWall,
    userPostActions,
} from '../../store/slices/userPosts';
import { useThrottledLazyLoading } from '../../hooks/useThrottleLazyLoading';
import styles from './Styles.module.scss';
import { Loader } from '../../components/Loader/Loader';
import { PostLoader } from '../../components/Loader/PostLoader';
import { Route, useHistory, useRouteMatch } from 'react-router';
import { Dialog } from '../../components/Dialog';
import { PostModal } from '../../components/Post/PostModal';

export const Index: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const { posts, total_pages, loading } = useAppSelector(
        (state) => state.posts
    );
    const [page, setPage] = React.useState(1);
    React.useEffect(() => {
        dispatch(userPostActions.reset());
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

    const match = useRouteMatch();
    const history = useHistory();
    useThrottledLazyLoading(page, total_pages, setPage, 1000);
    return (
        <div style={{ alignItems: 'flex-start' }} className="d-flex">
            <LeftPanel></LeftPanel>
            <div className={styles.middle}>
                <CreatePostForm onSubmit={handleSubmit} />
                {loading &&
                    !posts.length &&
                    Array(5)
                        .fill(0)
                        .map((el) => (
                            <PostLoader className={styles.postLoaderItem} />
                        ))}
                {posts &&
                    posts.map((post) => (
                        <Post key={post.post_id} {...post}></Post>
                    ))}
                {loading && page > 1 && (
                    <div className="d-flex jc-center">
                        <Loader color="blue" height="50px" width="50px" />
                    </div>
                )}
            </div>
            <Right />
            <Route
                path={`${match.url}post/:id`}
                render={(props) => {
                    //@ts-ignore
                    const id = parseInt(props.match.params.id);
                    return (
                        <Dialog
                            isOpen={true}
                            onClose={() => history.push(match.url)}
                        >
                            <PostModal id={id} />
                        </Dialog>
                    );
                }}
            />
        </div>
    );
};
