
import React from 'react';
import { CourseModule } from '../types';
import * as Icons from 'lucide-react';
import { BookOpen, Hammer } from 'lucide-react';

interface CourseCardProps {
  module: CourseModule;
  onClick: (module: CourseModule) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ module, onClick }) => {
  const IconComponent = (Icons[module.iconName as keyof typeof Icons] as React.ElementType) || Icons.Box;

  const theoryCount = module.topics.filter(t => t.type === 'theory').length;
  const labCount = module.topics.filter(t => t.type === 'lab').length;

  return (
    <div 
      onClick={() => onClick(module)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden group flex flex-col h-full"
    >
      <div className={`h-1 w-full transition-all duration-500 ${
        module.difficulty === 'Beginner' ? 'bg-green-400 group-hover:h-2' :
        module.difficulty === 'Intermediate' ? 'bg-yellow-400 group-hover:h-2' :
        'bg-red-400 group-hover:h-2'
      }`} />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gray-50 rounded-lg text-gray-700 group-hover:bg-aws-blue group-hover:text-white transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            module.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' :
            module.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' :
            'bg-red-50 text-red-600'
          }`}>
            {module.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-aws-orange transition-colors">
          {module.title}
        </h3>
        <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <BookOpen size={14} className="text-blue-400" />
            <span>{theoryCount} 概念</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Hammer size={14} className="text-purple-400" />
            <span>{labCount} 实操</span>
          </div>
        </div>
      </div>
    </div>
  );
};
