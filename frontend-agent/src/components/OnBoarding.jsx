import React, { useState } from 'react'
import { onboardingApi } from '../utils/api';


//-----STEPS FOR ONBOARDING-------//
/*
1. State management - useState()
2. defining questions for moderator & student {field:, question:, options:}
3. setting getting the user type
4. Questions handler - takes fields and value
5. fetch to backend api with a json ({ ...answer })
6. 200k response message or error message 
7. invoking all logics in the react-html 
*/

  //-----------If user is an moderator--------//
  const moderatorQuestions = [
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
  ]

  
  //----------Student Qustions--------//
  const studentQuestions = [
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
  ]

const OnBoarding = () => {
  const [stage, setStage] = useState('useType'); //---screen type? type: qna
  const [userType, setUserType] = useState('');
  const [currentQuestionIndex, setUserId] = useState();
  const [answer, setAnswer] = useState({
    source: '',
    experience: '',
    goals: '',
    interests: '',
  });
  const [currentQuestion, setCurrentQuestions] = useState(0);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelection = (type) => {
    setStage(type);
    setUserType('signup');
  };

  const questionHandler = (field, value) => {
    setAnswer(prev => ({...prev, [field] : value}))
  };

  const handleNext = async() => {
    const currentQ = moderatorQuestions[currentQuestion];

    if(currentQuestion === question.length - 1) {
      setLoading(true);

      const response = onboardingApi({
        ...answer
      })

      const data = response.json();

      if(response.ok) {
        console.log("Onboarding completed");
      }
    }
  }

  return (
    <div>OnBoarding</div>
  )
}

export default OnBoarding