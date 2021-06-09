import React, { ChangeEventHandler } from 'react';
import clsx from 'clsx';
import styles from './FormInput.module.scss';

interface IProps {
    className?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: string;
    error?: boolean;
    value?: string;
    name: string;
    ref: any;
}
export const FormInput: React.FC<
    IProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
    children,
    onChange,
    placeholder,
    className,
    type,
    value,
    error = false,
    ref,
    name,
    ...props
}) => {
    return (
        <div className={clsx(className, styles.group)}>
            <input
                name={name}
                {...props}
                placeholder={' '}
                onChange={onChange}
                className={clsx(styles.input, error && styles.error)}
                type={type}
                ref={ref}
            />
            <label className={styles.label}>{placeholder}</label>
        </div>
    );
};
