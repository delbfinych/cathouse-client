import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { Post } from '..';
import { IPost, postApi } from '../../../api/post';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { commentActions, loadComments } from '../../../store/slices/comments';
import { selectPost } from '../../../store/slices/userPosts';
import { CommentItem, CommentList } from '../../CommentList';
import { CreateCommentForm } from '../../CreateForm/CreateCommentForm';
import { Loader } from '../../Loader/Loader';
import { PostLoader } from '../../Loader/PostLoader';
import { MainBlock } from '../../MainBlock';
import styles from './styles.module.scss';

interface IProps {
    id: number;
}
export const PostModal: React.FC<IProps> = ({ id }) => {
    const { comments, loading, total_pages } = useAppSelector(
        (state) => state.comments
    );
    const [post, setPost] = React.useState<IPost | null>(
        useSelector(selectPost(id))
    );

    const dispatch = useAppDispatch();
    const [page, setPage] = React.useState(1);
    React.useEffect(() => {
        (async () => {
            dispatch(commentActions.reset());
            if (!post) {
                const data = await postApi.getById(id);
                setPost(data.data);
            }
        })();
    }, []);
    React.useEffect(() => {
        (async () => {
            dispatch(loadComments(id, page));
        })();
    }, [page]);

    const loadMore = () => setPage((p) => p + 1);

    return (
        <MainBlock
            style={{
                alignItems: 'flex-start',
            }}
            className="d-flex"
        >
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
                <div className={styles.createCommentForm}>
                    <CreateCommentForm id={id} />
                </div>
            </div>
        </MainBlock>
    );
};
