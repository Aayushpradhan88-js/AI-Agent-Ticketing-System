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
}

interface OnboardingState {
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

const useOnboardingStore = create<OnboardingState>((set) => {
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
})


























