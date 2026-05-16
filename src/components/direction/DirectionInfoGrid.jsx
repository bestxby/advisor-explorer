import DirectionInfoCard from './DirectionInfoCard';

const CARD_TONES = {
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    iconText: 'text-blue-600 dark:text-blue-400',
  },
  red: {
    iconBg: 'bg-red-50 dark:bg-red-900/30',
    iconText: 'text-red-600 dark:text-red-400',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
    iconText: 'text-orange-600 dark:text-orange-400',
  },
};

function DirectionParagraph({ children }) {
  return (
    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
      {children}
    </p>
  );
}

function Courses({ courses }) {
  return (
    <div className="flex flex-wrap gap-2">
      {courses.map((course) => (
        <span
          key={course}
          className="inline-flex items-center px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-lg border border-purple-100 dark:border-purple-800"
        >
          {course}
        </span>
      ))}
    </div>
  );
}

export default function DirectionInfoGrid({ direction }) {
  const leftCards = [
    {
      title: '日常在干什么',
      icon: 'work',
      tone: CARD_TONES.blue,
      content: <DirectionParagraph>{direction.dailyWork}</DirectionParagraph>,
    },
    {
      title: '核心痛点',
      icon: 'pain',
      tone: CARD_TONES.red,
      content: <DirectionParagraph>{direction.corePainPoint}</DirectionParagraph>,
    },
    {
      title: '你的护城河',
      icon: 'moat',
      tone: CARD_TONES.emerald,
      content: <DirectionParagraph>{direction.moat}</DirectionParagraph>,
    },
  ];

  const rightCards = [
    {
      title: '大三必须啃透的课',
      icon: 'courses',
      tone: CARD_TONES.purple,
      content: <Courses courses={direction.courses} />,
    },
    {
      title: '真实前景',
      icon: 'outlook',
      tone: CARD_TONES.blue,
      content: <DirectionParagraph>{direction.outlook}</DirectionParagraph>,
    },
    {
      title: '35岁风险',
      icon: 'risk',
      tone: CARD_TONES.orange,
      content: <DirectionParagraph>{direction.risk35}</DirectionParagraph>,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[leftCards, rightCards].map((column, index) => (
        <div key={index} className="space-y-6">
          {column.map((card) => (
            <DirectionInfoCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              tone={card.tone}
            >
              {card.content}
            </DirectionInfoCard>
          ))}
        </div>
      ))}
    </div>
  );
}
