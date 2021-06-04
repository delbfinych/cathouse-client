import clsx from 'clsx';
import React from 'react';
import styles from './Tabs.module.scss';

interface IProps {
    children: any[];
    className?: string;
    activeClassName?: string;
    initialActiveIdx?: number;
}
export const Tabs: React.FC<IProps> = ({
    children,
    className,
    activeClassName,
    initialActiveIdx = 0,
}) => {
    const [selectedTab, setSelectedTab] = React.useState(initialActiveIdx);
    return (
        <div>
            <ul className={clsx(styles.ul, className)}>
                {children.map((tab, idx) => (
                    <TabTitle
                        activeClassName={activeClassName}
                        className={tab.props.className}
                        active={idx === selectedTab}
                        title={tab.props.title}
                        onSelectTab={() => setSelectedTab(idx)}
                        key={idx}
                    />
                ))}
            </ul>
            {children[selectedTab]}
        </div>
    );
};

interface ITab {
    title: string;
    className?: string;
    activeClassName?: string;
}
export const Tab: React.FC<ITab> = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};

interface ITabTitle extends ITab {
    onSelectTab: () => void;
    active: boolean;
}
const TabTitle: React.FC<ITabTitle> = ({
    title,
    onSelectTab,
    active,
    className,
    activeClassName,
}) => {
    return (
        <li className={clsx(styles.li, active && activeClassName, className)}>
            <div onClick={onSelectTab}>{title}</div>
        </li>
    );
};
