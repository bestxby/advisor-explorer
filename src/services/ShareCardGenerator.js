export class ShareCardGenerator {
  static generate(results, directions, professors, filename = 'advisor-explorer-share') {
    const top = results[0];
    if (!top) return;

    const canvas = document.createElement('canvas');
    const baseW = 800;
    const baseH = 1000;
    const scale = 3; // 3x Ultra-HD Retina-ready resolution scaling (2400x3000px)

    canvas.width = baseW * scale;
    canvas.height = baseH * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, baseW, baseH);
    bgGrad.addColorStop(0, '#0b0f19');
    bgGrad.addColorStop(0.5, '#121829');
    bgGrad.addColorStop(1, '#1b1429');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, baseW, baseH);

    // 2. Grids
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 800; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1000);
      ctx.stroke();
    }
    for (let j = 0; j < 1000; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(800, j);
      ctx.stroke();
    }

    // 3. Ambient Glow spheres
    const glowGrad1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 350);
    glowGrad1.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    glowGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad1;
    ctx.beginPath();
    ctx.arc(200, 300, 350, 0, Math.PI * 2);
    ctx.fill();

    const glowGrad2 = ctx.createRadialGradient(600, 700, 50, 600, 700, 300);
    glowGrad2.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
    glowGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad2;
    ctx.beginPath();
    ctx.arc(600, 700, 300, 0, Math.PI * 2);
    ctx.fill();

    // 4. Card frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, 40, 40, 720, 920, 24, true, true);

    // 5. Header Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 14px "Outfit", sans-serif';
    ctx.fillText('ADVISOR EXPLORER · MATCH REPORT', 80, 100);

    // Icon Box
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    this.roundRect(ctx, 80, 130, 48, 48, 12, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('🗺️', 90, 163);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('学术匹配分享卡', 144, 163);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(720, 210);
    ctx.stroke();

    // 6. Matched Result
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px sans-serif';
    ctx.fillText('我的理想体系结构研究方向', 80, 260);

    // Gradient Direction Title
    const textGrad = ctx.createLinearGradient(80, 300, 500, 300);
    textGrad.addColorStop(0, '#60a5fa');
    textGrad.addColorStop(1, '#a78bfa');
    ctx.fillStyle = textGrad;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(top.directionName, 80, 325);

    // Score capsule
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    this.roundRect(ctx, 80, 355, 180, 42, 10, true, true);
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`匹配得分 ${top.score}%`, 110, 382);

    // Vector Point mesh
    this.drawConstellation(ctx, 560, 310);

    // 7. Key Strengths
    if (top.strengths?.length) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('🎯 核心方向优势依据', 80, 470);

      let offset = 505;
      top.strengths.slice(0, 3).forEach(strength => {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        this.roundRect(ctx, 80, offset, 640, 64, 12, true, true);

        // Green check
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓', 105, offset + 40);

        // Strengths text
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(strength.label, 140, offset + 38);

        offset += 84;
      });
    }

    // 8. Footer Info & QR Placeholders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '14px sans-serif';
    ctx.fillText('长按或扫码开启你的 Advisor Explorer 个性化学术方向对比', 80, 890);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    this.roundRect(ctx, 630, 810, 90, 90, 14, true, true);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.fillRect(642, 822, 24, 24);
    ctx.fillRect(684, 822, 24, 24);
    ctx.fillRect(642, 864, 24, 24);
    ctx.fillRect(676, 854, 10, 10);
    ctx.fillRect(684, 874, 14, 10);
    ctx.fillRect(672, 868, 8, 16);

    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `${filename}.png`;
    anchor.click();
  }

  static roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  static drawConstellation(ctx, cx, cy) {
    const pts = [
      { x: cx - 40, y: cy - 50 },
      { x: cx + 25, y: cy - 70 },
      { x: cx + 75, y: cy - 15 },
      { x: cx - 5, y: cy + 40 },
      { x: cx - 65, y: cy + 10 },
      { x: cx + 45, y: cy + 45 },
    ];

    ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }

    pts.forEach(p => {
      ctx.fillStyle = 'rgba(167, 139, 250, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
