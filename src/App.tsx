import React from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { Loader } from './components/Loader/Loader';
import { PrivateRoute } from './components/PrivateRoute';
import { useAppDispatch, useAppSelector } from './hooks';
import { Index } from './pages/Index';
import { People } from './pages/People';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { checkAuth } from './store/slices/user';
import './styles/globals.scss';

function App() {
    const dispatch = useAppDispatch();

    const loading = useAppSelector((state) => state.app.isLoading);
    React.useEffect(() => {
        dispatch(checkAuth());
    }, []);

    if (loading) {
        return (
            <div
                className="d-flex jc-center ai-center"
                style={{ height: '100vh' }}
            >
                <Loader height="50px" width="50px" color="blue" />
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }} className="d-flex flex-column">
            <Header />
            <Container className="d-flex ai-center">
                <Switch>
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/signin" component={SignIn} />

                    <PrivateRoute
                        exact
                        path="/user/:id/people"
                        component={People}
                    />
                    <PrivateRoute
                        exact
                        path="/settings/"
                        component={Settings}
                    />
                    <PrivateRoute path="/user/:id" component={Profile} />
                    <PrivateRoute path={['/']} component={Index} />

                    <Route render={() => <h4>404 not found</h4>} />
                </Switch>
            </Container>
        </div>
    );
}

export default App;
