import clsx from 'clsx';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { IPost, postApi } from '../../api/post';
import { IUpdateUserData, IUser, userApi } from '../../api/user';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { CreatePostForm } from '../../components/CreateForm/CreatePostForm';
import { Dialog } from '../../components/Dialog';
import { AlertDialog } from '../../components/Dialog/AlertDialog';
import { LeftPanel } from '../../components/LeftPanel';
import { Loader } from '../../components/Loader/Loader';
import { MainBlock } from '../../components/MainBlock';
import { Post } from '../../components/Post';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useThrottledLazyLoading } from '../../hooks/useThrottleLazyLoading';
import { followUser, unfollowUser } from '../../store/slices/people';
import { update } from '../../store/slices/user';
import { addPost, loadUserWall, reset } from '../../store/slices/userPosts';
import { Right } from '../Index/Right';
import styles from './Profile.module.scss';

export const Profile: React.FC = () => {
    const params: { id: string } = useParams();
    const [user, setUser] = React.useState<IUser>({} as IUser);
    const loggedUser = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const { posts, loading, total_pages } = useAppSelector(
        (state) => state.posts
    );
    const [page, setPage] = React.useState(1);
    // const [isFetching, setFetching] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            dispatch(reset());
            const res = (await userApi.getById(parseInt(params.id))).data;
            setUser(res);
            setFollowed(Boolean(res.followed_by_me));
        })();
    }, [params.id]);

    React.useEffect(() => {
        (async () => {
            dispatch(loadUserWall(parseInt(params.id), page));
        })();
    }, [page, params.id]);

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
                            backgroundImage: `url(${process.env.REACT_APP_MEDIA_URL}/${user.background_image_url})`,
                        }}
                        className={styles.bgFon}
                    ></div>
                    <Avatar
                        className={styles.avatar}
                        height="90px"
                        width="90px"
                        src={
                            user.avatar_url &&
                            process.env.REACT_APP_MEDIA_URL + user.avatar_url
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
                {posts &&
                    posts.map((post) => (
                        <Post key={post.post_id} {...post}></Post>
                    ))}
                {loading && (
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
        </div>
    );
};

const DescriptionEditor: React.FC = () => {
    const { loading, user } = useAppSelector((state) => state.user);
    const [isOpen, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const Description: React.FC = () => {
        return (
            <div
                onClick={() => setOpen(true)}
                className={clsx(
                    styles.descripion,
                    !user?.description && styles.emptyDescription,
                    'cup'
                )}
            >
                {user?.description ?? 'Изменить описание...'}
            </div>
        );
    };
    const handleSumbit = (e: any) => {
        e.preventDefault();
        const text = inputRef.current?.innerText!;
        const params: IUpdateUserData = {
            avatar_url: user!.avatar_url,
            last_name: user!.last_name,
            first_name: user!.first_name,
            background_image_url: user!.background_image_url,
            username: user!.username,
        };
        if (text) {
            params.description = text;
        }
        if (user) {
            dispatch(update(user.id, params));
        }
        setOpen(false);
        inputRef.current!.innerText = '';
    };
    return (
        <div>
            <Description />
            <Dialog isOpen={isOpen} onClose={() => setOpen(false)}>
                <MainBlock
                    style={{
                        padding: '20px',
                        minWidth: '15vw',
                        maxWidth: '15vw',
                    }}
                >
                    <div
                        ref={inputRef}
                        data-placeholder={
                            user?.description ?? `Введите описание`
                        }
                        contentEditable="true"
                        role="textbox"
                        className={clsx(styles.postField)}
                    ></div>

                    <Button
                        onClick={handleSumbit}
                        className={styles.btn}
                        variant="blue"
                    >
                        {loading ? (
                            <Loader height="10px" width="30px" color="white" />
                        ) : (
                            'Сохранить'
                        )}
                    </Button>
                </MainBlock>
            </Dialog>
        </div>
    );
};
