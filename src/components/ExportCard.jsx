import roadmapData from '../data/roadmap.json';

const PHASE_COLORS = [
  { bg: '#3b82f6', light: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  { bg: '#6366f1', light: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  { bg: '#8b5cf6', light: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
];

const PRIORITY_STYLES = {
  high: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', label: '必做' },
  medium: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', label: '建议' },
  low: { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb', label: '可选' },
};

/** Inline styles — no Tailwind, so html-to-image captures them correctly */
export default function ExportCard({ results, directions, professors, isDark }) {
  if (!results || results.length === 0) return null;

  const top = results[0];
  const topDir = directions.find((d) => d.id === top.direction);
  const topProfessors = professors.filter((p) => p.directionId === top.direction).slice(0, 3);
  const roadmap = roadmapData[top.direction];

  // ── colour palette (matches app gradient) ──────────────────────────────────
  const bg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const headerGradient = isDark
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)';
  const sectionBg = isDark ? '#1e293b' : '#f8fafc';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const primaryColor = '#3b82f6';
  const accentColor = '#f59e0b';

  return (
    <div
      style={{
        width: 900,
        background: bg,
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        fontSize: 14,
        lineHeight: 1.6,
        color: textPrimary,
        overflow: 'hidden',
        borderRadius: 20,
        boxShadow: isDark
          ? '0 25px 50px rgba(0,0,0,0.6)'
          : '0 25px 50px rgba(0,0,0,0.15)',
      }}
    >
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: headerGradient,
          padding: '36px 40px 28px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
              ADVISOR EXPLORER · 计算机体系结构方向导航
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
              个性化方向匹配报告
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
              基于问卷智能匹配 · 清华北大导师数据库
            </div>
          </div>
          {/* badge */}
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '10px 18px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: accentColor }}>{top.score}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>最佳匹配度</div>
          </div>
        </div>

        {/* Match result bars */}
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          {results.map((r, i) => (
            <div
              key={r.direction}
              style={{
                flex: i === 0 ? 2 : 1,
                background: i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${i === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 10,
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? accentColor : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: i === 0 ? '#000' : '#fff', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: i === 0 ? 13 : 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.75)' }}>{r.directionName}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? accentColor : 'rgba(255,255,255,0.6)' }}>{r.score}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.score}%`, background: i === 0 ? accentColor : 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 40px 36px' }}>

        {/* Section: Direction Detail */}
        {topDir && (
          <div style={{ marginBottom: 28 }}>
            <SectionHeader title="最佳匹配方向详解" icon="🎯" primaryColor={primaryColor} textPrimary={textPrimary} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <InfoCard icon="💼" title="日常在干什么" content={topDir.dailyWork} cardBg={sectionBg} border={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <InfoCard icon="🚀" title="真实前景" content={topDir.outlook} cardBg={sectionBg} border={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <InfoCard icon="🔥" title="核心痛点" content={topDir.corePainPoint} cardBg={sectionBg} border={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <InfoCard icon="🛡️" title="你的护城河" content={topDir.moat} cardBg={sectionBg} border={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            </div>

            {/* Courses */}
            <div style={{ marginTop: 12, background: sectionBg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: textSecondary, marginBottom: 8 }}>📚 大三必修核心课</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {topDir.courses.map((c) => (
                  <span key={c} style={{ background: isDark ? '#1e3a8a30' : '#eff6ff', color: primaryColor, border: `1px solid ${isDark ? '#1e40af60' : '#bfdbfe'}`, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Recommended Professors */}
        {topProfessors.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <SectionHeader title="最适合你的导师推荐" icon="👨‍🏫" primaryColor={primaryColor} textPrimary={textPrimary} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {topProfessors.map((prof, i) => (
                <ProfessorRow key={prof.id} prof={prof} rank={i} isDark={isDark} cardBg={sectionBg} border={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} primaryColor={primaryColor} accentColor={accentColor} />
              ))}
            </div>
          </div>
        )}

        {/* Section: Roadmap */}
        {roadmap && (
          <div>
            <SectionHeader title="行动路线图" icon="🗺️" primaryColor={primaryColor} textPrimary={textPrimary} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {roadmap.phases.map((phase, phaseIdx) => {
                const c = PHASE_COLORS[phaseIdx] || PHASE_COLORS[0];
                return (
                  <div key={phaseIdx} style={{ background: sectionBg, border: `1px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden' }}>
                    {/* Phase header */}
                    <div style={{ background: c.bg, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: c.bg, border: `2px solid rgba(255,255,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{phaseIdx + 1}</div>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{phase.period}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginLeft: 8 }}>{phase.subtitle}</span>
                      </div>
                    </div>
                    {/* Tasks */}
                    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {phase.tasks.map((task, ti) => {
                        const ps = PRIORITY_STYLES[task.priority];
                        return (
                          <div key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ flexShrink: 0, marginTop: 1, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}`, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{ps.label}</span>
                            <span style={{ fontSize: 12, color: textPrimary, lineHeight: 1.5 }}>{task.text}</span>
                          </div>
                        );
                      })}
                      {/* Milestone */}
                      <div style={{ marginTop: 6, background: c.light, border: `1px solid ${c.border}`, borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0 }}>⭐</span>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>阶段目标 </span>
                          <span style={{ fontSize: 12, color: isDark ? c.text : '#374151' }}>{phase.milestone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: textSecondary }}>由 Advisor Explorer 生成 · 数据来源：清华北大官网及公开论文</div>
          <div style={{ fontSize: 11, color: textSecondary }}>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, primaryColor, textPrimary }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: textPrimary, margin: 0 }}>{title}</h3>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${primaryColor}40, transparent)`, marginLeft: 4 }} />
    </div>
  );
}

function InfoCard({ icon, title, content, cardBg, border, textPrimary, textSecondary }) {
  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: textSecondary, marginBottom: 5 }}>{icon} {title}</div>
      <div style={{ fontSize: 12, color: textPrimary, lineHeight: 1.6 }}>{content}</div>
    </div>
  );
}

function ProfessorRow({ prof, rank, isDark, cardBg, border, textPrimary, textSecondary, primaryColor, accentColor }) {
  const rankColors = ['#f59e0b', '#6b7280', '#92400e'];
  const rankColor = rankColors[rank] || '#6b7280';
  return (
    <div style={{ background: cardBg, border: `1px solid ${rank === 0 ? primaryColor + '60' : border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: rank === 0 ? primaryColor : (isDark ? '#334155' : '#e2e8f0'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: rank === 0 ? '#fff' : textSecondary, flexShrink: 0 }}>
        {rank === 0 ? '★' : prof.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: textPrimary }}>{prof.name}</span>
          <span style={{ fontSize: 11, color: textSecondary }}>{prof.university} · {prof.department}</span>
          {rank === 0 && <span style={{ fontSize: 10, background: accentColor + '20', color: accentColor, border: `1px solid ${accentColor}60`, borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>推荐首选</span>}
        </div>
        <div style={{ fontSize: 12, color: textSecondary, marginTop: 3, marginBottom: 6 }}>{prof.tagline}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {prof.realDirections.slice(0, 3).map((d) => (
            <span key={d} style={{ fontSize: 10, background: isDark ? '#1e3a8a30' : '#eff6ff', color: primaryColor, border: `1px solid ${isDark ? '#1e40af50' : '#bfdbfe'}`, borderRadius: 4, padding: '2px 7px' }}>{d}</span>
          ))}
          <span style={{ fontSize: 10, background: isDark ? '#33415540' : '#f1f5f9', color: textSecondary, border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`, borderRadius: 4, padding: '2px 7px' }}>适合: {prof.suitableFor.slice(0, 20)}…</span>
        </div>
      </div>
    </div>
  );
}
