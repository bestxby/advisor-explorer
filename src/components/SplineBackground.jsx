import Spline from '@splinetool/react-spline';
import { useTheme } from '../context/useTheme';

export default function SplineBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 w-full h-full z-[-2]">
      <div className="absolute inset-0 bg-surface dark:bg-[#070b14]" />

      <Spline
        scene="https://prod.spline.design/o3CrLeRN7iu6rBNI/scene.splinecode"
      />

      {/* Light overlay — let bloom and glow effects show through */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      )}
      {theme === 'light' && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />
      )}

      {/* Vignette — dark edges to frame the 3D scene */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}
