import React, { Dispatch, MutableRefObject } from 'react';
import { First } from '../../components/steps/First';
import { Second } from '../../components/steps/Second';
import { Zero } from '../../components/steps/Zero';
import { AvatarStep } from '../../components/steps/Avatar';
import { End } from '../../components/steps/End';
import axios from 'axios';
import { authApi } from '../../api/auth';

const steps = [Zero, First, Second, AvatarStep, End];
interface IContextProps {
    onNextStep: () => void;
    formData: MutableRefObject<FormData>;
    completeSteps: () => ReturnType<typeof authApi.signUp>;
}
export const StepsContext = React.createContext<IContextProps>(
    {} as IContextProps
);

export const SignUp: React.FC = () => {
    const [step, setStep] = React.useState(0);
    const Step = steps[step];

    const formData = React.useRef<FormData>(new FormData());

    const onNextStep = () => setStep((step) => step + 1);

    const completeSteps = () => {
        return authApi.signUp(formData.current);
    };
    return (
        <StepsContext.Provider
            value={{
                onNextStep,
                formData,
                completeSteps,
            }}
        >
            <div style={{ margin: '0 auto' }}>
                <Step />
            </div>
        </StepsContext.Provider>
    );
};
