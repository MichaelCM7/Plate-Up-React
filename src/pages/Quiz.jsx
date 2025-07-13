import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);

  const questions = [
    {
      id: 'people',
      question: 'How many people are you cooking for?',
      type: 'single',
      options: ['One', 'Two', 'Three', '5+']
    },
    {
      id: 'budget',
      question: "What's your weekly food budget?",
      type: 'single',
      options: ['Under Ksh.500', 'Ksh.500-1,000', 'Ksh.1,000-1,500', 'Ksh.1,500+']
    },
    {
      id: 'dietary',
      question: 'Any dietary restrictions or preferences?',
      type: 'multiple',
      options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Keto', 'Paleo', 'Dairy-free', 'Nut-free']
    },
    {
      id: 'cuisine',
      question: 'Which cuisines do you enjoy most?',
      type: 'multiple',
      options: ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'Middle Eastern', 'French', 'Thai', 'Japanese']
    },
    {
      id: 'experience',
      question: 'How would you describe your cooking experience?',
      type: 'single',
      options: ['Beginner', 'Some experience', 'Intermediate', 'Advanced']
    },
    {
      id: 'time',
      question: 'How much time do you typically have for meal prep?',
      type: 'single',
      options: ['Under 30 min', '30-60 min', '1-2 hours', '2+ hours']
    }
  ];

  const handleSingleChoice = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoice = (questionId, value) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(item => item !== value)
        : [...currentAnswers, value];
      
      return {
        ...prev,
        [questionId]: newAnswers
      };
    });
  };



  const startQuiz = () => {
    setShowHomePage(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isQuestionAnswered = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];
    
    if (question.type === 'multiple') {
      return answer && answer.length > 0;
    } else {
      return answer !== undefined;
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowHomePage(true);
  };
  
  const navigate = useNavigate();

  const saveResults = () => {
    // Store results in localStorage for now
    localStorage.setItem('quizResults', JSON.stringify({
      timestamp: new Date().toISOString(),
      answers: answers
    }));
    navigate('/Meal-Planner');
  };

  // Home Page
  if (showHomePage) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="home-content">
            <h1 className="home-title" style={{textAlign:'center'}}>🍽️ Meal Plan Quiz</h1>
            <p className="home-subtitle">
              Get personalized meal recommendations tailored to your preferences, budget, and lifestyle
            </p>
            <div className="home-features">
              <div className="feature-item">
                <span>👥 Customized for your household size</span>
              </div>
              <div className="feature-item">
                <span>💰 Budget-friendly options</span>
              </div>
              <div className="feature-item">
                <span>🥗 Dietary preferences respected</span>
              </div>
              <div className="feature-item">
                <span>🌍 Global cuisine varieties</span>
              </div>
            </div>
            <p className="home-description">
              Take our quick 6-question quiz to discover meal plans that fit your lifestyle perfectly. 
              It only takes 2-3 minutes!
            </p>
            <button onClick={startQuiz} className="btn btn-primary start-quiz-btn">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-container" style={{backgroundColor: `white`}}>
        <div className="quiz-card">
          <h2 style={{textAlign: 'center'}}>Quiz Complete!</h2>
          <div className="results-summary">
            <h3>Your Preferences:</h3>
            <div className="result-item">
              <strong>Cooking for:</strong> {answers.people} people
            </div>
            <div className="result-item">
              <strong>Weekly budget:</strong> {answers.budget}
            </div>
            <div className="result-item">
              <strong>Dietary preferences:</strong> {answers.dietary?.join(', ') || 'None specified'}
            </div>
            <div className="result-item">
              <strong>Favorite cuisines:</strong> {answers.cuisine?.join(', ') || 'None specified'}
            </div>
            <div className="result-item">
              <strong>Cooking experience:</strong> {answers.experience}
            </div>
            <div className="result-item">
              <strong>Available time:</strong> {answers.time}
            </div>
          </div>
          <div className="results-actions">
            <button onClick={saveResults} className="btn btn-primary">
              Save & Get Meal Plan
            </button>
            <button onClick={resetQuiz} className="btn btn-secondary">
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <h2 className="question-title">{question.question}</h2>
        
        <div className="question-content">
          {question.type === 'single' && (
            <div className="options-grid">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${answers[question.id] === option ? 'selected' : ''}`}
                  onClick={() => handleSingleChoice(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {question.type === 'multiple' && (
            <div className="options-grid">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${answers[question.id]?.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleMultipleChoice(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
         </div>
        
        <div className="navigation-buttons">
          <button 
            onClick={prevQuestion} 
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <button 
            onClick={nextQuestion} 
            disabled={!isQuestionAnswered()}
            className="btn btn-primary"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;