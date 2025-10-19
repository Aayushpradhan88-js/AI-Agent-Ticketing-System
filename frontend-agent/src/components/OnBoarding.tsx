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
   //---state---//
   step: Step;
   userType: UserType | '';
   currentQuestionIndex: number;
   answers: Record<string, string>;
   error: string;
   isSumbitting: boolean
}