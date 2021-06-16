import clsx from 'clsx';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { IUserWithFollowInfo, userApi } from '../../api/user';
import { LeftPanel } from '../../components/LeftPanel';
import { MainBlock } from '../../components/MainBlock';
import { Tab, Tabs } from '../../components/Tabs';
import { UserList, UserListItem } from '../../components/UserList';
import { useAppSelector } from '../../hooks';

import styles from './People.module.scss';

export const People: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const [following, setFollowing] = React.useState([] as IUserWithFollowInfo[]);
    const [followers, setFollowers] = React.useState([] as IUserWithFollowInfo[]);
    const location = useLocation<{ idx?: number }>();
    const params: { id: string } = useParams();
    React.useEffect(() => {
        (async () => {
            const flwng = await userApi.getFollowing(parseInt(params.id), 1);
            const flwrs = await userApi.getFollowers(parseInt(params.id), 1);
            setFollowing(flwng.data.result);
            setFollowers(flwrs.data.result);
        })();
    }, [user]);

    return (
        <div
            style={{ alignItems: 'flex-start' }}
            className={clsx('d-flex', styles.main)}
        >
            <LeftPanel />
            <MainBlock style={{ padding: '20px', minWidth: '40vw' }}>
                <Tabs
                    initialActiveIdx={location?.state?.idx ?? 0}
                    activeClassName={styles.active}
                    className={styles.tabs}
                >
                    <Tab className={styles.tab} title="Подписчики">
                        {followers.length > 0 ? (
                            <List content={followers} />
                        ) : (
                            'Пока что тут пусто...'
                        )}
                    </Tab>
                    <Tab className={styles.tab} title="Подписки">
                        {following.length > 0 ? (
                            <List content={following} />
                        ) : (
                            'Пока что тут пусто...'
                        )}
                    </Tab>
                </Tabs>
            </MainBlock>
        </div>
    );
};

const List: React.FC<{
    onClick?: () => void;
    content: IUserWithFollowInfo[];
}> = ({ content }) => {
    return (
        <UserList>
            {content.map((user) => (
                <UserListItem {...user}></UserListItem>
            ))}
        </UserList>
    );
};
