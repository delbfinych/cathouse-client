import clsx from 'clsx';
import React from 'react';
import styles from './Container.module.scss';

interface IProps {
    className?: string;
}
export const Container: React.FC<IProps> = ({ children, className }) => {
    return <div className={clsx(className, styles.container)}>{children}</div>;
};
