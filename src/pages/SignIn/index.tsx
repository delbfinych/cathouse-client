import React from 'react';
import styles from './SignIn.module.scss';
import { useForm } from 'react-hook-form';
import { StepInfo } from '../../components/steps/StepInfo';
import { MainBlock } from '../../components/MainBlock';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import axios from 'axios';
import { Loader } from '../../components/Loader/Loader';
import { useHistory } from 'react-router';
import { authApi } from '../../api/auth';
import jwt_decode from 'jwt-decode';
import { useAppDispatch } from '../../hooks';
import { setUserData, verifyUser } from '../../store/slices/user';
import { UserData } from '../../store/slices/user';
import { NavLink } from 'react-router-dom';

type FormData = {
    username: string;
    password: string;
};

export const SignIn: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const history = useHistory();
    const [isLoading, setLoading] = React.useState(false);
    const [authError, setAuthError] = React.useState('');
    const dispatch = useAppDispatch();
    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const res = await authApi.signIn(data);
            localStorage.setItem('access_token', res.data.token);
            dispatch(verifyUser());
            history.push('/');
        } catch (error) {
            setAuthError(error.response.data.error.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '0 auto' }}>
            <StepInfo title="Введите имя пользователя и пароль!" />
            <MainBlock
                className="m-auto"
                style={{
                    background: 'white',

                    width: '350px',
                    padding: '40px 20px',
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        {...register('username', {
                            required: true,
                            pattern: /^[A-Za-z]+$/,
                        })}
                        type="text"
                        placeholder="username"
                        error={!!errors?.username?.type}
                    />
                    {errors?.username?.type === 'pattern' && (
                        <div className={styles.errorMsg}>
                            Имя пользователя должно состоять из латинских букв
                        </div>
                    )}
                    {errors?.username?.type === 'required' && (
                        <div className={styles.errorMsg}>
                            Введите имя пользователя
                        </div>
                    )}
                    <FormInput
                        {...register('password', { required: true })}
                        type="password"
                        placeholder="password"
                        error={errors?.password?.type === 'required'}
                    />
                    {errors?.password?.type === 'required' && (
                        <div className={styles.errorMsg}>Введите пароль</div>
                    )}
                    {authError && (
                        <div className={styles.errorMsg}>
                            Неверный юзернейм или пароль
                        </div>
                    )}
                    <div>
                        <NavLink style={{ position: 'absolute' }} to="/signup">
                            Зарегистрироваться
                        </NavLink>
                        <Button
                            type="submit"
                            className={styles.button}
                            variant="blue"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader
                                    height="10px"
                                    width="30px"
                                    color="white"
                                />
                            ) : (
                                `Next \u2192`
                            )}
                        </Button>
                    </div>
                </form>
            </MainBlock>
        </div>
    );
};
