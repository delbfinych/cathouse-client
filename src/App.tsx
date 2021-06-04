import React from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { useAppDispatch, useAppSelector } from './hooks';
import { Index } from './pages/Index';
import { People } from './pages/People';
import { PostPage } from './pages/PostPage';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
// import { Button } from './components/Button';
// import { MainBlock } from './components/MainBlock';
import { SignUp } from './pages/SignUp';
import { verifyUser } from './store/slices/user';
import './styles/globals.scss';

function App() {
    const dispatch = useAppDispatch();
    const hst = useHistory();
    const { failure, loading } = useAppSelector((state) => state.user);

    React.useEffect(() => {
        dispatch(verifyUser());
        if (failure) {
            hst.push('/signin');
        }
    }, [failure]);

    // if (loading) {
    //     return <div>loading..</div>;
    // }
    return (
        <div style={{ position: 'relative' }} className="d-flex flex-column">
            <Header></Header>
            <Container className="d-flex ai-center">
                <Switch>
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/" component={Index} />
                    <Route exact path="/post/:id" component={PostPage} />
                    <Route exact path="/user/:id" component={Profile} />
                    <Route exact path="/user/:id/people" component={People} />
                    <Route exact path="/user/:id/people/following" />
                    <Route exact path="/user/:id/people/followers" />

                    <Route render={() => <h4>404 not found</h4>} />
                </Switch>
            </Container>
        </div>
    );
}

export default App;
