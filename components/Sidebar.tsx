
import React from 'react';
import { Cloud, LayoutDashboard, Settings, Award, Zap, TrendingUp, Globe, Bot } from 'lucide-react';
import { UserStats } from '../types';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  userStats: UserStats;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, userStats }) => {
  const xpPercentage = Math.min((userStats.xp / userStats.nextLevelXp) * 100, 100);

  return (
    <div className="w-64 bg-aws-blue h-screen fixed left-0 top-0 text-white flex flex-col shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-gray-700">
        <div className="relative">
           <Cloud className="w-8 h-8 text-aws-orange" />
           <span className="absolute -top-1 -right-1 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aws-orange opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-aws-orange"></span>
           </span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">CloudMaster</h1>
          <p className="text-xs text-gray-400">AWS 趣味学习</p>
        </div>
      </div>

      {/* User Stats Card */}
      <div className="m-4 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aws-orange to-orange-600 flex items-center justify-center font-bold text-lg shadow-lg">
            {userStats.level}
          </div>
          <div>
            <div className="font-semibold text-sm">{userStats.title}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" fill="currentColor" />
              {userStats.xp} XP
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.floor(xpPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-aws-orange h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-center mt-1 text-gray-500">
            还差 {userStats.nextLevelXp - userStats.xp} XP 升级
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
            currentView === 'dashboard' 
              ? 'bg-aws-orange text-white font-semibold shadow-md' 
              : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>学习概览</span>
        </button>

        <button
          onClick={() => onNavigate('ecosystem')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
            currentView === 'ecosystem' 
              ? 'bg-aws-orange text-white font-semibold shadow-md' 
              : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span>资源生态</span>
        </button>

        <button
          onClick={() => onNavigate('ai_tutor')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
            currentView === 'ai_tutor' 
              ? 'bg-aws-orange text-white font-semibold shadow-md' 
              : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>智能助教</span>
        </button>
        
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
          成就系统
        </div>

        <button disabled className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed opacity-70 hover:bg-gray-800 hover:opacity-100 transition-all">
          <Award className="w-5 h-5" />
          <span>我的徽章</span>
        </button>
        
        <button disabled className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed opacity-70 hover:bg-gray-800 hover:opacity-100 transition-all">
          <TrendingUp className="w-5 h-5" />
          <span>排行榜</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        <p>Powered by Google Gemini</p>
        <p className="mt-1 opacity-50">Make Learning Fun!</p>
      </div>
    </div>
  );
};