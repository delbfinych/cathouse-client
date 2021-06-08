import React from 'react';
import { FormInput } from '../../FormInput';
import { Button } from '../../Button';
import { MainBlock } from '../../MainBlock';
import { StepInfo } from '../StepInfo';
import styles from './First.module.scss';
import { StepsContext } from '../../../pages/SignUp';
import { useForm } from 'react-hook-form';
import { authApi } from '../../../api/auth';

type Data = {
    username: string;
    password: string;
};

export const First: React.FC = () => {
    const { onNextStep, body } = React.useContext(StepsContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Data>({ mode: 'onChange' });

    const onSubmit = (data: Data) => {
        body.current.username = data.username;
        body.current.password = data.password;
        onNextStep();
    };

    return (
        <div>
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
                            validate: async (value) => {
                                try {
                                    await authApi.verifyUsername(value);
                                    return true;
                                } catch {
                                    return false;
                                }
                            },

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
                    {errors?.username?.type === 'validate' && (
                        <div className={styles.errorMsg}>
                            Это имя уже занято
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
                    <Button
                        type="submit"
                        className={styles.button}
                        variant="blue"
                    >
                        Дальше &#8594;
                    </Button>
                </form>
            </MainBlock>
        </div>
    );
};
