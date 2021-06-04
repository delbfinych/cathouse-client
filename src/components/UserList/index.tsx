import React from 'react';
import styles from './UserList.module.scss';

import { Avatar } from '../Avatar';
import { MainBlock } from '../MainBlock';
import clsx from 'clsx';
import { More } from '../More';
import { IUser, TSimpleUser, userApi } from '../../api/user';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';

export const UserList: React.FC = ({ children }) => {
    return (
        <MainBlock
            style={{
                padding: '20px',
                flexWrap: 'wrap',
                minWidth: '20vw',
                marginLeft: '20px',
            }}
        >
            <ul>{children}</ul>
        </MainBlock>
    );
};

export const UserListItem: React.FC<TSimpleUser> = ({
    avatar_url,
    id,
    first_name,
    last_name,
    username,
    followed_by_me,
}) => {
    const loggedUser = useAppSelector((state) => state.user.user);
    const history = useHistory();
    const [isFollowed, setFollowed] = React.useState(Boolean(followed_by_me));
    const toggleFollow = async () => {
        try {
            if (isFollowed) {
                await userApi.unfollow(id);
            } else {
                await userApi.follow(id);
            }
            setFollowed((t) => !t);
        } catch (error) {}
    };
    const gotoProfile = () => history.push(`/user/${id}`);
    return (
        <div style={{ position: 'relative' }}>
            <li
                onClick={gotoProfile}
                className={clsx('d-flex ai-center', styles.li)}
            >
                <Avatar
                    className={styles.avatar}
                    first_name={first_name}
                    last_name={last_name}
                    height="40px"
                    width="40px"
                    src={
                        avatar_url &&
                        'http://localhost:5000/media/' + avatar_url
                    }
                />
                <div className={styles.userName}>
                    {first_name} {last_name}
                </div>
            </li>
            {loggedUser?.id !== id && (
                <More className={styles.options}>
                    <div onClick={toggleFollow}>{isFollowed ? 'Отписаться' : 'Подписаться'}</div>
                </More>
            )}
        </div>
    );
};
