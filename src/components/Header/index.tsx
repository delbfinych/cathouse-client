import React from 'react';
import { useHistory } from 'react-router';
import { getMediaUrl } from '../../api/media';
import { postApi } from '../../api/post';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { userActions } from '../../store/slices/user';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Container } from '../Container';
import { CreatePostForm } from '../CreateForm/CreatePostForm';
import { Dialog } from '../Dialog';
import { MainBlock } from '../MainBlock';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const history = useHistory();

    const handleSubmit = async (text: string) => {
        try {
            await postApi.create({ message: text });
            setOpen(false);
        } catch (error) {
            alert(error.message);
        }
    };
    const [isOpen, setOpen] = React.useState(false);

    const dispatch = useAppDispatch();
    const logout = () => {
        localStorage.removeItem('access_token');
        dispatch(userActions.reset());
        history.push('/signin');
    };
    return (
        <div  className={styles.header}>
            <div className={styles.container}>
                <h3 className="cup" onClick={() => history.push('/')}>
                    CatHouse
                </h3>
                {user && (
                    <div>
                        <Button
                            onClick={() => setOpen(true)}
                            className={styles.btn}
                            variant="blue"
                        >
                            Создать
                        </Button>
                        <div
                            className="cup"
                            onClick={() => history.push('/user/' + user.id)}
                        >
                            <Avatar
                                height="40px"
                                width="40px"
                                first_name={user.first_name}
                                last_name={user.last_name}
                                src={
                                    user.avatar_url &&
                                    getMediaUrl(user.avatar_url)
                                        
                                }
                            />
                        </div>
                        <Button
                            onClick={logout}
                            style={{ marginLeft: '10px' }}
                            variant="blue"
                        >
                            Выйти
                        </Button>
                    </div>
                )}
            </div>
            <Dialog
                isOpen={isOpen}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <MainBlock style={{ padding: '20px', width: '35vw' }}>
                    <CreatePostForm onSubmit={handleSubmit} />
                </MainBlock>
            </Dialog>
        </div>
    );
};
