import React from 'react';

export const useInput = () => {
    const [value, setValue] = React.useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    return { value, onChange: handleChange };
};
