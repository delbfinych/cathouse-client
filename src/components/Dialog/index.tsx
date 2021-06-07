import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.scss';

interface IProps {
    onClose: () => any;
    isOpen: boolean;
}
export const Dialog: React.FC<IProps> = ({ isOpen, onClose, children }) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
        const handleClick = (event: any) => {
            if (event.target.id === 'backdrop') {
                onClose();
            }
            //@ts-ignore
            if (ref.current.contains(event.target)) {
                // onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, []);
    return (
        <>
            <div
                id="backdrop"
                ref={ref}
                className={clsx(styles.backdrop, isOpen && styles.open)}
            >
                <div className={styles.child}>{children}</div>
            </div>
        </>
    );
};
