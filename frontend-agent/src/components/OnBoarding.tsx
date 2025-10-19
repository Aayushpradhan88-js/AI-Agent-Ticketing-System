import { create } from 'zustand';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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





















