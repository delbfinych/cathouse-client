import React from 'react';
import { useHistory } from 'react-router';
import { IUserWithFollowInfo } from '../../api/user';
import { UserList, UserListItem } from '../../components/UserList';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getFollowers, getFollowing } from '../../store/slices/people';
import styles from './Styles.module.scss';

export const Right: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const { followers, following } = useAppSelector((state) => state.people);
    React.useEffect(() => {
        (async () => {
            if (user) {
                dispatch(getFollowers(user!.id, 1));
                dispatch(getFollowing(user!.id, 1));
            }
        })();
    }, [user]);

    const history = useHistory();
    const gotoFollowing = () => {
        history.push(`/user/${user!.id}/people`, { idx: 1 });
    };
    const gotoFollowers = () => {
        history.push(`/user/${user!.id}/people`, { idx: 0 });
    };
    return (
        <div className={styles.right}>
            {following.data.length > 0 && (
                <List
                    content={following.data}
                    length={following.total_count}
                    onClick={gotoFollowing}
                    title="ВЫ ПОДПИСАНЫ"
                />
            )}
            {followers.data.length > 0 && (
                <List
                    length={followers.total_count}
                    content={followers.data}
                    onClick={gotoFollowers}
                    title="ПОДПИСЧИКИ"
                />
            )}
        </div>
    );
};

const MAX_LIST_SIZE = 4;

const List: React.FC<{
    onClick: () => void;
    title: string;
    content: IUserWithFollowInfo[];
    length: number;
}> = ({ content, onClick, title, length }) => (
    <>
        <div className={styles.block}>
            <span className={styles.listTitle}>{title}</span>
            <span onClick={onClick} className={styles.usersCount}>
                {length}
            </span>

            <UserList>
                {content.slice(0, MAX_LIST_SIZE).map((user) => (
                    <UserListItem key={user.id} {...user}></UserListItem>
                ))}
                {content.length > MAX_LIST_SIZE && (
                    <div onClick={onClick} className={styles.showAll}>
                        показать всех
                    </div>
                )}
            </UserList>
        </div>
    </>
);
