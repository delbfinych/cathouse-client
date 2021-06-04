import React from 'react';
import { FormInput } from '../../FormInput';
import { Button } from '../../Button';
import { MainBlock } from '../../MainBlock';
import styles from './Second.module.scss';
import { StepInfo } from '../StepInfo';
import { StepsContext } from '../../../pages/SignUp';
import { useForm } from 'react-hook-form';

type FormData = {
    fullname: string;
};
export const Second: React.FC = () => {
    const { onNextStep, formData } = React.useContext(StepsContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = ({ fullname }: FormData) => {
        const [first_name, last_name] = fullname.split(' ');
        formData.current.append('first_name', first_name);
        formData.current.append('last_name', last_name);
        onNextStep();
    };
    return (
        <div>
            <StepInfo title="Как Вас зовут?" />
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
                        {...register('fullname', {
                            pattern: /^[A-Za-zА-Яа-я]+[\s][A-Za-zА-Яа-я]+$/,
                            required: true,
                        })}
                        type="text"
                        placeholder="Ivan Ivanov"
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
