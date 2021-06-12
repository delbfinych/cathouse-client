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
import { AlertDialog } from '../Dialog/AlertDialog';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export const Post: React.FC<IPost> = ({
    author_avatar_url,
    author_first_name,
    author_id,
    author_last_name,
    body,
    comments_count,
    createdAt,
    dislikes_count,
    liked_by_me,
    likes_count,
    attachments,
    post_id,
}) => {
    const [islike, setlike] = React.useState(false);
    const [isDislike, setDislike] = React.useState(false);

    const history = useHistory();
    React.useEffect(() => {
        (async () => {
            if (liked_by_me) {
                setlike(true);
            } else if (typeof liked_by_me != 'object') {
                setDislike(true);
            }
        })();
    }, []);

    const markAsLiked = async () => {
        setlike((prev) => !prev);
        try {
            await postApi.like(post_id);
            dispatch(updatePost(post_id));
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
            await postApi.dislike(post_id);
            dispatch(updatePost(post_id));
            if (islike) {
                setlike(false);
            }
        } catch (error) {
            setDislike((prev) => !prev);
        }
    };

    const dispatch = useAppDispatch();

    const deletePost = () => {
        dispatch(removePost(post_id));
    };
    const gotoDiscussion = () => history.push(`/post/${post_id}`);
    const gotoProfile = () => history.push(`/user/${author_id}`);
    const [isDialogOpen, setOpen] = React.useState(false);
    const [sliderIdx, setSliderIdx] = React.useState(1);

    const settings = {
        infinite: false,
        dots: true,
        //@ts-ignore
        beforeChange: (current, next) => setSliderIdx(next + 1),
        adaptiveHeight: true,
        arrows: false,
        speed: 500,
    };
    return (
        <div>
            <MainBlock
                style={{
                    position: 'relative',
                    marginBottom: '20px',
                }}
            >
                <div className={styles.post}>
                    <div className={styles.header}>
                        <Avatar
                            className={styles.avatar}
                            height="40px"
                            width="40px"
                            first_name={author_first_name}
                            last_name={author_last_name}
                            src={
                                author_avatar_url &&
                                process.env.REACT_APP_MEDIA_URL +
                                    author_avatar_url
                            }
                        ></Avatar>
                        <div onClick={gotoProfile} className={styles.userInfo}>
                            <div className={styles.userName}>
                                {author_first_name} {author_last_name}
                            </div>
                            <div className={styles.publishDate}>
                                {new Date(createdAt || ' ').toLocaleString()}
                            </div>
                        </div>
                        <More className={styles.options}>
                            <li onClick={() => setOpen(true)}>Удалить</li>
                        </More>
                    </div>
                    <div className={styles.body}>{body}</div>
                    <div className={styles.attachments}>
                        <Slider {...settings}>
                            {attachments.map((url) => (
                                <div>
                                    <img src={process.env.REACT_APP_MEDIA_URL + url} alt="" />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.likes}>
                            <LikeButton
                                onClick={markAsLiked}
                                active={islike}
                                width="22px"
                                height="22px"
                            ></LikeButton>
                            <div>{likes_count}</div>
                            <DislikeButton
                                onClick={markAsDisLiked}
                                active={isDislike}
                                width="22px"
                                height="22px"
                            ></DislikeButton>
                            <div>{dislikes_count}</div>
                            <ChatButton
                                onClick={gotoDiscussion}
                                width="22px"
                                height="22px"
                            ></ChatButton>
                            <div>{comments_count}</div>
                        </div>
                    </div>
                </div>
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
