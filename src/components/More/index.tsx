import clsx from 'clsx';
import React from 'react';
import styles from './More.module.scss';

interface IProps {
    className: string;
}
export const More: React.FC<IProps> = ({ className, children }) => {
    const [isOpen, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen((y) => !y);
    };
    const ref = React.useRef(null);

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
        <div onClick={toggle} ref={ref} className={clsx(styles.wrapper)}>
            <div className={className}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            {isOpen && <div className={styles.menu}>{children}</div>}
        </div>
    );
};
