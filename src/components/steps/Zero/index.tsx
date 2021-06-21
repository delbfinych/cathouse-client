import React from 'react';
import { StepsContext } from '../../../pages/SignUp';
import { Button } from '../../Button';
import { MainBlock } from '../../MainBlock';
import styles from './Zero.module.scss';

export const Zero: React.FC = () => {
    const { onNextStep } = React.useContext(StepsContext);

    const handleClick = () => {
        onNextStep();
    };
    return (
        <div>
            <MainBlock
                className="m-auto"
                style={{
                    background: 'white',

                    width: '350px',
                    padding: '40px 20px',
                }}
            >
                <div>
                    <h3 className={styles.text}>
                        Добро пожаловать в CatHouse!
                    </h3>
                    <h4 style={{ textAlign: 'center' }}>Тут можно:</h4>
                    <ul style={{ textAlign: 'center' }}>
                        <li>Создавать посты</li>
                        <li>Публиковать фото</li>
                        <li>Писать комменты</li>
                        <li>Лайкать посты и комменты </li>
                        <li>
                            Подписываться на котиков и следить за их новостями
                        </li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    onClick={handleClick}
                    className={styles.button}
                    variant="blue"
                >
                    Начать регистрацию &#8594;
                </Button>
            </MainBlock>
        </div>
    );
};
