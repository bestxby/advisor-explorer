/**
 * HardwareProfile — pure utility for GPU/CPU capability detection.
 *
 * Returns a quality tier ('low' | 'medium' | 'high') and the corresponding
 * rendering parameters. No side effects, no DOM access beyond feature detection.
 */

export function detectHardwareQuality() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  let gpuName = '';

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
    }
  } catch {
    // Safe fallback
  }

  const gpuLower = gpuName.toLowerCase();

  // Extremely low-end (weak cores or very old integrated graphics)
  if (cores <= 2 || gpuLower.includes('mali-t') || gpuLower.includes('adreno (tm) 3') || gpuLower.includes('intel hd')) {
    return 'low';
  }

  // Medium-end (general mobiles, office laptops with integrated UHD/Iris Xe graphics)
  if (isMobile || cores <= 4 || gpuLower.includes('intel') || gpuLower.includes('uhd') || gpuLower.includes('iris') || gpuLower.includes('amd radeon(tm) graphics')) {
    return 'medium';
  }

  // High-end (Desktops, Apple Silicon M-series, Nvidia RTX/GTX, AMD RX discrete cards)
  return 'high';
}

export function getQualityProfile(quality) {
  console.log(`[ThreeParticleEngine] Hardware profile: ${quality.toUpperCase()}`);

  switch (quality) {
    case 'low':
      return {
        particleCount: 30000,
        dustCount: 1000,
        enableBloom: false,
        pixelRatioCap: 1.0,
        pointSizeMultiplier: 1.4,
      };
    case 'medium':
    case 'high':
    default:
      return {
        particleCount: 110000,
        dustCount: 6000,
        enableBloom: true,
        pixelRatioCap: Math.min(window.devicePixelRatio, 2.0),
        pointSizeMultiplier: 1.0,
      };
  }
}
