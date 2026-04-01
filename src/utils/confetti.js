/**
 * Canvas-based confetti particle system.
 */

const COLORS = [
  '#FFD700', '#FF2D78', '#00E5FF', '#39FF14', '#BF40FF',
  '#FF6B2B', '#FF4444', '#FFFFFF', '#FF69B4', '#7B68EE',
];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 24;
    this.vy = -Math.random() * 20 - 6;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.size = Math.random() * 10 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 18;
    this.gravity = 0.35;
    this.drag = 0.98;
    this.opacity = 1;
    this.shape = Math.random() > 0.6 ? 'rect' : Math.random() > 0.3 ? 'circle' : 'star';
    this.width = this.shape === 'rect' ? this.size * (0.5 + Math.random()) : this.size;
    this.height = this.shape === 'rect' ? this.size * (1 + Math.random()) : this.size;
  }

  update() {
    this.vx *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.004;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else if (this.shape === 'star') {
      drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  get alive() {
    return this.opacity > 0 && this.y < window.innerHeight + 100;
  }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

export function createConfettiSystem(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const burst = (x, y, count = 200) => {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    particles = particles.filter(p => p.alive);

    if (particles.length > 0) {
      animId = requestAnimationFrame(animate);
    } else {
      animId = null;
    }
  };

  const fire = () => {
    resize();
    // Big center burst
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;
    burst(cx, cy, 300);

    // Side bursts for width coverage
    burst(cx - 250, cy + 50, 100);
    burst(cx + 250, cy + 50, 100);

    // Top corners
    burst(canvas.width * 0.15, cy - 30, 50);
    burst(canvas.width * 0.85, cy - 30, 50);

    if (!animId) {
      animId = requestAnimationFrame(animate);
    }
  };

  const destroy = () => {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    particles = [];
    window.removeEventListener('resize', resize);
  };

  window.addEventListener('resize', resize);
  resize();

  return { fire, destroy, resize };
}
