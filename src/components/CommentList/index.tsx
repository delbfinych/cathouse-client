import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router';
import { IComment } from '../../api/comment';
import { IUser, userApi } from '../../api/user';
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
}) => {
    // const { user } = useAppSelector((state) => state.user);
    const [user, setUser] = React.useState<IUser | null>(null);
    React.useEffect(() => {
        (async () => {
            const data = await userApi.getById(author_id);
            setUser(data.data);
            console.log(user);
        })();
    }, []);
    const history = useHistory();
    const gotoProfile = () => history.push(`/user/${user?.id}`);
    return (
        <li className={clsx('d-flex', styles.commentItem)}>
            {/* {user?.role !== 'USER' && (
                <span className={styles.closeBtn}>x</span>
            )} */}
            {user && (
                <>
                    <Avatar
                        src={
                            user.avatar_url &&
                            'http://localhost:5000/media/' + user.avatar_url
                        }
                        className={styles.avatar}
                        height="40px"
                        width="40px"
                        first_name={user.first_name}
                        last_name={user.last_name}
                    />
                    <div>
                        <div onClick={gotoProfile} className={clsx(styles.name, "cup")}>
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
                                // onClick={markAsDisLiked}
                                active={false}
                                width="18px"
                                height="18px"
                            ></DislikeButton>
                            <div>{dislikes_count}</div>
                            <LikeButton
                                // onClick={markAsLiked}
                                active={true}
                                width="18px"
                                height="18px"
                            ></LikeButton>
                            <div>{likes_count}</div>
                        </div>
                        <div className={styles.date}>{createdAt}</div>
                    </div>
                </>
            )}
        </li>
    );
};
