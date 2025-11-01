import { create } from 'zustand';
import React, { JSX, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, DiffIcon, Divide } from 'lucide-react';
import { OnBoardingAPI } from '../utils/api.jsx';

//----------FOUNDATION START----------//
//--------types--------//
type UserType = 'student' | 'moderator';
type Step = 'userType' | 'questions' | 'success';

interface Question {
    field: string;
    question: string;
    options: string[];
};

interface IOnboardingState {
    //---STATE---//
    step: Step;
    userType: UserType | '';
    currentQuestionIndex: number;
    answers: Record<string, string>; //-----Record<KeyType, ValueType> = it is like a object-----//
    error: string;
    isSubmitting: boolean;

    //---ACTIONS---//
    setStep: (step: Step) => void;
    setUserType: (type: UserType) => void;
    setCurrentQuestionIndex: (index: number) => void;
    setAnswers: (answers: Record<string, string>) => void;
    setError: (error: string) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;

    //---COMPUTED ACTIONS---//
    resetState: () => void;
    selectAnswer: (field: string, option: string) => void;
    goToNextQuestion: () => void;
    goToPreviousQuestion: () => void;
};
//----------FEATURE FOUNDATION COMPLETE----------//

const useOnboardingStore = create<IOnboardingState>((set) => {
    step: 'userType';
    userType: '';
    currentQuestionIndex: 0;
    answers: { };
    error: '';
    isSumbitting: false;

    setStep: (step: Step) => set({ step });
    setUserType: (userType: UserType) => set({ userType });
    setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index })
    setAnswers: (answers: Record<string, string>) => set({ answers });
    setError: (error: string) => set({ error });
    setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting })

    resetState: () => set({
        step: 'questions',
        currentQuestionIndex: 0,
        answers: {},
        error: '',
    });

    selectAnswer: (field: string, option: string) => set((state) => ({
        answers: { ...state.answers, [field]: option }
    }));

    goToNextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        error: '',
    }));

    goToPreviousQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex - 1,
        error: ''
    }))
});

const MODERATOR_QUESTIONS: Question[] = [
    {
        field: 'role',
        question: 'What is youre role?',
        options: ["frontend Developer", "Backend Developer", "fullstack Developer", "Python Engineer", "Java Engineer", "Software Engineer", "QA Tester"]
    },
    {
        field: 'experience',
        question: 'What is youre experience level?',
        options: ["Beginner", "Intermediate", "Advance", "Expert"]
    },
    {
        field: 'work',
        question: 'Currently where are you working?',
        options: ["Product Based Companies/Startups", "Service Based Companies/Startups", "Working in MNCs", "AI startups", "Self-Worker", "Other"]
    },
    {
        field: 'TimeSpan',
        question: 'How long are you coding?',
        options: ["5 year", "3 year", "1 year", "less than 1year"]
    },
];

const STUDENT_QUESTIONS: Question[] = [
    {
        field: 'Interest',
        question: 'What is youre interest',
        options: ["frontend Developer", "Backend Developer", "fullstack Developer", "Python Engineer", "Java Engineer", "Software Engineer", "QA Tester"]
    },
    {
        field: 'experience',
        question: 'What is youre experience level?',
        options: ["Beginner", "Intermediate", "Advance", "Expert"]
    },
    {
        field: 'Source',
        question: 'How did you hear about us?',
        options: ["Youtube", "Instagram", "Ads", "AI Bots suggestions", "Google Suggestions", "Friends"]
    },
    {
        field: 'TimeSpan',
        question: 'How long are you coding?',
        options: ["5 year", "3 year", "1 year", "less than 1year"]
    },
];

//----------BACKEND API CALLING INTERFACE----------//
interface IOnboardingPayload {
    userType: UserType;
    [key: string]: string;
};

const onboardingApi = {
    submitOnboarding: async (payload: IOnboardingPayload): Promise<boolean> => {
        try {
            const response = new OnBoardingAPI(payload)

            const data = await response.json()

            if (response.ok) {
                console.log("successfully sended data to backend", data);
            }
        } catch (error) {
            console.log("Failed ot submit onboarding");
        }
    }
}

//----------COMPONENTS----------//
interface IUserTypeButtonsProps {
    type: UserType;
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
};

const UserTypeButton: React.FC<IUserTypeButtonsProps> = (props) => {
    const bgColors = {
        student: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        moderator: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    };

    return (
        <button
            onClick={props.onClick}
            className={`group relative bg-gradient-to-br ${bgColors[props.type]} text-white rounded-xl p-8 transition-all duration-300 transform hover:scale-105 shadow-lg`}>
            <div className='text-5xl mb-4'>{props.icon}</div>
            <p className='text-2xl font-bold mb-2'>{props.title}</p>
            <p className={props.type === 'student' ? 'text-blue-100' : 'text-purple-100'}>
                {props.description}
            </p>
        </button>
    )
}

const UserTypeScreen: React.FC = () => {
    const { setUserType, resetState } = useOnboardingStore();

    const handleUserTypeSelect = (type: UserType) => {
        setUserType(type);
        resetState();
    };

    //--------------DISPLAY UI PART (STUDENT/MODERATOR) OPTION--------------//
    return (
        <div>
            <div>
                <p>Let's get you started</p>

                <div>
                    <UserTypeButton
                        type='student'
                        icon='🎓'
                        title='Student'
                        description='I am here to learn and grow'
                        onClick={() => handleUserTypeSelect('student')}
                    />

                    <UserTypeButton
                        type='moderator'
                        icon='👨‍💼'
                        title='Moderator'
                        description='I am here to guide and mentor'
                        onClick={() => handleUserTypeSelect('moderator')}
                    />
                </div>
            </div>
        </div>
    );
};

//------SUCCESS SCREEN------//
const SuccessScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">All Set! 🎉</h1>
                <p className="text-gray-600 mb-8">Your onboarding is complete</p>
            </div>
        </div>
    )
}

interface IOptionButtonsProps {
    option: string;
    isSelected: boolean;
    onClick: () => void;
}

const OptionButton: React.FC<IOptionButtonsProps> = (props) => {
    return (
        <button
            onClick={props.onClick}
            className={`w-full text-left p-4 rounded-lg border-2 ${props.isSelected ?
                'border-indigo-600 bg-indigo-50 text-indigo-700' :
                'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}>
            <div className='flex items-center'>
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center`}>
                    {props.isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-medium">{props.option}</span>
            </div>
        </button>
    )
};

interface IQuestionScreenProps {
    questions: Question[]
};

const QuestionScreen: React.FC<IQuestionScreenProps> = (props) => {
    const {
        currentQuestionIndex,
        answers,
        error,
        isSubmitting,
        selectAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        setStep,
        setError,
        setIsSubmitting,
        userType
    } = useOnboardingStore()


    const currentQuestion = props.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / props.questions.length) * 100;
    /*
    ***  Calculation of progress 
          currentQuesitonIndex = 0
          progress = ((0+1)/5)*100 = ((1/5)/5)*100 = 0.2*100 = 20%
    */
    const isLastQuestion = currentQuestionIndex === props.questions.length - 1;
    const hasAnswer = !!answers[currentQuestion.field];

    const handleNext = () => {
        if (!hasAnswer) {
            setError('Please select an option before proceeding');
            return;
        }
        goToNextQuestion();
    };

    const handleSubmit = async () => {
        if (!hasAnswer) {
            setError('Please select an option before submitting');
            return;
        }

        setIsSubmitting(true);

        const payload: IOnboardingPayload = {
            userType: userType as UserType
        }

        try {
            const success = await onboardingApi.submitOnboarding(payload);
            if (success) {
                setStep('success')
            } else {
                setError('Failed to submit. Please try again')
            }
        } catch (error) {
            setError('An error occured. Please try again');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
                {/*---------Progress Bar----------*/}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Question {currentQuestionIndex + 1} of {props.questions.length}
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                            {Math.round(progress)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/*---------Question---------*/}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>

                {/*---------Options---------*/}
                <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option) => (
                        <OptionButton
                            key={option}
                            option={option}
                            isSelected={answers[currentQuestion.field] === option}
                            onClick={() => selectAnswer(currentQuestion.field, option)}
                        />
                    ))}
                </div>

                {/*---------Error Message---------*/}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/*---------Navigation Buttons---------*/}
                <div className="flex justify-between items-center">
                    <button
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${currentQuestionIndex === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                    </button>

                    {!isLastQuestion ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-lg font-semibold transition-colors text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

function OnboardingFlow(): JSX.Element {
    const{step, userType} = useOnboardingStore();

    const questions = userType === 'student'? STUDENT_QUESTIONS: MODERATOR_QUESTIONS
    
    if(step === 'userType') {
        return <UserTypeScreen/>
    }
    if(step === 'success') {
        return <SuccessScreen/>
    }

    return  <QuestionScreen questions={questions}/>
}

export default OnboardingFlow;