import React from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

export const PrivateRoute: React.FC<RouteProps> = (props) => {
    const isAuth = useAppSelector((state) => state.user.isAuth);
    const history = useHistory();
    if (!isAuth) {
        history.push('/signin');
    }
    return <Route {...props} />;
};
