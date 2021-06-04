import React from 'react';
import styles from './StepInfo.module.scss';

interface IProps {
    title: string;
    description?: string;
    icon?: string;
}
export const StepInfo: React.FC<IProps> = ({ description, icon, title }) => {
    return (
        <div className={styles.block}>
            <span className={styles.title}>{title}</span>
            <span className={styles.description}>{description}</span>
        </div>
    );
};
