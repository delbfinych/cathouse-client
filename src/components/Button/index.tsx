import React, { MouseEventHandler } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface IProps {
    variant: 'blue' | 'white';
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
}
export const Button: React.FC<
    IProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, variant, disabled = false, onClick, className, type, ...props }) => {
    const variants = {
        blue: styles.buttonBlue,
        white: styles.buttonWhite,
    };
    return (
        <button
            type={type}
            className={clsx(className, styles.button, variants[variant])}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
