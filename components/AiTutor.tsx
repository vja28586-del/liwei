import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, Lightbulb, Rocket, Smile } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiTutorProps {
  context?: string;
}

export const AiTutor: React.FC<AiTutorProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: context 
        ? `嗨！我是 Cloudy (云小朵) ☁️！很高兴能陪你学习 **${context}**。有什么不懂的尽管问我，我会用最有趣的方式告诉你！ 🎢` 
        : "嗨！我是 Cloudy (云小朵) ☁️，你的 AWS 趣味向导！我们可以聊聊服务，或者规划一下你的云端架构。准备好开始了吗？ 🚀",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      let prompt = userMsg.text;
      if (context && messages.length === 1) {
        prompt = `[Context: User is studying ${context}] ${userMsg.text}`;
      }

      const responseText = await chatWithTutor(prompt, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "哎呀，我的脑回路好像打结了 😵‍💫。请稍后再试一次！",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (type: 'analogy' | 'explain5' | 'quiz_me') => {
    let text = "";
    if (!context) {
        text = "给我讲一个关于 AWS 的有趣知识！";
    } else {
        switch (type) {
            case 'analogy':
                text = `能不能用一个有趣的生活比喻来解释 ${context}？最好是用吃的或者交通工具来比喻！ 🍕🚗`;
                break;
            case 'explain5':
                text = `像我五岁一样解释 ${context} 是什么。`;
                break;
            case 'quiz_me':
                text = `考考我关于 ${context} 的一个简单问题！`;
                break;
        }
    }
    handleSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="relative">
            <div className="p-2 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full">
                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Cloudy 云小朵</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>AWS 趣味向导</span>
            <span className="text-gray-300">|</span>
            <span className="text-indigo-500 font-medium">Online</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-gray-800' : 'bg-gradient-to-br from-aws-orange to-orange-600'
            }`}>
              {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
            </div>
            
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                    ? 'bg-gray-800 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                {msg.isError ? (
                    <span className="text-red-500 font-medium flex items-center gap-2">
                        <span className="text-xl">🤕</span> {msg.text}
                    </span>
                ) : (
                    <div className="prose prose-sm max-w-none prose-indigo">
                      <ReactMarkdown 
                      components={{
                          code({node, className, children, ...props}) {
                          return (
                              <code className={`${className || ''} bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs`} {...props}>
                              {children}
                              </code>
                          )
                          }
                      }}
                      >
                      {msg.text}
                      </ReactMarkdown>
                    </div>
                )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aws-orange to-orange-600 flex items-center justify-center flex-shrink-0">
              <Loader2 size={20} className="text-white animate-spin" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-400 flex items-center gap-2">
              <span>Cloudy 正在思考有趣的回答...</span>
              <span className="flex gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4">
        {/* Quick Actions */}
        {!isLoading && context && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                    onClick={() => handleQuickAction('analogy')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap"
                >
                    <Lightbulb size={12} /> 有趣比喻
                </button>
                <button 
                    onClick={() => handleQuickAction('explain5')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs font-medium hover:bg-pink-100 transition-colors whitespace-nowrap"
                >
                    <Smile size={12} /> 简单解释
                </button>
                <button 
                    onClick={() => handleQuickAction('quiz_me')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors whitespace-nowrap"
                >
                    <Rocket size={12} /> 考考我
                </button>
            </div>
        )}

        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问点好玩的..."
            className="flex-1 pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aws-orange/50 focus:border-aws-orange transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-aws-blue text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200 transform active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};