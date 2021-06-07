import React from 'react';
import { Dialog } from '.';
import { Button } from '../Button';
import { MainBlock } from '../MainBlock';

interface IProps {
    isOpen: boolean;
    onCancel: () => any;
    onSubmit: () => any;
    message: string;
}
export const AlertDialog: React.FC<IProps> = ({
    isOpen,
    message,
    onCancel,
    onSubmit,
}) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={() => {
                onCancel();
            }}
        >
            <MainBlock style={{ padding: '20px', width: '35vw' }}>
                <div style={{ marginBottom: '20px' }}>{message}</div>
                <div style={{ textAlign: 'right' }}>
                    <Button
                        style={{ minWidth: '80px', marginRight: '10px' }}
                        onClick={onCancel}
                        variant="white"
                    >
                        Отмена
                    </Button>
                    <Button
                        style={{ minWidth: '80px' }}
                        onClick={onSubmit}
                        variant="blue"
                    >
                        Да
                    </Button>
                </div>
            </MainBlock>
        </Dialog>
    );
};
