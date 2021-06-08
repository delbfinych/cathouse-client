import React from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { Loader } from './components/Loader/Loader';
import { useAppDispatch, useAppSelector } from './hooks';
import { Index } from './pages/Index';
import { People } from './pages/People';
import { PostPage } from './pages/PostPage';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { SignIn } from './pages/SignIn';
// import { Button } from './components/Button';
// import { MainBlock } from './components/MainBlock';
import { SignUp } from './pages/SignUp';
import { verifyUser } from './store/slices/user';
import './styles/globals.scss';

function App() {
    const dispatch = useAppDispatch();
    const hst = useHistory();
    const { failure, user } = useAppSelector((state) => state.user);

    React.useEffect(() => {
        dispatch(verifyUser());
    }, []);

    React.useEffect(() => {
        if (failure) {
            hst.push('/signin');
        }
    }, [failure]);

    if (!user && !failure) {
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

                    <Route exact path="/" component={Index} />
                    <Route exact path="/post/:id" component={PostPage} />
                    <Route exact path="/user/:id" component={Profile} />
                    <Route exact path="/user/:id/people" component={People} />
                    <Route render={() => <h4>404 not found</h4>} />

                    {/* <Route exact path="/settings/" component={Settings} /> */}
                </Switch>
            </Container>
        </div>
    );
}

export default App;

