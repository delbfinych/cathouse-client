import React from 'react';

export const useThrottledLazyLoading = (
    page: number,
    total_pages: number,
    setPage: any,
    ms: number
) => {
    const isThrottle = React.useRef(false);
    React.useEffect(() => {
        const scrollHandler = (e: any) => {
            const allHeight = e.target.documentElement.scrollHeight;
            const scrolled = e.target.documentElement.scrollTop;
            if (isThrottle.current) {
                return;
            }
            if (
                (window.innerHeight + scrolled) / allHeight >= 0.95 &&
                page <= total_pages
            ) {
                isThrottle.current = true;
                //@ts-ignore
                setPage((p) => p + 1);
                setTimeout(() => {
                    isThrottle.current = false;
                }, ms);
            }
        };
        document.addEventListener('scroll', scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler);
    }, [page]);
};
