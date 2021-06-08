import React, { MutableRefObject } from 'react';
import { First } from '../../components/steps/First';
import { Second } from '../../components/steps/Second';
import { Zero } from '../../components/steps/Zero';
import { AvatarStep } from '../../components/steps/Avatar';
import { End } from '../../components/steps/End';

import { authApi } from '../../api/auth';
import { useAppSelector } from '../../hooks';
import { useHistory } from 'react-router';

const steps = [Zero, First, Second, AvatarStep, End];
interface IBody {
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    password: string;
}
interface IContextProps {
    onNextStep: () => void;
    body: MutableRefObject<IBody>;
    completeSteps: () => ReturnType<typeof authApi.signUp>;
}
export const StepsContext = React.createContext<IContextProps>(
    {} as IContextProps
);

export const SignUp: React.FC = () => {
    const [step, setStep] = React.useState(0);
    const Step = steps[step];

    const body = React.useRef<IBody>({} as IBody);

    const onNextStep = () => setStep((step) => step + 1);

    const completeSteps = () => {
        return authApi.signUp(body.current);
    };

    const history = useHistory();
    const user = useAppSelector((state) => state.user.user);
    if (user) {
        history.push('/');
    }
    return (
        <StepsContext.Provider
            value={{
                onNextStep,
                body,
                completeSteps,
            }}
        >
            <div style={{ margin: '0 auto' }}>
                <Step />
            </div>
        </StepsContext.Provider>
    );
};
