import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router';
import { IPost, postApi } from '../../api/post';
import { CommentItem, CommentList } from '../../components/CommentList';
import { CreateCommentForm } from '../../components/CreateForm/CreateCommentForm';
import { LeftPanel } from '../../components/LeftPanel';
import { Loader } from '../../components/Loader/Loader';
import { PostLoader } from '../../components/Loader/PostLoader';
import { Post } from '../../components/Post';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loadComments, commentActions } from '../../store/slices/comments';
import styles from './styles.module.scss';

export const PostPage: React.FC = () => {
    const { id }: { id: string } = useParams();
    const [post, setPost] = React.useState<IPost | null>();

    const { comments, loading, total_pages } = useAppSelector(
        (state) => state.comments
    );

    const dispatch = useAppDispatch();
    const [page, setPage] = React.useState(1);
    React.useEffect(() => {
        (async () => {
            dispatch(commentActions.reset());
            setPost((await postApi.getById(parseInt(id))).data);
        })();
    }, []);
    React.useEffect(() => {
        (async () => {
            dispatch(loadComments(parseInt(id), page));
        })();
    }, [page]);

    const loadMore = () => setPage((p) => p + 1);

    return (
        <div
            style={{
                alignItems: 'flex-start',
            }}
            className="d-flex"
        >
            <LeftPanel></LeftPanel>
            <div className={clsx('d-flex flex-column', styles.body)}>
                {post ? <Post {...post} /> : <PostLoader />}
                {comments.length > 0 && (
                    <CommentList>
                        {comments.map((comment, idx) => (
                            <CommentItem
                                key={comment.comment_id}
                                {...comment}
                            />
                        ))}
                    </CommentList>
                )}
                {loading && (
                    <div className="d-flex jc-center">
                        <Loader color="blue" height="50px" width="50px" />
                    </div>
                )}
                {!loading && page < total_pages && (
                    <div
                        className="d-flex jc-center cup link"
                        onClick={loadMore}
                    >
                        Показать ещё
                    </div>
                )}
                <div style={{ marginTop: '20px' }}>
                    <CreateCommentForm id={parseInt(id)} />
                </div>
            </div>
        </div>
    );
};
