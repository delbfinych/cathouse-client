import clsx from 'clsx';
import React from 'react';
import { postApi } from '../../api/post';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Loader } from '../Loader/Loader';
import { MainBlock } from '../MainBlock';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import styles from './styles.module.scss';
import { Smile } from './Smile';
import { addPost } from '../../store/slices/userPosts';

export const CreatePostForm: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const inputRef = React.useRef<HTMLDivElement>(null);

    const [isEmojiPicking, setPicking] = React.useState(false);

    const loading = useAppSelector((state) => state.posts.loading);
    const dispatch = useAppDispatch();
    const submit = async (e: any) => {
        e.preventDefault();
        const text = inputRef.current?.innerText!;
        dispatch(addPost(text));
        inputRef.current!.innerText = '';
    };

    return (
        <MainBlock style={{ marginBottom: '20px' }}>
            <form className={styles.form}>
                <Avatar
                    src={
                        user?.avatar_url &&
                        'http://localhost:5000/media/' + user?.avatar_url
                    }
                    height="40px"
                    width="40px"
                    first_name={user?.first_name}
                    last_name={user?.last_name}
                ></Avatar>
                <div
                    ref={inputRef}
                    data-placeholder={`What's new, ${user?.first_name || ''}?`}
                    contentEditable="true"
                    role="textbox"
                    className={clsx(styles.postField, styles.body)}
                    placeholder="asd"
                ></div>
                <Button onClick={submit} className={styles.btn} variant="blue">
                    {loading ? (
                        <Loader height="10px" width="30px" color="white" />
                    ) : (
                        'Запостить'
                    )}
                </Button>
                {/* <div
                    onBlur={() => setPicking(false)}
                    onClick={() => setPicking((t) => !t)}
                    className={styles.smile}
                >
                    <Smile size="22px" />
                </div> */}
                {/* {isEmojiPicking && (
                    <div className={styles.emoji}>
                        <Picker set="apple" />
                    </div>
                )} */}
            </form>
        </MainBlock>
    );
};
