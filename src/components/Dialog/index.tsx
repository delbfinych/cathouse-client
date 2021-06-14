import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss';
import layerControl from '../../static/layer_controls.png';
interface IProps {
    onClose: () => any;
    isOpen: boolean;
}

export const Dialog: React.FC<IProps> = ({ isOpen, onClose, children }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = `hidden`;
        }
        const handleClick = (event: any) => {
            if (event.target.id === 'backdrop') {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, []);

    const handleClose = () => {
        onClose();
        document.body.style.overflow = `auto`;
    };
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <>
            <div
                id="backdrop"
                ref={ref}
                className={clsx(styles.backdrop, isOpen && styles.open)}
            >
                <div className={styles.child}>
                    {children}
                    <div
                        style={{
                            backgroundImage: `url(${layerControl})`,
                        }}
                        onClick={handleClose}
                        className={styles.close}
                    ></div>
                </div>
            </div>
        </>,
        document.body
    );
};
