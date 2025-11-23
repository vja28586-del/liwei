
import React from 'react';
import { AWS_RESOURCES } from '../constants';
import * as Icons from 'lucide-react';
import { ExternalLink } from 'lucide-react';

export const EcosystemHub: React.FC = () => {
  return (
    <div className="p-8 pb-20 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">云端生态圈 <span className="text-aws-orange">Ecosystem</span></h2>
        <p className="text-lg text-gray-600 max-w-3xl">
            进入 AWS 圈子的秘密通道。这里有开发者必备的 <span className="font-bold text-gray-800">神级工具</span>、
            <span className="font-bold text-gray-800">硬核社区</span> 以及让你跟上技术潮流的 <span className="font-bold text-gray-800">前沿资讯</span>。
        </p>
      </div>

      <div className="space-y-12">
        {AWS_RESOURCES.map((category) => (
          <div key={category.id}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-aws-orange pl-3">
              {category.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {category.items.map((item, idx) => {
                const IconComponent = (Icons[item.iconName as keyof typeof Icons] as React.ElementType) || Icons.Link;
                
                return (
                  <a 
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={16} className="text-gray-400" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg text-aws-blue group-hover:bg-aws-blue group-hover:text-white transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-aws-orange transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed h-12 overflow-hidden line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {item.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="px-2 py-1 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">找不到想要的资源？</h3>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            AWS 生态系统每天都在进化。你可以询问右侧的 AI 助教 <span className="font-bold">Cloudy</span>，
            让他为你推荐针对特定领域的开源项目或博客文章！
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
             <Icons.Sparkles size={16} className="text-yellow-300" />
             <span className="text-sm">Pro Tip: 试试问 "推荐一些 Serverless 的开源框架"</span>
          </div>
      </div>
    </div>
  );
};
