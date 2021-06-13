import React from 'react';
import { CancelIcon } from './CancelIcon';
import styles from './styles.module.scss';

interface IProps {
    percent: number;
    onCancel: () => any;
}
export const LoadingProgress: React.FC<IProps> = ({
    percent,
    children,
    onCancel,
}) => {
    const radius = 26;
    const circumference = radius * 2 * Math.PI;
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    return (
        <div className={styles.wrapper}>
            <svg className={styles.progressRing} width="60" height="60">
                <circle
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset:
                            circumference - (percent / 100) * circumference,
                    }}
                    className={styles.progressRingCircle}
                    stroke="black"
                    stroke-width="2"
                    fill="transparent"
                    r="26"
                    cx="30"
                    cy="30"
                />
            </svg>
            <div
                onClick={onCancel}
                style={{ fontSize: radius / 2 }}
                className={styles.percentage}
            >
                <CancelIcon height="20px" width="20px" />
            </div>
        </div>
    );
};
