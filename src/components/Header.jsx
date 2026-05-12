export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          清华/北大体系结构方向择校调研
        </h1>
        <p className="text-blue-200 text-lg mb-2">
          8位导师 × 8个方向 · 论文解读 · 就业数据 · 个性化匹配
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['就业优先', '论文验证', '犀利评价', '实操项目'].map(tag => (
            <span key={tag} className="bg-blue-700/50 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
