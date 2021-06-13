import React from 'react';
import { Avatar } from '../../components/Avatar';
import { MainBlock } from '../../components/MainBlock';
import styles from './LeftPanel.module.scss';
import { NavLink, useHistory } from 'react-router-dom/';
import { Home } from './icons/Home';
import { People } from './icons/People';

import clsx from 'clsx';
import { NewsFeed } from './icons/NewsFeed';
import { Settings } from './icons/Settings';
import { useAppSelector } from '../../hooks';
import { getMediaUrl } from '../../api/media';

export const LeftPanel: React.FC = () => {
    return (
        <div
            style={{
                marginRight: '20px',
            }}
            className={styles.left}
        >
            <UserInfo />
            <Menu></Menu>
        </div>
    );
};

const UserInfo: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const history = useHistory();
    const gotoProfile = () =>
        user ? history.push(`/user/${user.id}`) : history.push('/signin');
    return (
        <div className={styles.userInfo} onClick={gotoProfile}>
            <MainBlock
                className="d-flex cup"
                style={{
                    padding: '20px',
                    flexWrap: 'wrap',
                    marginBottom: '40px',
                }}
            >
                {user && (
                    <>
                        <Avatar
                            src={
                                user.avatar_url && getMediaUrl(user.avatar_url)
                            }
                            className={styles.avatar}
                            height="40px"
                            width="40px"
                            first_name={user.first_name}
                            last_name={user.last_name}
                        />
                        <div>
                            <div className={styles.name}>
                                {user.first_name} {user.last_name}
                            </div>
                            <div className={styles.username}>
                                {user.username}
                            </div>
                        </div>
                    </>
                )}
            </MainBlock>
        </div>
    );
};

const Menu: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const MenuListItem: React.FC<{ to: string }> = ({ to, children }) => {
        return (
            <NavLink
                activeClassName={styles.active}
                to={to}
                exact
                className={clsx(
                    styles.listItem,

                    'd-flex'
                )}
            >
                {children}
            </NavLink>
        );
    };
    return (
        <MainBlock>
            <ul>
                <MenuListItem to={`/user/${user?.id}`}>
                    <Home /> <span>Home</span>
                </MenuListItem>
                <MenuListItem to={`/user/${user?.id}/people`}>
                    <People /> <span>People</span>
                </MenuListItem>
                <MenuListItem to="/">
                    <NewsFeed /> <span>News</span>
                </MenuListItem>
                <MenuListItem to="/settings/">
                    <Settings />
                    <span>Settings</span>
                </MenuListItem>
            </ul>
        </MainBlock>
    );
};
