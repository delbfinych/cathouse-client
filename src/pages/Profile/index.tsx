import clsx from 'clsx';
import React from 'react';
import { Route, useHistory, useParams, useRouteMatch } from 'react-router';
import { getMediaUrl } from '../../api/media';
import { IUser, userApi } from '../../api/user';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { CreatePostForm } from '../../components/CreateForm/CreatePostForm';
import { Dialog } from '../../components/Dialog';
import { AlertDialog } from '../../components/Dialog/AlertDialog';
import { LeftPanel } from '../../components/LeftPanel';
import { Loader } from '../../components/Loader/Loader';
import { PostLoader } from '../../components/Loader/PostLoader';
import { MainBlock } from '../../components/MainBlock';
import { Post } from '../../components/Post';
import { PostModal } from '../../components/Post/PostModal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useThrottledLazyLoading } from '../../hooks/useThrottleLazyLoading';
import { followUser, unfollowUser } from '../../store/slices/people';
import {
    addPost,
    loadUserWall,
    userPostActions,
} from '../../store/slices/userPosts';
import { Right } from '../Index/Right';
import { DescriptionEditor } from './Editor';
import styles from './Profile.module.scss';

export const Profile: React.FC = () => {
    const params: { id: string } = useParams();
    const [user, setUser] = React.useState<IUser>({} as IUser);
    const loggedUser = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const { posts, loading, total_pages } = useAppSelector(
        (state) => state.posts
    );
    const [page, setPage] = React.useState(0);
    React.useEffect(() => {
        (async () => {
            dispatch(userPostActions.reset());
            if (page === 1) {
                dispatch(loadUserWall(parseInt(params.id), page));
            } else {
                setPage(1);
            }
            const res = (await userApi.getById(parseInt(params.id))).data;
            setUser(res);
            setFollowed(Boolean(res.followed_by_me));
            console.log(page);
        })();
    }, [params.id]);

    React.useEffect(() => {
        (async () => {
            if (page) {
                dispatch(loadUserWall(parseInt(params.id), page));
            }
        })();
    }, [page]);

    useThrottledLazyLoading(page, total_pages, setPage, 1000);

    const [isFollowed, setFollowed] = React.useState(
        Boolean(user.followed_by_me)
    );
    const toggleFollow = () => {
        if (isFollowed) {
            dispatch(unfollowUser(user));
        } else {
            dispatch(followUser(user));
        }
        setFollowed((t) => !t);
        if (isDialogOpen) {
            setOpen(false);
        }
    };
    const hist = useHistory();

    const gotoFolowers = () => {
        hist.push(`/user/${user.id}/people`);
    };

    const handleFollowClick = () => {
        if (!isFollowed) {
            toggleFollow();
        } else {
            setOpen(true);
        }
    };
    const [isDialogOpen, setOpen] = React.useState(false);
    const handleSubmit = async (text: string) => {
        dispatch(addPost(text));
    };
    const match = useRouteMatch();
    const history = useHistory();
    return (
        <div style={{ alignItems: 'flex-start' }} className="d-flex">
            <LeftPanel></LeftPanel>
            <div
                className={clsx('d-flex flex-column', styles.middle)}
                style={{ maxWidth: '35vw', minWidth: '35vw' }}
            >
                <MainBlock
                    className={styles.userInfo}
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundImage: `url(${getMediaUrl(
                                user.background_image_url
                            )})`,
                        }}
                        className={styles.bgFon}
                    ></div>
                    <Avatar
                        className={styles.avatar}
                        height="90px"
                        width="90px"
                        src={
                            user.avatar_url &&
                            getMediaUrl(user.avatar_url)
                        }
                        first_name={user.first_name}
                        last_name={user.last_name}
                    ></Avatar>
                    <div className={styles.infoBlock}>
                        <div className={styles.name}>
                            {user.first_name} {user.last_name}
                        </div>
                        <div className={styles.username}>{user.username}</div>
                        <div className={styles.subscribeBtn}>
                            <Button onClick={gotoFolowers} variant="blue">
                                падпещики
                            </Button>
                            {loggedUser?.id !== user.id && (
                                <Button
                                    onClick={handleFollowClick}
                                    variant={isFollowed ? 'white' : 'blue'}
                                >
                                    {isFollowed ? 'Отписаться' : 'Подписаться'}
                                </Button>
                            )}
                        </div>
                        {loggedUser?.id === user.id ? (
                            <DescriptionEditor />
                        ) : (
                            <div className={styles.description}>
                                {user?.description}
                            </div>
                        )}
                    </div>
                </MainBlock>
                {loggedUser?.id === user.id && (
                    <CreatePostForm onSubmit={handleSubmit} />
                )}
                {!posts.length && !loading && <div>Пока шо тут пусто...</div>}
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
            <AlertDialog
                isOpen={isDialogOpen && isFollowed}
                onCancel={() => setOpen(false)}
                onSubmit={toggleFollow}
                message={`Уверены, что хотите отписаться от ${user.first_name} ${user.last_name}?`}
            />
             <Route
                path={`${match.url}/post/:id`}
                render={(props) => {
                    console.log(props);
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
