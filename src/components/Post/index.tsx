import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router';
import { IPost, postApi } from '../../api/post';
import { IUser, userApi } from '../../api/user';
import { useAppDispatch } from '../../hooks';
import { Avatar } from '../Avatar';
import { DislikeButton } from '../Button/DislikeButton';
import { LikeButton } from '../Button/LikeButton';
import { MainBlock } from '../MainBlock';
import { More } from '../More';
import { ChatButton } from './ChatButton/';
import styles from './Post.module.scss';
import { removePost, updatePost } from '../../store/slices/userPosts';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { AlertDialog } from '../Dialog/AlertDialog';
interface IProps {
    id: number;
}
export const Post: React.FC<IPost> = (post) => {
    const [user, setUser] = React.useState<IUser | null>(null);
    const [islike, setlike] = React.useState(false);
    const [isDislike, setDislike] = React.useState(false);

    const history = useHistory();
    React.useEffect(() => {
        (async () => {
            const u = await userApi.getById(post.author_id);
            setUser(u.data);
            if (post.liked_by_me) {
                setlike(true);
            } else if (typeof post.liked_by_me != 'object') {
                setDislike(true);
            }
        })();
    }, []);

    const markAsLiked = async () => {
        setlike((prev) => !prev);
        try {
            await postApi.like(post.post_id);
            dispatch(updatePost(post.post_id));
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
            await postApi.dislike(post.post_id);
            dispatch(updatePost(post.post_id));
            if (islike) {
                setlike(false);
            }
        } catch (error) {
            setDislike((prev) => !prev);
        }
    };

    const dispatch = useAppDispatch();

    const deletePost = () => {
        dispatch(removePost(post.post_id));
    };
    const gotoDiscussion = () => history.push(`/post/${post.post_id}`);
    const gotoProfile = () => history.push(`/user/${user?.id}`);
    const [isDialogOpen, setOpen] = React.useState(false);
    if (!post) {
        return <div>Пост не найден :(</div>;
    }

    return (
        <div>
            <MainBlock
                style={{
                    position: 'relative',
                    marginBottom: '20px',
                }}
            >
                {user && (
                    <div className={styles.post}>
                        <div className={styles.header}>
                            <Avatar
                                height="40px"
                                width="40px"
                                first_name={user.first_name}
                                last_name={user.last_name}
                                src={
                                    user.avatar_url &&
                                    process.env.REACT_APP_MEDIA_URL +
                                        user.avatar_url
                                }
                            ></Avatar>
                            <div
                                onClick={gotoProfile}
                                className={styles.userInfo}
                            >
                                <div className={styles.userName}>
                                    {user.first_name} {user.last_name}
                                </div>
                                <div className={styles.publishDate}>
                                    {new Date(
                                        post.createdAt || ' '
                                    ).toLocaleString()}
                                </div>
                            </div>
                            <More className={styles.options}>
                                <li onClick={() => setOpen(true)}>Удалить</li>
                            </More>
                        </div>
                        <div className={styles.body}>{post.body}</div>
                        <div className={styles.footer}>
                            <div className={styles.likes}>
                                <LikeButton
                                    onClick={markAsLiked}
                                    active={islike}
                                    width="22px"
                                    height="22px"
                                ></LikeButton>
                                <div>{post.likes_count}</div>
                                <DislikeButton
                                    onClick={markAsDisLiked}
                                    active={isDislike}
                                    width="22px"
                                    height="22px"
                                ></DislikeButton>
                                <div>{post.dislikes_count}</div>
                                <ChatButton
                                    onClick={gotoDiscussion}
                                    width="22px"
                                    height="22px"
                                ></ChatButton>
                                <div>{post.comments_count}</div>
                            </div>
                        </div>
                    </div>
                )}
            </MainBlock>
            <AlertDialog
                isOpen={isDialogOpen}
                onCancel={() => setOpen(false)}
                onSubmit={deletePost}
                message="Уверены, что хотите удалить пост?"
            />
        </div>
    );
};
