import clsx from "clsx";
import React from "react";
import { IUpdateUserData } from "../../api/user";
import { Button } from "../../components/Button";
import { MainBlock } from "../../components/MainBlock";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { update } from "../../store/slices/user";
import styles from "./Profile.module.scss";

export const DescriptionEditor: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);
    const [isOpen, setOpen] = React.useState(false);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (inputRef.current) {
            //@ts-ignore
            inputRef.current.innerText = user?.description;
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(inputRef.current);
            sel?.removeAllRanges();
            sel?.addRange(range);
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
            //@ts-ignore
        }
    }, [isOpen]);
    
    const Description: React.FC = () => {
        return (
            <div
                onClick={() => setOpen(true)}
                className={clsx(
                    styles.description,
                    !user?.description && styles.emptyDescription,
                    'cup',
                    styles.discHover
                )}
            >
                {user?.description ?? 'Изменить описание...'}
            </div>
        );
    };
    const handleSumbit = (e: any) => {
        e.preventDefault();
        const text = inputRef.current?.innerText!.trim();

        const params: IUpdateUserData = {
            avatar_url: user!.avatar_url,
            last_name: user!.last_name,
            first_name: user!.first_name,
            background_image_url: user!.background_image_url,
            username: user!.username,
        };
        if (text) {
            params.description = text;
        }
        if (user) {
            dispatch(update(user.id, params));
        }
        setOpen(false);
        inputRef.current!.innerText = '';
    };
    const ref = React.useRef(null);
    const inputRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClick = (event: any) => {
            //@ts-ignore
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, []);

    return (
        <div>
            <Description />
            {isOpen && (
                <div ref={ref}>
                    <MainBlock
                        style={{
                            padding: '15px',
                            width: '100%',
                        }}
                        className={styles.modalEdit}
                    >
                        <div
                            ref={inputRef}
                            contentEditable="true"
                            role="textbox"
                            className={clsx(styles.postField)}
                        ></div>

                        <Button
                            onClick={handleSumbit}
                            className={styles.btn}
                            variant="blue"
                        >
                            Сохранить
                        </Button>
                    </MainBlock>
                </div>
            )}
        </div>
    );
};
