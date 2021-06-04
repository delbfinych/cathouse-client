import React from 'react';
import styles from './MainBlock.module.scss';
import clsx from 'clsx';

interface IProps {
    className?: string;
    style?: React.CSSProperties;
}
export const MainBlock: React.FC<IProps> = ({ className, style, children }) => {
    return (
        <div style={style} className={clsx(className, styles.block)}>
            {children}
        </div>
    );
};
