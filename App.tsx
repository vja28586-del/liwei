
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CourseCard } from './components/CourseCard';
import { AiTutor } from './components/AiTutor';
import { QuizModule } from './components/QuizModule';
import { EcosystemHub } from './components/EcosystemHub';
import { AWS_TRACKS } from './constants';
import { CourseModule, ViewState, UserStats, Topic } from './types';
import { ArrowLeft, BookOpen, MessageSquare, HelpCircle, PlayCircle, Sparkles, Award, Zap, Hammer, GraduationCap, CheckCircle } from 'lucide-react';
import { generateExplanation } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'chat' | 'quiz'>('learn');
  
  // Gamification State
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    streak: 1,
    title: 'Cloud Rookie'
  });
  const [notification, setNotification] = useState<{message: string, type: 'xp' | 'level'} | null>(null);

  // Learning State
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddXp = (amount: number) => {
    setUserStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;
      let newTitle = prev.title;
      let leveledUp = false;

      if (newXp >= newNextLevelXp) {
        newXp = newXp - newNextLevelXp;
        newLevel += 1;
        newNextLevelXp = Math.round(newNextLevelXp * 1.5);
        leveledUp = true;
        
        if (newLevel >= 5) newTitle = 'Cloud Associate';
        if (newLevel >= 10) newTitle = 'Solutions Architect';
        if (newLevel >= 20) newTitle = 'Principal Engineer';
      }

      if (leveledUp) {
        setNotification({ message: `LEVEL UP! Welcome to Level ${newLevel}! 🎉`, type: 'level' });
        if ((window as any).confetti) {
          (window as any).confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500']
          });
        }
      } else {
         setNotification({ message: `+${amount} XP`, type: 'xp' });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextLevelXp,
        title: newTitle
      };
    });
  };

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      setViewState(ViewState.DASHBOARD);
      setSelectedModule(null);
    } else if (view === 'ecosystem') {
      setViewState(ViewState.ECOSYSTEM);
      setSelectedModule(null);
    } else if (view === 'ai_tutor') {
      setViewState(ViewState.AI_TUTOR);
      setSelectedModule(null);
    }
  };

  const handleModuleClick = (module: CourseModule) => {
    setSelectedModule(module);
    setViewState(ViewState.MODULE_DETAIL);
    setActiveTab('learn');
    setExplanation(null); 
  };

  const handleTopicClick = async (topic: Topic) => {
    if (!selectedModule) return;
    setLoadingExplanation(true);
    
    // Mark as completed and award XP only if first time
    if (!completedTopicIds.has(topic.id)) {
        const reward = topic.type === 'lab' ? 15 : 5;
        handleAddXp(reward);
        setCompletedTopicIds(prev => {
            const next = new Set(prev);
            next.add(topic.id);
            return next;
        });
    }

    const text = await generateExplanation(topic.title, topic.type, selectedModule.title);
    setExplanation(text);
    setLoadingExplanation(false);
  };

  const renderDashboard = () => (
    <div className="p-8 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">云计算大师之路 <span className="text-aws-orange">AWS</span></h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            不要死记硬背。通过 <span className="font-bold text-gray-800">演进历史</span> 理解技术本质，通过 <span className="font-bold text-gray-800">实战演练</span> 掌握现代架构。
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <Zap size={18} className="text-yellow-500 fill-current" />
          <span className="font-bold">连续打卡: {userStats.streak} 天</span>
        </div>
      </div>
      
      <div className="space-y-12">
        {AWS_TRACKS.map((track, trackIdx) => (
          <div key={track.id} className="animate-fade-in" style={{ animationDelay: `${trackIdx * 100}ms` }}>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-xl">
                 {trackIdx + 1}
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-gray-900">{track.title}</h3>
                 <p className="text-gray-500 text-sm">{track.description}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {track.modules.map(module => (
                <CourseCard 
                  key={module.id} 
                  module={module} 
                  onClick={handleModuleClick} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModuleDetail = () => {
    if (!selectedModule) return null;

    const theoryTopics = selectedModule.topics.filter(t => t.type === 'theory');
    const labTopics = selectedModule.topics.filter(t => t.type === 'lab');
    
    const totalTopics = selectedModule.topics.length;
    const completedCount = selectedModule.topics.filter(t => completedTopicIds.has(t.id)).length;
    const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 h-16 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewState(ViewState.DASHBOARD)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedModule.title}</h2>
                <p className="text-xs text-gray-500 hidden md:block">难度: {selectedModule.difficulty}</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'learn' ? 'bg-white text-aws-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen size={16} /> 课程
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-white text-aws-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare size={16} /> AI 助教
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'quiz' ? 'bg-white text-aws-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle size={16} /> 测验
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        {activeTab === 'learn' && (
            <div className="bg-white border-b border-gray-100">
                <div className="h-1 w-full bg-gray-100">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500 ease-out relative shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="px-6 py-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <span>{completedCount} / {totalTopics} 完成</span>
                    <span>{progressPercentage}%</span>
                </div>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'learn' && (
            <div className="flex flex-col lg:flex-row h-full">
              {/* Sidebar List */}
              <div className="w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
                
                {/* Theory Section */}
                {theoryTopics.length > 0 && (
                    <div className="p-4 pb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            <GraduationCap size={14} /> 理论演进
                        </div>
                        <div className="space-y-1">
                            {theoryTopics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTopicClick(topic)}
                                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-aws-blue text-gray-600 transition-all flex items-start gap-3 group text-sm"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {completedTopicIds.has(topic.id) ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-aws-orange transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`font-medium leading-tight ${completedTopicIds.has(topic.id) ? 'text-gray-400 line-through decoration-gray-300' : ''}`}>
                                        {topic.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-100 my-2 mx-4"></div>

                {/* Lab Section */}
                {labTopics.length > 0 && (
                    <div className="p-4 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            <Hammer size={14} /> 实战演练
                        </div>
                        <div className="space-y-1">
                            {labTopics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTopicClick(topic)}
                                    className="w-full text-left px-3 py-3 rounded-lg bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-700 border border-gray-100 hover:border-purple-100 transition-all flex items-start gap-3 group text-sm shadow-sm"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {completedTopicIds.has(topic.id) ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <PlayCircle size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        )}
                                    </div>
                                    <span className={`font-medium leading-tight ${completedTopicIds.has(topic.id) ? 'text-gray-400 line-through decoration-gray-300' : ''}`}>
                                        {topic.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="m-4 p-4 bg-gradient-to-br from-aws-blue to-gray-900 rounded-xl text-white text-xs shadow-lg">
                  <p className="font-bold mb-1 flex items-center gap-2">
                    <Sparkles size={12} className="text-yellow-400" /> 经验值奖励
                  </p>
                  <div className="flex justify-between opacity-80 mt-2">
                    <span>📖 学习理论</span>
                    <span>+5 XP</span>
                  </div>
                  <div className="flex justify-between opacity-80 mt-1">
                    <span>🛠️ 完成实验</span>
                    <span className="text-yellow-400 font-bold">+15 XP</span>
                  </div>
                </div>
              </div>

              {/* Main Content View */}
              <div className="flex-1 bg-gray-50 p-6 lg:p-10 overflow-y-auto">
                {loadingExplanation ? (
                  <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in">
                    <div className="relative w-24 h-24">
                       <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-aws-orange rounded-full border-t-transparent animate-spin"></div>
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-aws-blue w-8 h-8 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Cloudy 正在连接 AWS 知识库...</h3>
                        <p className="text-gray-500 text-sm">生成定制化教程中</p>
                    </div>
                  </div>
                ) : explanation ? (
                  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12 min-h-full">
                    <div className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900 
                        prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8 prose-h2:text-aws-blue
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-strong:text-aws-orange prose-strong:font-bold
                        prose-code:bg-gray-100 prose-code:text-purple-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:shadow-lg prose-pre:rounded-xl
                        prose-li:marker:text-aws-orange">
                      <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                         <button onClick={() => setExplanation(null)} className="text-gray-400 hover:text-aws-orange text-sm font-medium transition-colors">
                            完成学习，返回目录
                         </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
                    <div className="w-32 h-32 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-8">
                        <BookOpen className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">开始你的 AWS 之旅</h3>
                    <p className="text-gray-500 leading-relaxed">
                      点击左侧目录选择一个 <span className="font-bold text-aws-blue">理论知识点</span> 来了解历史与架构，
                      或者选择一个 <span className="font-bold text-purple-600">实战演练</span> 来亲手操作控制台。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full max-w-5xl mx-auto p-4">
              <AiTutor context={selectedModule.title} />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="h-full overflow-y-auto p-4 bg-gray-50">
              <QuizModule moduleTitle={selectedModule.title} onAddXp={handleAddXp} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar 
        onNavigate={handleNavigate} 
        currentView={
          viewState === ViewState.DASHBOARD ? 'dashboard' : 
          viewState === ViewState.ECOSYSTEM ? 'ecosystem' : 
          viewState === ViewState.AI_TUTOR ? 'ai_tutor' : 'module'
        } 
        userStats={userStats} 
      />
      <main className="flex-1 ml-64 h-full overflow-y-auto relative scrollbar-hide">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 animate-bounce-short ${
            notification.type === 'level' 
              ? 'bg-gray-900 text-white border border-gray-700' 
              : 'bg-white text-gray-900 border-l-4 border-aws-orange'
          }`}>
            {notification.type === 'level' ? <Award className="w-8 h-8 text-yellow-400" /> : <Zap className="w-6 h-6 text-aws-orange fill-current" />}
            <div>
                <p className="font-bold text-lg">{notification.message}</p>
            </div>
          </div>
        )}
        
        {viewState === ViewState.DASHBOARD && renderDashboard()}
        {viewState === ViewState.ECOSYSTEM && <EcosystemHub />}
        {viewState === ViewState.AI_TUTOR && (
           <div className="h-full p-6">
              <div className="max-w-5xl mx-auto h-full shadow-lg rounded-2xl overflow-hidden">
                  <AiTutor />
              </div>
           </div>
        )}
        {viewState === ViewState.MODULE_DETAIL && renderModuleDetail()}
      </main>
    </div>
  );
};

export default App;