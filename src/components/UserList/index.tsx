import React from 'react';
import styles from './UserList.module.scss';

import { Avatar } from '../Avatar';
import { MainBlock } from '../MainBlock';
import clsx from 'clsx';
import { More } from '../More';
import { IUser, IUserWithFollowInfo, userApi } from '../../api/user';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../hooks';
import { AlertDialog } from '../Dialog/AlertDialog';
import { getMediaUrl } from '../../api/media';

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

export const UserListItem: React.FC<IUserWithFollowInfo> = ({
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
            if (isDialogOpen) {
                setOpen(false);
            }
        } catch (error) {}
    };
    const handleFollowClick = () => {
        if (!isFollowed) {
            toggleFollow();
        } else {
            setOpen(true);
        }
    };
    const gotoProfile = () => history.push(`/user/${id}`);

    const [isDialogOpen, setOpen] = React.useState(false);
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
                        getMediaUrl(avatar_url)
                    }
                />
                <div className={styles.userName}>
                    {first_name} {last_name}
                </div>
            </li>
            {loggedUser?.id !== id && (
                <More className={styles.options}>
                    <div onClick={handleFollowClick}>
                        {isFollowed ? 'Отписаться' : 'Подписаться'}
                    </div>
                </More>
            )}
            <AlertDialog
                isOpen={isDialogOpen && isFollowed}
                onCancel={() => setOpen(false)}
                onSubmit={toggleFollow}
                message={`Уверены, что хотите отписаться от ${first_name} ${last_name}?`}
            />
        </div>
    );
};
