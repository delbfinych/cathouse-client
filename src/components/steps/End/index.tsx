import React from 'react';
import { Button } from '../../Button';
import { MainBlock } from '../../MainBlock';
import styles from '../Zero/Zero.module.scss';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

export const End: React.FC = () => {
    const history = useHistory();
    const handleClick = () => {
        history.push('/');
    };
    return (
        <div>
            <MainBlock
                className="m-auto"
                style={{
                    background: 'white',

                    width: '400px',
                    padding: '40px 20px',
                }}
            >
                <h3 className={clsx(styles.text, 'd-flex ai-center')}>
                    <img
                        style={{
                            height: '32px',
                            width: '32px',
                            marginRight: '3px',
                        }}
                        src={`${process.env.REACT_APP_MEDIA_URL}/celebration.png`}
                        alt=""
                    />{' '}
                    Вы успешно зарегистрировались!
                </h3>

                <Button
                    type="submit"
                    onClick={handleClick}
                    className={styles.button}
                    variant="blue"
                >
                    Начать пользоваться &#8594;
                </Button>
            </MainBlock>
        </div>
    );
};
