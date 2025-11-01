import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { onboardingApi } from '../../../utils/api';

//----------QUESTIONS CONFIGURATION----------//
const MODERATOR_QUESTIONS = [
  {
    field: 'role',
    question: 'What is your role?',
    options: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Python Engineer", "Java Engineer", "Software Engineer", "QA Tester"]
  },
  {
    field: 'experience',
    question: 'What is your experience level?',
    options: ["Beginner", "Intermediate", "Advance", "Expert"]
  },
  {
    field: 'work',
    question: 'Currently where are you working?',
    options: ["Product Based Companies/Startups", "Service Based Companies/Startups", "Working in MNCs", "AI startups", "Self-Worker", "Other"]
  },
  {
    field: 'timeSpan',
    question: 'How long have you been coding?',
    options: ["5 years", "3 years", "1 year", "Less than 1 year"]
  },
];

const STUDENT_QUESTIONS = [
  {
    field: 'interest',
    question: 'What is your interest?',
    options: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Python Engineer", "Java Engineer", "Software Engineer", "QA Tester"]
  },
  {
    field: 'experience',
    question: 'What is your experience level?',
    options: ["Beginner", "Intermediate", "Advance", "Expert"]
  },
  {
    field: 'source',
    question: 'How did you hear about us?',
    options: ["Youtube", "Instagram", "Ads", "AI Bots suggestions", "Google Suggestions", "Friends"]
  },
  {
    field: 'timeSpan',
    question: 'How long have you been coding?',
    options: ["5 years", "3 years", "1 year", "Less than 1 year"]
  },
];

//----------COMPONENTS----------//
const UserTypeButton = ({ type, icon, title, description, onClick }) => {
  const bgColors = {
    student: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    moderator: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  };

  return (
    <button
      onClick={onClick}
      className={`group relative bg-gradient-to-br ${bgColors[type]} text-white rounded-xl p-8 transition-all duration-300 transform hover:scale-105 shadow-lg`}
    >
      <div className='text-5xl mb-4'>{icon}</div>
      <p className='text-2xl font-bold mb-2'>{title}</p>
      <p className={type === 'student' ? 'text-blue-100' : 'text-purple-100'}>
        {description}
      </p>
    </button>
  );
};

const UserTypeScreen = ({ onSelectType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Let's get you started</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <UserTypeButton
            type='student'
            icon='🎓'
            title='Student'
            description='I am here to learn and grow'
            onClick={() => onSelectType('student')}
          />
          <UserTypeButton
            type='moderator'
            icon='👨‍💼'
            title='Moderator'
            description='I am here to guide and mentor'
            onClick={() => onSelectType('moderator')}
          />
        </div>
      </div>
    </div>
  );
};

const SuccessScreen = () => {
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
  );
};

const OptionButton = ({ option, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-black p-4 rounded-lg border-2 transition-all ${isSelected
        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
    >
      <div className='flex items-center'>
        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
          }`}>
          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <span className="font-medium">{option}</span>
      </div>
    </button>
  );
};

const QuestionScreen = ({ questions, userType, onComplete }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = !!answers[currentQuestion.field];

  const selectAnswer = (field, option) => {
    setAnswers(prev => ({ ...prev, [field]: option }));
    setError('');
  };

  const goToNextQuestion = () => {
    if (!hasAnswer) {
      setError('Please select an option before proceeding');
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setError('');
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!hasAnswer) {
      setError('Please select an option before submitting');
      return;
    }

    setIsSubmitting(true);

    //----------BACKEND PAYLOAD DATA (req.body)----------//
    const payload = {
      userType: userType,
      ...answers
    };
    //----------FETCHING FROM THE BACKEND----------//
    try {
      const response = await onboardingApi.onBoarding(payload);
      //----------FETCHING FROM THE BACKEND----------//
      const data = await response.json();

      if (response.ok) {
        console.log("Successfully sent data to backend", data);
        onComplete();
        navigate("/tickets");
      } else {
        setError('Failed to submit. Please try again');
      }
    } catch (error) {
      console.error("Failed to submit onboarding", error);
      setError('An error occurred. Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        {/*-----Progress Bar-----*/}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/*-----Question-----*/}
        <h2 className="text-2xl font-bold text-black mb-6">{currentQuestion.question}</h2>

        {/*-----Options-----*/}
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

        {/*-----Error Message-----*/}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/*-----Navigation Buttons-----*/}
        <div className="flex justify-between items-center">
          {/*-----Previous button-----*/}
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

          {/*-----Next button-----*/}
          {!isLastQuestion ? (
            <button
              onClick={goToNextQuestion}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) :

            (
              //----------SUBMIT BUTTON TO SEND BACKEND----------//
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              //----------SUBMIT BUTTON TO SEND BACKEND----------//
            )}
        </div>
      </div>
    </div>
  );
};

//----------MAIN COMPONENT----------//
const OnBoarding = () => {
  const [step, setStep] = useState('userType'); // 'userType', 'questions', 'success'
  const [userType, setUserType] = useState('');

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep('questions');
  };

  const handleComplete = () => {
    setStep('success');
  };

  // Render appropriate screen based on step
  if (step === 'userType') {
    return <UserTypeScreen onSelectType={handleUserTypeSelection} />;
  }

  if (step === 'success') {
    return <SuccessScreen />;
  }

  // Questions screen
  const questions = userType === 'student' ? STUDENT_QUESTIONS : MODERATOR_QUESTIONS;
  return (
    <QuestionScreen
      questions={questions}
      userType={userType}
      onComplete={handleComplete}
    />
  );
};

export default OnBoarding;
