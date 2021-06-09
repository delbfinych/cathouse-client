import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { mediaApi } from '../../api/media';
import { IUpdateUserData, IUser, userApi } from '../../api/user';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { LeftPanel } from '../../components/LeftPanel';
import { Loader } from '../../components/Loader/Loader';
import { MainBlock } from '../../components/MainBlock';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { update, userActions } from '../../store/slices/user';
import styles from './styles.module.scss';
import { UploadImg } from './UploadImg';

export const Settings: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const loading = useAppSelector((state) => state.user.loading);
    type FormInputs = {
        first_name: string;
        last_name: string;
    };

    const {
        reset: resetForm,
        register,
        handleSubmit,
        formState,
        getValues,
        setValue,
        watch,
    } = useForm<FormInputs>({});

    React.useEffect(() => {
        (async () => {
            console.log('sadadsadsdsd');
            if (user) {
                resetForm({
                    first_name: user.first_name,
                    last_name: user.last_name,
                });
                const avUrl = user.avatar_url;
                setAvatarUrl(
                    avUrl && `${process.env.REACT_APP_MEDIA_URL}/${avUrl}`
                );
                const bgUrl = user.background_image_url;
                setBgUrl(
                    bgUrl && `${process.env.REACT_APP_MEDIA_URL}/${bgUrl}`
                );
            }
        })();
    }, [user]);

    const [load, setLoad] = React.useState(false);
    const onSubmit = async ({ first_name, last_name }: FormInputs) => {
        console.log(first_name, last_name);
        setLoad(true);
        const body: IUpdateUserData = {
            first_name,
            last_name,
            username: user!.username,
            description: user!.description,
            avatar_url: avatarUrl ? user!.avatar_url : undefined,
            background_image_url: bgUrl
                ? user?.background_image_url
                : undefined,
        };
        const avatar = avatarRef.current?.files?.[0];
        if (avatar) {
            const fd = new FormData();
            fd.append('image', avatar);
            const data = await mediaApi.upload(fd);
            body.avatar_url = data.data[0];
        }
        const bg = bgRef.current?.files?.[0];
        if (bg) {
            const fd = new FormData();
            fd.append('image', bg);
            const data = await mediaApi.upload(fd);
            body.background_image_url = data.data[0];
        }
        bgRef.current!.value = '';
        avatarRef.current!.value = '';
        dispatch(update(user!.id, body));
        setLoad(false);
    };
    const avatarRef = React.useRef<HTMLInputElement>(null);
    const bgRef = React.useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>('');
    const [bgUrl, setBgUrl] = React.useState<string | undefined>('');
    const handleFileChange = (event: any) => {
        const file = event?.target.files[0];
        console.log(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (event?.target.name === 'avatar') {
                setAvatarUrl(imageUrl);
            } else {
                setBgUrl(imageUrl);
            }
        }
    };
    const handleInputChange = (e: any) =>
        setValue(e.target.name, e.target.value);

    React.useEffect(() => {
        if (bgRef.current) {
            bgRef.current!.addEventListener('change', handleFileChange);
        }
        if (avatarRef.current) {
            avatarRef.current!.addEventListener('change', handleFileChange);
        }
        return () => {
            avatarRef.current?.removeEventListener('change', handleFileChange);
            bgRef.current?.removeEventListener('change', handleFileChange);
        };
    }, []);

    const handleReset = () => {
        setAvatarUrl(
            user!.avatar_url &&
                process.env.REACT_APP_MEDIA_URL + user!.avatar_url
        );
        setBgUrl(
            user!.background_image_url &&
                process.env.REACT_APP_MEDIA_URL + user!.background_image_url
        );
        console.log(user!);

        resetForm({
            first_name: user!.first_name,
            last_name: user!.last_name,
        });
    };
    const history = useHistory();
    const dispatch = useAppDispatch();
    const logout = () => {
        localStorage.removeItem('access_token');
        dispatch(userActions.reset());
        history.push('/signin');
    };
    const resetBg = (e: any) => {
        setBgUrl(undefined);
        //@ts-ignore
        bgRef.current.value = '';
        e.preventDefault();
    };
    const resetAvatar = (e: any) => {
        setAvatarUrl(undefined);
        //@ts-ignore
        avatarRef.current.value = '';
        e.preventDefault();
    };
    return (
        <div className="d-flex">
            <LeftPanel />
            <div className={styles.settings}>
                <MainBlock style={{ padding: '20px' }}>
                    <h3 className={styles.title}>Моя учётная запись</h3>
                    {user && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="d-flex">
                                <div className={styles.photoPickerDiv}>
                                    <label
                                        className="link cup"
                                        htmlFor="settingsAvatar"
                                    >
                                        <Avatar
                                            className={styles.avatar}
                                            height="120px"
                                            width="120px"
                                            src={avatarUrl}
                                            first_name={user.first_name}
                                            last_name={user.last_name}
                                        >
                                            <div className={styles.imageHover}>
                                                Загрузить аватар
                                                <span onClick={resetAvatar}>
                                                    Удалить
                                                </span>
                                            </div>
                                        </Avatar>
                                        <span
                                            className={styles.removeMobileBtn}
                                            onClick={resetAvatar}
                                        >
                                            Удалить
                                        </span>
                                        <div className={styles.uploadImg}>
                                            <UploadImg />
                                        </div>
                                    </label>
                                </div>
                                <input
                                    hidden
                                    name="avatar"
                                    ref={avatarRef}
                                    id="settingsAvatar"
                                    type="file"
                                />
                                <div
                                    className={clsx(
                                        styles.bgPicker,
                                        !bgUrl && styles.bgBorder
                                    )}
                                >
                                    <label
                                        className="link cup"
                                        htmlFor="settingsBG"
                                    >
                                        <div
                                            style={{
                                                backgroundImage: `url(${bgUrl})`,
                                            }}
                                        >
                                            {bgUrl && (
                                                <div
                                                    className={
                                                        styles.imageHover
                                                    }
                                                >
                                                    Изменить фоновое изображение
                                                    <span onClick={resetBg}>
                                                        Удалить текущее фото
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span
                                            className={clsx(
                                                'pos-abs',
                                                styles.removeMobileBtn
                                            )}
                                            onClick={resetBg}
                                        >
                                            Удалить
                                        </span>
                                        <div className={styles.uploadImg}>
                                            <UploadImg />
                                        </div>
                                    </label>
                                </div>
                                <input
                                    hidden
                                    name="bg"
                                    ref={bgRef}
                                    id="settingsBG"
                                    type="file"
                                />
                            </div>

                            <FormInput
                                name="first_name"
                                ref={register('first_name', {
                                    pattern: /^[A-Za-zА-Яа-я]+$/,
                                    required: true,
                                })}
                                onChange={handleInputChange}
                                type="text"
                                defaultValue={getValues().first_name}
                                placeholder="first name"
                                error={!!formState.errors?.first_name?.type}
                            ></FormInput>

                            <FormInput
                                name="last_name"
                                ref={register('last_name', {
                                    pattern: /^[A-Za-zА-Яа-я]+$/,
                                    required: true,
                                })}
                                defaultValue={getValues().last_name}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="last name"
                                error={!!formState.errors?.last_name?.type}
                            ></FormInput>

                            <Button
                                onClick={handleReset}
                                type="reset"
                                className={styles.button}
                                variant="white"
                            >
                                Сбросить
                            </Button>
                            <Button
                                disabled={formState.isDirty}
                                type="submit"
                                className={styles.button}
                                variant="blue"
                            >
                                {load || loading ? (
                                    <Loader
                                        height="10px"
                                        width="30px"
                                        color="white"
                                    />
                                ) : (
                                    `Сохранить`
                                )}
                            </Button>
                        </form>
                    )}
                </MainBlock>
                <div onClick={logout} className={styles.logout}>
                    Выйти из аккаунта
                </div>
            </div>
        </div>
    );
};
