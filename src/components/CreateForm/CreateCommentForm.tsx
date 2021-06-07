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
import { addComment } from '../../store/slices/comments';

interface IProps {
    id: number;
}
export const CreateCommentForm: React.FC<IProps> = ({ id }) => {
    const inputRef = React.useRef<HTMLDivElement>(null);

    // const [isEmojiPicking, setPicking] = React.useState(false);

    const loading = useAppSelector((state) => state.comments.loading);
    const dispatch = useAppDispatch();
    const submit = async (e: any) => {
        e.preventDefault();
        const text = inputRef.current?.innerText!;
        dispatch(addComment(id, text));
        inputRef.current!.innerText = '';
    };

    return (
        <MainBlock style={{ marginBottom: '20px' }}>
            <form className={styles.form}>
                <div
                    ref={inputRef}
                    data-placeholder={`Оставить комментарий`}
                    contentEditable="true"
                    role="textbox"
                    className={clsx(styles.postField, styles.body)}
                    placeholder="asd"
                ></div>
                <Button onClick={submit} className={styles.btn} variant="blue">
                    {loading ? (
                        <Loader height="10px" width="30px" color="white" />
                    ) : (
                        'Отправить'
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
