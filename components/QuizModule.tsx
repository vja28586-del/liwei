import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { CheckCircle, XCircle, Loader2, RefreshCw, Trophy, AlertCircle, Star, Zap } from 'lucide-react';

interface QuizModuleProps {
  moduleTitle: string;
  onAddXp: (amount: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ moduleTitle, onAddXp }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleTitle]);

  const loadQuiz = async () => {
    setLoading(true);
    setCompleted(false);
    setCurrentQIndex(0);
    setScore(0);
    setError('');
    setQuestions([]);
    
    try {
      const generatedQuestions = await generateQuiz(moduleTitle);
      if (generatedQuestions.length === 0) {
        setError("AI 似乎在打盹，无法生成题目。请重试一下！");
      } else {
        setQuestions(generatedQuestions);
      }
    } catch (err) {
      setError("加载测验时出错了，请检查网络。");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === questions[currentQIndex].correctIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMsg("太棒了！回答正确 +10 XP 🌟");
      onAddXp(10);
      // Small confetti for correct answer
      const rect = document.getElementById('quiz-option-' + selectedOption)?.getBoundingClientRect();
      if (rect && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 30,
          spread: 50,
          origin: {
            x: (rect.x + rect.width / 2) / window.innerWidth,
            y: (rect.y + rect.height / 2) / window.innerHeight
          },
          colors: ['#FF9900', '#232F3E']
        });
      }
    } else {
      setFeedbackMsg("哎呀，差点就对了！看看解析吧 💪");
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedbackMsg('');
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setCompleted(true);
    const percentage = score / questions.length;
    
    // Bonus XP for passing
    if (percentage >= 0.7) {
      const bonus = Math.round(score * 5);
      onAddXp(bonus);
      if ((window as any).confetti) {
        (window as any).confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-aws-orange opacity-20 rounded-full animate-ping"></div>
          <div className="bg-white p-3 rounded-full shadow-md relative z-10">
            <Loader2 className="w-8 h-8 animate-spin text-aws-orange" />
          </div>
        </div>
        <p className="font-medium animate-pulse">AI 正在为你出题中... 🧠✨</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-3">
        <AlertCircle className="w-10 h-10" />
        <p>{error}</p>
        <button 
          onClick={loadQuiz}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          <RefreshCw size={16} /> 再试一次
        </button>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = percentage >= 60;

    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto mt-10 transform transition-all hover:scale-105 duration-500">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${isPass ? 'bg-yellow-100 animate-bounce-short' : 'bg-gray-100'}`}>
          {isPass ? (
            <Trophy className="w-12 h-12 text-yellow-600" />
          ) : (
            <RefreshCw className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{isPass ? "挑战成功! 🎉" : "继续加油! 💪"}</h2>
        <p className="text-gray-600 mb-6">你在 {moduleTitle} 单元获得了:</p>
        
        <div className="text-6xl font-black text-aws-blue mb-4 tracking-tight">
          {score * 10 + (isPass ? Math.round(score * 5) : 0)} <span className="text-2xl font-medium text-aws-orange">XP</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <span>答对 {score} / {questions.length} 题</span>
          <span>•</span>
          <span>正确率 {percentage}%</span>
        </div>

        <button
          onClick={loadQuiz}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-aws-orange text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          <RefreshCw size={20} /> 再玩一次
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto pt-4">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold">
            {currentQIndex + 1}
          </div>
          <span className="text-gray-500 text-sm">/ {questions.length}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-aws-orange rounded-full font-bold">
            <Zap size={16} fill="currentColor" />
            <span>{score * 10} XP</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <div 
                className="h-full bg-aws-blue transition-all duration-500"
                style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
            />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6 mt-2">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let styleClass = "border-2 border-gray-100 hover:border-aws-orange hover:bg-orange-50";
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                styleClass = "border-green-500 bg-green-50 text-green-900 shadow-md";
              } else if (idx === selectedOption) {
                styleClass = "border-red-500 bg-red-50 text-red-900";
              } else {
                styleClass = "border-gray-100 opacity-50 bg-gray-50";
              }
            } else if (selectedOption === idx) {
              styleClass = "border-aws-orange bg-orange-50 ring-2 ring-aws-orange ring-opacity-50";
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${styleClass}`}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="text-green-600 animate-bounce-short" size={24} />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="text-red-600" size={24} />}
                {!isAnswered && (
                    <div className={`w-5 h-5 rounded-full border-2 ${selectedOption === idx ? 'border-aws-orange bg-aws-orange' : 'border-gray-300 group-hover:border-aws-orange'} transition-colors`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {feedbackMsg && (
        <div className={`mb-6 p-4 rounded-xl text-center font-bold animate-pulse ${isAnswered && selectedOption === currentQ.correctIndex ? 'text-green-600 bg-green-50' : 'text-aws-blue bg-blue-50'}`}>
            {feedbackMsg}
        </div>
      )}

      {isAnswered && (
        <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 text-sm relative">
          <div className="absolute -top-3 left-6 px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded uppercase">
            💡 知识点解析
          </div>
          <div className="mt-2 leading-relaxed">
            {currentQ.explanation}
          </div>
        </div>
      )}

      <div className="flex justify-end pb-10">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-aws-blue text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-gray-300"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-aws-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all transform active:scale-95 shadow-lg shadow-orange-200 flex items-center gap-2"
          >
            {currentQIndex < questions.length - 1 ? '下一题' : '查看成绩'} <span className="text-xl">→</span>
          </button>
        )}
      </div>
    </div>
  );
};