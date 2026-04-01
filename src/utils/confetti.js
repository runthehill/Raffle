/**
 * Canvas-based confetti particle system.
 */

const COLORS = ['#FFD700', '#FF1493', '#00BFFF', '#FF4444', '#FFFFFF', '#FF6600', '#00FF88'];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = -Math.random() * 18 - 5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.size = Math.random() * 8 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 15;
    this.gravity = 0.4;
    this.drag = 0.98;
    this.opacity = 1;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.width = this.shape === 'rect' ? this.size * (0.5 + Math.random()) : this.size;
    this.height = this.shape === 'rect' ? this.size * (1 + Math.random()) : this.size;
  }

  update() {
    this.vx *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.005;
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
    // Burst from center-top area
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;
    burst(cx, cy, 250);

    // Additional bursts from sides
    burst(cx - 200, cy + 50, 75);
    burst(cx + 200, cy + 50, 75);

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
