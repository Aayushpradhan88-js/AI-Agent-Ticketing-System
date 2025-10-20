import { create } from 'zustand';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, DiffIcon, Divide } from 'lucide-react';
import { OnBoardingAPI } from '../utils/api.jsx';

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
const successScreen: React.FC = () => {
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
                            {props.isSelected && <div className="w-2 h-2 bg-white rounded-full"/>}
                        </div>
                        <span className="font-medium">{props.option}</span>
                    </div>
        </button>
    )
};

interface IQuestionScreenProps {
    questions: Q
}








