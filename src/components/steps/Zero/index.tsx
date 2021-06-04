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
                <h3 className={styles.text}>Добро пожаловать в CatHouse!</h3>

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
