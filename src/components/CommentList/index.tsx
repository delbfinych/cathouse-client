import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router';
import { commentApi, IComment } from '../../api/comment';
import { IUser, userApi } from '../../api/user';
import { useAppDispatch } from '../../hooks';
import { removeComment, updateComment } from '../../store/slices/comments';
import { Avatar } from '../Avatar';
import { DislikeButton } from '../Button/DislikeButton';
import { LikeButton } from '../Button/LikeButton';
import { MainBlock } from '../MainBlock';
import styles from './CommentList.module.scss';

export const CommentList: React.FC = ({ children }) => {
    return (
        <MainBlock style={{ padding: '20px' }}>
            <ul>{children}</ul>
        </MainBlock>
    );
};

export const CommentItem: React.FC<IComment> = ({
    author_id,
    body,
    comment_id,
    createdAt,
    dislikes_count,
    likes_count,
    post_id,
    liked_by_me,
}) => {
    const [user, setUser] = React.useState<IUser | null>(null);
    React.useEffect(() => {
        (async () => {
            const data = await userApi.getById(author_id);
            setUser(data.data);
            if (liked_by_me) {
                setlike(true);
            } else if (typeof liked_by_me != 'object') {
                setDislike(true);
            }
        })();
    }, []);

    const dispatch = useAppDispatch();

    const [islike, setlike] = React.useState(false);
    const [isDislike, setDislike] = React.useState(false);
    const markAsLiked = async () => {
        setlike((prev) => !prev);
        try {
            await commentApi.like(comment_id);
            dispatch(updateComment(comment_id));
            if (isDislike) {
                setDislike(false);
            }
        } catch (error) {
            setlike((prev) => !prev);
        }
    };
    const markAsDisLiked = async () => {
        setDislike((prev) => !prev);

        try {
            await commentApi.dislike(comment_id);
            dispatch(updateComment(comment_id));
            if (islike) {
                setlike(false);
            }
        } catch (error) {
            setDislike((prev) => !prev);
        }
    };
    const history = useHistory();
    const deleteComment = () => dispatch(removeComment(comment_id));
    const gotoProfile = () => history.push(`/user/${user?.id}`);
    return (
        <li className={clsx('d-flex', styles.commentItem)}>
            <span onClick={deleteComment} className={styles.closeBtn}>
                x
            </span>
            {user && (
                <>
                    <Avatar
                        src={
                            user.avatar_url &&
                            process.env.REACT_APP_MEDIA_URL + user.avatar_url
                        }
                        className={styles.avatar}
                        height="40px"
                        width="40px"
                        first_name={user.first_name}
                        last_name={user.last_name}
                    />
                    <div>
                        <div
                            onClick={gotoProfile}
                            className={clsx(styles.name, 'cup')}
                        >
                            {user.first_name} {user.last_name}
                        </div>
                        <div className={styles.body}>{body}</div>
                        <div
                            className={clsx(
                                styles.likesPanel,
                                (likes_count > 0 || dislikes_count > 0) &&
                                    styles.dontHide
                            )}
                        >
                            <DislikeButton
                                onClick={markAsDisLiked}
                                active={isDislike}
                                width="18px"
                                height="18px"
                            ></DislikeButton>
                            <div>{dislikes_count}</div>
                            <LikeButton
                                onClick={markAsLiked}
                                active={islike}
                                width="18px"
                                height="18px"
                            ></LikeButton>
                            <div>{likes_count}</div>
                        </div>
                        <div className={styles.date}>
                            {new Date(createdAt || ' ').toLocaleString()}
                        </div>
                    </div>
                </>
            )}
        </li>
    );
};
