import { useState } from 'react';
import ResourceCard from './ResourceCard';

export default function ProfessorCard({ professor, isHighlighted }) {
  const [expanded, setExpanded] = useState(false);

  const directionColors = {
    'ai-compiler': 'bg-purple-100 text-purple-800',
    'cim': 'bg-red-100 text-red-800',
    'fpga-eda': 'bg-green-100 text-green-800',
    'llm-system': 'bg-blue-100 text-blue-800',
    'riscv': 'bg-orange-100 text-orange-800',
    'neuromorphic': 'bg-pink-100 text-pink-800',
    'edge-ai': 'bg-teal-100 text-teal-800',
    'distributed': 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div className={`border rounded-xl transition-all ${isHighlighted ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:shadow-md'} bg-white`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{professor.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${directionColors[professor.directionId] || 'bg-gray-100'}`}>
                {professor.university} · {professor.department}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{professor.tagline}</p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {professor.realDirections.slice(0, 3).map(dir => (
            <span key={dir} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              {dir}
            </span>
          ))}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t pt-4 space-y-6">
          {/* Papers */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">代表性论文解读</h4>
            <div className="space-y-3">
              {professor.papers.map((paper, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{paper.title}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{paper.venue}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{paper.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2">方向犀利评价</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{professor.evaluation}</p>
            <p className="text-sm text-amber-800 mt-2 font-medium">适合谁：{professor.suitableFor}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">技术栈与入门资源</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">核心技术栈</p>
                <div className="flex flex-wrap gap-1.5">
                  {professor.techStack.map(tech => (
                    <span key={tech} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">顶会/顶刊</p>
                <div className="flex flex-wrap gap-1.5">
                  {professor.conferences.map(conf => (
                    <span key={conf} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">{conf}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">推荐开源项目</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {professor.resources.map(res => (
                <ResourceCard key={res.name} {...res} />
              ))}
            </div>
          </div>

          {/* Starter Project */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-1">大三入门项目</h4>
            <p className="text-sm text-gray-700">{professor.starterProject}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>导师风格：{professor.style}</span>
            <span>联系方式：{professor.contact}</span>
          </div>
        </div>
      )}
    </div>
  );
}
