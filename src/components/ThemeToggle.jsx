import { useTheme } from '../context/useTheme';

const THEMES = [
  { value: 'light', label: '亮色', icon: '☀' },
  { value: 'system', label: '跟随系统', icon: '◉' },
  { value: 'dark', label: '暗色', icon: '☾' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      {THEMES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 cursor-pointer ${
            theme === value
              ? 'bg-white text-primary shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
