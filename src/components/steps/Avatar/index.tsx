import React from 'react';
import { StepsContext } from '../../../pages/SignUp';
import { Avatar } from '../../Avatar';
import { Button } from '../../Button';
import { Loader } from '../../Loader/Loader';
import { MainBlock } from '../../MainBlock';
import { StepInfo } from '../StepInfo';
import styles from './Avatar.module.scss';

export const AvatarStep: React.FC = () => {
    const { formData, completeSteps, onNextStep } =
        React.useContext(StepsContext);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = React.useState('');

    const first_name: string = formData.current.get('first_name') as string;
    const last_name: string = formData.current.get('last_name') as string;

    const handleInputChange = (event: any) => {
        const file = event?.target.files[0];
        if (file) {
            formData.current.append('avatar_url', file);
            const imageUrl = URL.createObjectURL(file);
            setAvatarUrl(imageUrl);
        }
    };
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('change', handleInputChange);
        }
    }, []);

    const [isLoading, setLoading] = React.useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await completeSteps();
            localStorage.setItem('access_token', res.data.token);
            onNextStep();
        } catch (e) {
            alert(e.message);
            setLoading(false);
        }
    };
    return (
        <div>
            <StepInfo
                title={`Отлично, ${first_name} ${last_name}!`}
                description="Осталось загрузить аватарку"
            />
            <MainBlock
                className="d-flex flex-column ai-center"
                style={{
                    background: 'white',
                    width: '350px',
                    padding: '40px 20px',
                }}
            >
                <div className={styles.photoPickerDiv}>
                    <label className="link cup" htmlFor="image">
                        <Avatar
                            className={styles.avatar}
                            height="120px"
                            width="120px"
                            src={avatarUrl}
                            first_name={first_name}
                            last_name={last_name}
                        ></Avatar>
                        Выберите фото
                    </label>
                </div>
                <input ref={inputRef} id="image" type="file" hidden />
                <Button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={styles.button}
                    variant={isLoading ? 'blue' : 'blue'}
                >
                    {isLoading ? (
                        <Loader height="10px" width="30px" color="white" />
                    ) : (
                        `Завершить регистрацию \u2192`
                    )}
                </Button>
            </MainBlock>
        </div>
    );
};
