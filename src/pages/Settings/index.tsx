import React from 'react';
import { useForm } from 'react-hook-form';
import { IUser, userApi } from '../../api/user';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { MainBlock } from '../../components/MainBlock';
import { useAppSelector } from '../../hooks';
import styles from './styles.module.scss';

export const Settings: React.FC = () => {
    // const id = useAppSelector((state) => state.user.user?.id);
    // const [user, setUser] = React.useState<IUser | null>(null);
    // React.useEffect(() => {
    //     (async () => {
    //         if (id) {
    //             const data = await userApi.getById(id);
    //             setUser(data.data);
    //             // setAvatarUrl(data.data.avatar_url);
    //         }
    //     })();
    // }, [id]);

    // const {
    //     reset,
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm();

    // const onSubmit = async (form: any) => {
    //     const formData = new FormData();
    //     formData.append('first_name', form.first_name);
    //     formData.append('last_name', form.last_name);
    //     formData.append('avatar_url', avatarUrl);
    //     const bgURL = process.env.REACT_APP_MEDIA_URL + user!.background_image_url;
    //     const data = await (await fetch(bgURL)).blob;
    //     //@ts-ignore
    //     const f = new File([data], user!.background_image_url);
    //     console.log(f);
    //     // formData.append('background_image_url', );
    //     await userApi.update(id!, form);
    // };
    // const inputRef = React.useRef<HTMLInputElement>(null);
    // const [avatarUrl, setAvatarUrl] = React.useState('');
    // const handleInputChange = (event: any) => {
    //     const file = event?.target.files[0];
    //     console.log(12112);
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         setAvatarUrl(imageUrl);
    //     }
    // };
    // React.useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.addEventListener('change', handleInputChange);
    //     }
    //     return () =>
    //         inputRef.current?.removeEventListener('change', handleInputChange);
    // }, []);

    // const handleReset = () => {
    //     // setAvatarUrl(user!.avatar_url);
    //     reset();
    // };
    return (
        <MainBlock>
            {/* {user && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.photoPickerDiv}>
                        <label className="link cup" htmlFor="settingsImage">
                            <Avatar
                                className={styles.avatar}
                                height="120px"
                                width="120px"
                                src={avatarUrl}
                                first_name={user.first_name}
                                last_name={user.last_name}
                            ></Avatar>
                            Изменить аватарку
                        </label>
                    </div>
                    <input
                        ref={inputRef}
                        id="settingsImage"
                        type="file"
                        hidden
                    />

                    <FormInput
                        {...register('first_name', {
                            pattern: /^[A-Za-zА-Яа-я]+$/,
                            required: true,
                        })}
                        type="text"
                        placeholder={user.first_name}
                        error={!!errors?.fullname?.type}
                    ></FormInput>
                    {errors?.fullname?.type === 'required' && (
                        <div className={styles.errorMsg}>
                            Введите имя и фамилию
                        </div>
                    )}
                    {errors?.fullname?.type === 'pattern' && (
                        <div className={styles.errorMsg}>
                            Неверный формат. Пример: Имя Фамилия
                        </div>
                    )}
                    <FormInput
                        {...register('last_name', {
                            pattern: /^[A-Za-zА-Яа-я]+$/,
                            required: true,
                        })}
                        type="text"
                        placeholder={user.last_name}
                        error={!!errors?.fullname?.type}
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
                        type="submit"
                        className={styles.button}
                        variant="blue"
                    >
                        Сохранить
                    </Button>
                </form>
            )} */}
        </MainBlock>
    );
};
