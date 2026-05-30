(() => {
  'use strict';

  const STORAGE_PREFIX = 'esportsTalent.v2.best.';
  const SUMMARY_KEY = 'esportsTalent.v2.summary';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const now = () => performance.now();

  const GAMES = {
    reaction: {
      id: 'reaction',
      code: 'RX',
      meta: 'REACTION',
      name: '反应速度',
      short: '极限反应校准',
      unit: 'ms',
      color: '#ff8a2a',
      lowerBetter: true,
      desc: '等待准星由红转绿后立刻点击。共 3 轮，取最快一次作为成绩。',
      tips: [['天才级', '< 180ms'], ['优秀', '< 220ms'], ['良好', '< 270ms'], ['需练习', '>= 270ms']],
      normalize: (score) => clamp(Math.round((360 - score) / 1.9), 0, 100),
      rank: (score) => score < 180 ? ['电竞天才', '神经反射像开了低延迟模式']
        : score < 220 ? ['潜力选手', '起枪、闪避、补枪都有优势']
        : score < 270 ? ['稳定玩家', '反应在线，继续练可见提升']
        : ['普通玩家', '先稳住节奏，再追求速度']
    },
    clickspeed: {
      id: 'clickspeed',
      code: 'APM',
      meta: 'ACTION RATE',
      name: '极限手速',
      short: '30 秒点击爆发',
      unit: '次',
      color: '#36d6c8',
      lowerBetter: false,
      desc: '30 秒内点中不断刷新的能量球。球会避开 HUD 和屏幕边缘，减少误触。',
      tips: [['天才级', '>= 80'], ['优秀', '>= 60'], ['良好', '>= 40'], ['需练习', '< 40']],
      normalize: (score) => clamp(Math.round(score * 1.25), 0, 100),
      rank: (score) => score >= 80 ? ['电竞天才', '爆发手速非常罕见']
        : score >= 60 ? ['潜力选手', '连续操作能力很强']
        : score >= 40 ? ['稳定玩家', '节奏不错，准确率还能再压榨']
        : ['普通玩家', '先追求稳点中，再提升频率']
    },
    vision: {
      id: 'vision',
      code: 'FOV',
      meta: 'FIELD AWARENESS',
      name: '视野广度',
      short: '瞬时数量捕捉',
      unit: '题',
      color: '#a78bfa',
      lowerBetter: false,
      desc: '圆点闪现 0.9 秒后消失，选择你看到的数量。共 3 轮，答案始终包含真实数量。',
      tips: [['天才级', '3/3'], ['优秀', '2/3'], ['入门', '1/3'], ['需练习', '0/3']],
      normalize: (score) => clamp(Math.round(score / 3 * 100), 0, 100),
      rank: (score) => score >= 3 ? ['电竞天才', '全局捕捉能力很强']
        : score >= 2 ? ['潜力选手', '观察面不错，临场还可更稳']
        : score >= 1 ? ['稳定玩家', '能抓重点，但容易漏边缘信息']
        : ['普通玩家', '建议先练扫视顺序']
    },
    tracking: {
      id: 'tracking',
      code: 'TRK',
      meta: 'DYNAMIC TRACKING',
      name: '动态追踪',
      short: '偏移跟随追踪',
      unit: '秒',
      color: '#ff5f9d',
      lowerBetter: false,
      desc: '手指在下方控制追踪圈，追踪圈会显示在手指上方，保持小球在圈内越久越好。',
      tips: [['天才级', '> 25s'], ['优秀', '> 15s'], ['良好', '> 8s'], ['需练习', '<= 8s']],
      normalize: (score) => clamp(Math.round(score * 4), 0, 100),
      rank: (score) => score > 25 ? ['电竞天才', '动态锁定能力非常强']
        : score > 15 ? ['潜力选手', '移动目标控制很稳']
        : score > 8 ? ['稳定玩家', '能跟住目标，后段还需更细']
        : ['普通玩家', '先放慢手指，跟球不追手']
    },
    memory: {
      id: 'memory',
      code: 'SEQ',
      meta: 'SEQUENCE MEMORY',
      name: '顺序记忆',
      short: '方向序列复现',
      unit: '步',
      color: '#43e38a',
      lowerBetter: false,
      desc: '记住方向键亮起顺序，然后按相同顺序点击。序列每轮增加 1 步。',
      tips: [['天才级', '>= 9'], ['优秀', '>= 7'], ['良好', '>= 5'], ['入门', '< 5']],
      normalize: (score) => clamp(Math.round(score / 10 * 100), 0, 100),
      rank: (score) => score >= 9 ? ['电竞天才', '短时记忆负载很高']
        : score >= 7 ? ['潜力选手', '复杂指令保持能力优秀']
        : score >= 5 ? ['稳定玩家', '记忆表现不错']
        : ['普通玩家', '可以用节奏分组记忆']
    },
    coordination: {
      id: 'coordination',
      code: 'HND',
      meta: 'HAND EYE',
      name: '手眼协调',
      short: '偏移滑块接球',
      unit: '个',
      color: '#ffe08a',
      lowerBetter: false,
      desc: '手指在下方控制滑块，滑块保持在手指上方，接住掉落能量球。',
      tips: [['天才级', '>= 20'], ['优秀', '>= 14'], ['良好', '>= 8'], ['入门', '< 8']],
      normalize: (score) => clamp(Math.round(score * 5), 0, 100),
      rank: (score) => score >= 20 ? ['电竞天才', '手眼同步几乎没有迟滞']
        : score >= 14 ? ['潜力选手', '轨迹预判能力优秀']
        : score >= 8 ? ['稳定玩家', '能稳定接住核心目标']
        : ['普通玩家', '先提前移动，不要等球落到底']
    }
  };

  class Store {
    getSummary() {
      try {
        return JSON.parse(localStorage.getItem(SUMMARY_KEY) || '{}');
      } catch (_) {
        return {};
      }
    }

    saveResult(gameId, score) {
      const config = GAMES[gameId];
      const bestKey = STORAGE_PREFIX + gameId;
      const previousBest = localStorage.getItem(bestKey);
      const previousNum = previousBest === null ? null : Number(previousBest);
      const isNewBest = previousNum === null || (config.lowerBetter ? score < previousNum : score > previousNum);
      const best = isNewBest ? score : previousNum;
      localStorage.setItem(bestKey, String(best));

      const [rank] = config.rank(score);
      const summary = this.getSummary();
      summary[gameId] = {
        score,
        best,
        normalizedScore: config.normalize(score),
        rank,
        updatedAt: Date.now()
      };
      localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
      return { best, isNewBest, summary };
    }
  }

  class App {
    constructor() {
      this.store = new Store();
      this.currentGameId = 'reaction';
      this.currentGame = null;
      this.screens = {
        home: document.getElementById('homeScreen'),
        rule: document.getElementById('ruleScreen'),
        game: document.getElementById('gameScreen'),
        result: document.getElementById('resultScreen'),
        report: document.getElementById('reportScreen'),
        error: document.getElementById('errorScreen')
      };
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.radarCanvas = document.getElementById('radarCanvas');
      this.radarCtx = this.radarCanvas.getContext('2d');
      this.bind();
      this.renderHome();
      this.show('home');
    }

    bind() {
      document.getElementById('backToHomeBtn').addEventListener('click', () => this.showHome());
      document.getElementById('homeBtn').addEventListener('click', () => this.showHome());
      document.getElementById('startTestBtn').addEventListener('click', () => this.startGame(this.currentGameId));
      document.getElementById('retryBtn').addEventListener('click', () => this.startGame(this.currentGameId));
      document.getElementById('reportBtn').addEventListener('click', () => this.showReport());
      document.getElementById('openReportBtn').addEventListener('click', () => this.showReport());
      document.getElementById('reportBackBtn').addEventListener('click', () => this.showHome());
      document.getElementById('reloadBtn').addEventListener('click', () => this.showHome());
      window.addEventListener('resize', () => this.resizeGame());
      window.addEventListener('error', () => this.show('error'));
      window.addEventListener('unhandledrejection', () => this.show('error'));
    }

    show(name) {
      Object.values(this.screens).forEach((screen) => screen.classList.remove('is-active'));
      this.screens[name].classList.add('is-active');
      if (name !== 'game' && this.currentGame) {
        this.currentGame.cleanup();
        this.currentGame = null;
      }
    }

    showHome() {
      this.renderHome();
      this.show('home');
    }

    renderHome() {
      const summary = this.store.getSummary();
      const grid = document.getElementById('gameGrid');
      grid.innerHTML = Object.values(GAMES).map((game) => {
        const item = summary[game.id];
        const progress = item ? item.normalizedScore : 0;
        return `
          <button class="game-card" type="button" data-game="${game.id}" style="--game-color:${game.color}; --progress:${progress}%">
            <span class="game-code">${game.code}</span>
            <h3>${game.name}</h3>
            <p>${game.short}</p>
            <span class="game-progress"><span></span></span>
          </button>`;
      }).join('');
      grid.querySelectorAll('.game-card').forEach((card) => {
        card.addEventListener('click', () => this.openRule(card.dataset.game));
      });

      const values = Object.values(summary);
      const completed = values.length;
      const avg = completed ? Math.round(values.reduce((sum, item) => sum + item.normalizedScore, 0) / completed) : 0;
      document.getElementById('completedCount').textContent = `${completed}/6`;
      document.getElementById('talentTitle').textContent = completed ? this.overallRank(avg) : '未校准';
    }

    openRule(gameId) {
      this.currentGameId = gameId;
      const game = GAMES[gameId];
      document.getElementById('ruleCode').textContent = game.code;
      document.getElementById('ruleMeta').textContent = game.meta;
      document.getElementById('ruleTitle').textContent = game.name;
      document.getElementById('ruleDesc').textContent = game.desc;
      document.getElementById('ruleTips').innerHTML = game.tips
        .map(([label, value]) => `<div class="tip-row"><span>${label}</span><strong>${value}</strong></div>`)
        .join('');
      this.show('rule');
    }

    startGame(gameId) {
      this.show('game');
      this.resizeGame();
      const GameClass = GAME_CLASSES[gameId];
      this.currentGame = new GameClass({
        canvas: this.canvas,
        ctx: this.ctx,
        width: this.logicalWidth,
        height: this.logicalHeight,
        config: GAMES[gameId],
        end: (score) => this.finishGame(gameId, score)
      });
      this.currentGame.start();
    }

    resizeGame() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.logicalWidth = Math.max(320, rect.width);
      this.logicalHeight = Math.max(560, rect.height);
      this.canvas.width = Math.round(this.logicalWidth * dpr);
      this.canvas.height = Math.round(this.logicalHeight * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (this.currentGame) this.currentGame.resize(this.logicalWidth, this.logicalHeight);
    }

    finishGame(gameId, score) {
      const saved = this.store.saveResult(gameId, score);
      this.currentGame = null;
      this.renderResult(gameId, score, saved);
      this.show('result');
    }

    renderResult(gameId, score, saved) {
      const game = GAMES[gameId];
      const [rank, sub] = game.rank(score);
      const index = game.normalize(score);
      document.getElementById('resultMeta').textContent = game.meta;
      document.getElementById('resultGameName').textContent = game.name;
      document.getElementById('resultScore').textContent = score;
      document.getElementById('resultUnit').textContent = game.unit;
      document.getElementById('resultRank').textContent = rank;
      document.getElementById('resultRankSub').textContent = saved.isNewBest ? `${sub}。新纪录已写入本机档案。` : sub;
      document.getElementById('resultBest').textContent = `${saved.best}${game.unit}`;
      document.getElementById('resultIndex').textContent = index;
    }

    showReport() {
      this.renderReport();
      this.show('report');
    }

    renderReport() {
      const summary = this.store.getSummary();
      const rows = Object.values(GAMES).map((game) => ({ game, data: summary[game.id] || null }));
      const completed = rows.filter((row) => row.data).length;
      const avg = completed
        ? Math.round(rows.reduce((sum, row) => sum + (row.data ? row.data.normalizedScore : 0), 0) / completed)
        : 0;
      document.getElementById('overallScore').textContent = avg;
      document.getElementById('overallRank').textContent = completed ? this.overallRank(avg) : '完成任意测试后生成';
      document.getElementById('reportList').innerHTML = rows.map(({ game, data }) => {
        const progress = data ? data.normalizedScore : 0;
        const score = data ? `${data.score}${game.unit}` : '未测试';
        return `
          <div class="report-row" style="--row-color:${game.color}; --progress:${progress}%">
            <code>${game.code}</code>
            <div>
              <h3>${game.name}</h3>
              <div class="meter"><span></span></div>
            </div>
            <strong>${score}</strong>
          </div>`;
      }).join('');
      this.drawRadar(rows.map((row) => row.data ? row.data.normalizedScore : 0));
    }

    drawRadar(values) {
      const canvas = this.radarCanvas;
      const ctx = this.radarCtx;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2 + 8;
      const radius = Math.min(w, h) * 0.34;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(186,196,214,0.18)';
      ctx.fillStyle = 'rgba(54,214,200,0.18)';

      for (let ring = 1; ring <= 4; ring++) {
        this.pathRadar(ctx, Array(6).fill(radius * ring / 4), cx, cy, 0);
        ctx.stroke();
      }
      this.pathRadar(ctx, values.map((value) => radius * value / 100), cx, cy, 0);
      ctx.fill();
      ctx.strokeStyle = '#36d6c8';
      ctx.lineWidth = 2;
      ctx.stroke();

      Object.values(GAMES).forEach((game, i) => {
        const angle = -Math.PI / 2 + i * Math.PI * 2 / 6;
        ctx.fillStyle = game.color;
        ctx.font = '700 11px Arial';
        ctx.textAlign = Math.cos(angle) > 0.2 ? 'left' : Math.cos(angle) < -0.2 ? 'right' : 'center';
        ctx.textBaseline = Math.sin(angle) > 0.2 ? 'top' : 'bottom';
        ctx.fillText(game.code, cx + Math.cos(angle) * (radius + 20), cy + Math.sin(angle) * (radius + 18));
      });
    }

    pathRadar(ctx, radii, cx, cy, rotate) {
      ctx.beginPath();
      radii.forEach((r, i) => {
        const angle = -Math.PI / 2 + rotate + i * Math.PI * 2 / radii.length;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    }

    overallRank(score) {
      if (score >= 88) return '职业苗子';
      if (score >= 72) return '潜力选手';
      if (score >= 55) return '稳定玩家';
      return '待开发';
    }
  }

  class BaseGame {
    constructor({ canvas, ctx, width, height, config, end }) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.config = config;
      this.endCallback = end;
      this.ended = false;
      this.frame = 0;
      this.last = now();
      this.listeners = [];
    }

    start() {
      this.loop();
    }

    resize(width, height) {
      this.width = width;
      this.height = height;
    }

    add(type, handler, options) {
      this.canvas.addEventListener(type, handler, options);
      this.listeners.push([type, handler, options]);
    }

    cleanup() {
      cancelAnimationFrame(this.frame);
      this.listeners.forEach(([type, handler, options]) => this.canvas.removeEventListener(type, handler, options));
      this.listeners = [];
      this.ended = true;
    }

    loop() {
      const t = now();
      const dt = Math.min(0.04, (t - this.last) / 1000 || 0);
      this.last = t;
      this.update(dt, t);
      this.render(t);
      if (!this.ended) this.frame = requestAnimationFrame(() => this.loop());
    }

    end(score) {
      if (this.ended) return;
      this.cleanup();
      this.endCallback(score);
    }

    pointer(e) {
      const rect = this.canvas.getBoundingClientRect();
      const source = e.touches && e.touches[0] ? e.touches[0] : e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
      return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top,
        active: Boolean(e.touches ? e.touches.length : e.buttons || e.type.includes('down') || e.type.includes('start'))
      };
    }

    clear() {
      const ctx = this.ctx;
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.lineWidth = 1;
      for (let x = 0; x < this.width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      for (let y = 0; y < this.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
    }

    hud(left, center, right) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgba(5,7,12,0.72)';
      ctx.fillRect(0, 0, this.width, 66);
      ctx.fillStyle = this.config.color;
      ctx.font = '800 13px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(left, 16, 27);
      ctx.fillStyle = '#bac4d6';
      ctx.textAlign = 'center';
      ctx.fillText(center || '', this.width / 2, 27);
      ctx.textAlign = 'right';
      ctx.fillText(right || '', this.width - 16, 27);
      ctx.restore();
    }

    text(text, x, y, size, color = '#f4f7fb', weight = 800) {
      const ctx = this.ctx;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
    }
  }

  class ReactionGame extends BaseGame {
    start() {
      this.state = 'idle';
      this.round = 0;
      this.maxRounds = 3;
      this.best = Infinity;
      this.readyAt = 0;
      this.timer = 0;
      this.message = '点击开始';
      const tap = (e) => {
        e.preventDefault();
        this.tap();
      };
      this.add('pointerdown', tap);
      this.add('touchstart', tap, { passive: false });
      super.start();
    }

    tap() {
      if (this.state === 'idle') return this.nextRound();
      if (this.state === 'waiting') {
        clearTimeout(this.timer);
        this.message = '太快了';
        this.state = 'idle';
        this.timer = setTimeout(() => this.nextRound(), 850);
        return;
      }
      if (this.state === 'ready') {
        const score = Math.round(now() - this.readyAt);
        this.best = Math.min(this.best, score);
        this.message = `${score}ms`;
        this.state = 'scored';
        this.timer = setTimeout(() => this.nextRound(), 850);
      }
    }

    nextRound() {
      this.round += 1;
      if (this.round > this.maxRounds) return this.end(this.best);
      this.state = 'waiting';
      this.message = '等待绿灯';
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.state = 'ready';
        this.readyAt = now();
        this.message = 'GO';
      }, 1200 + Math.random() * 2200);
    }

    cleanup() {
      clearTimeout(this.timer);
      super.cleanup();
    }

    update() {}

    render(t) {
      this.clear();
      const cx = this.width / 2;
      const cy = this.height / 2;
      const color = this.state === 'ready' ? '#43e38a' : this.state === 'scored' ? '#36d6c8' : '#ff4f5e';
      const pulse = 1 + Math.sin(t * 0.006) * 0.05;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 50 * pulse, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 84, cy);
      this.ctx.lineTo(cx - 24, cy);
      this.ctx.moveTo(cx + 24, cy);
      this.ctx.lineTo(cx + 84, cy);
      this.ctx.moveTo(cx, cy - 84);
      this.ctx.lineTo(cx, cy - 24);
      this.ctx.moveTo(cx, cy + 24);
      this.ctx.lineTo(cx, cy + 84);
      this.ctx.stroke();
      this.text(this.message, cx, cy + 118, this.state === 'ready' ? 40 : 24, color);
      this.hud('反应速度', `第 ${Math.min(this.round || 1, this.maxRounds)} / ${this.maxRounds} 轮`, this.best < Infinity ? `最佳 ${this.best}ms` : '');
    }
  }

  class ClickSpeedGame extends BaseGame {
    start() {
      this.score = 0;
      this.timeLeft = 30;
      this.balls = [];
      this.particles = [];
      this.spawnTimer = 0;
      this.last = now();
      const tap = (e) => {
        e.preventDefault();
        this.hit(this.pointer(e));
      };
      this.add('pointerdown', tap);
      this.add('touchstart', tap, { passive: false });
      for (let i = 0; i < 4; i++) this.spawn();
      super.start();
    }

    spawn() {
      const r = 24 + Math.random() * 10;
      this.balls.push({
        x: 34 + Math.random() * (this.width - 68),
        y: 92 + Math.random() * (this.height - 158),
        r,
        a: Math.random() * Math.PI * 2
      });
    }

    hit(p) {
      for (let i = this.balls.length - 1; i >= 0; i--) {
        const b = this.balls[i];
        if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 16) {
          this.score += 1;
          this.burst(b.x, b.y, this.config.color);
          this.balls.splice(i, 1);
          this.spawn();
          return;
        }
      }
    }

    burst(x, y, color) {
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2;
        this.particles.push({ x, y, vx: Math.cos(a) * 180, vy: Math.sin(a) * 180, life: 0.5, color });
      }
    }

    update(dt) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) return this.end(this.score);
      while (this.balls.length < 4) this.spawn();
      this.particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      });
      this.particles = this.particles.filter((p) => p.life > 0);
    }

    render(t) {
      this.clear();
      this.balls.forEach((b) => {
        b.a += 0.05;
        const pulse = 0.9 + Math.sin(t * 0.006 + b.a) * 0.1;
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(54,214,200,0.12)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.9 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      this.particles.forEach((p) => {
        this.ctx.globalAlpha = clamp(p.life / 0.5, 0, 1);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      });
      this.text(String(this.score), this.width / 2, 116, 58, this.config.color);
      this.hud('极限手速', '点中能量球', `${Math.ceil(this.timeLeft)}s`);
    }
  }

  class VisionGame extends BaseGame {
    start() {
      this.round = 0;
      this.maxRounds = 3;
      this.correct = 0;
      this.state = 'idle';
      this.dots = [];
      this.correctCountForRound = 0;
      this.answers = [];
      this.message = '点击开始';
      this.timer = 0;
      const tap = (e) => {
        e.preventDefault();
        this.tap(this.pointer(e));
      };
      this.add('pointerdown', tap);
      this.add('touchstart', tap, { passive: false });
      super.start();
    }

    tap(p) {
      if (this.state === 'idle') return this.nextRound();
      if (this.state !== 'answering') return;
      const hit = this.answerBoxes().find((box) => p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h);
      if (!hit) return;
      const ok = hit.value === this.correctCountForRound;
      if (ok) this.correct += 1;
      this.message = ok ? '正确' : `答案 ${this.correctCountForRound}`;
      this.state = 'feedback';
      this.timer = setTimeout(() => this.nextRound(), 950);
    }

    nextRound() {
      this.round += 1;
      if (this.round > this.maxRounds) return this.end(this.correct);
      this.correctCountForRound = 3 + Math.floor(Math.random() * 7);
      this.answers = this.makeAnswers(this.correctCountForRound);
      this.dots = this.makeDots(this.correctCountForRound);
      this.state = 'showing';
      this.timer = setTimeout(() => {
        this.dots = [];
        this.state = 'answering';
      }, 900);
    }

    makeAnswers(answer) {
      const pool = new Set([answer]);
      while (pool.size < 4) pool.add(clamp(answer + Math.floor(Math.random() * 5) - 2, 1, 12));
      return Array.from(pool).sort((a, b) => a - b);
    }

    makeDots(count) {
      const dots = [];
      const colors = ['#ff8a2a', '#36d6c8', '#a78bfa', '#ff5f9d', '#43e38a', '#ffe08a'];
      for (let i = 0; i < count; i++) {
        let x = 0;
        let y = 0;
        let attempts = 0;
        do {
          x = 38 + Math.random() * (this.width - 76);
          y = 92 + Math.random() * (this.height - 250);
          attempts += 1;
        } while (attempts < 60 && dots.some((d) => Math.hypot(x - d.x, y - d.y) < 42));
        dots.push({ x, y, r: 12, color: colors[i % colors.length] });
      }
      return dots;
    }

    answerBoxes() {
      const gap = 8;
      const count = this.answers.length;
      const w = Math.min(74, (this.width - 36 - gap * (count - 1)) / count);
      const total = w * count + gap * (count - 1);
      const y = this.height - 126;
      return this.answers.map((value, i) => ({ value, x: (this.width - total) / 2 + i * (w + gap), y, w, h: 54 }));
    }

    cleanup() {
      clearTimeout(this.timer);
      super.cleanup();
    }

    update() {}

    render() {
      this.clear();
      if (this.state === 'idle') {
        this.text(this.message, this.width / 2, this.height / 2, 25, this.config.color);
        this.text('圆点闪现后选择数量', this.width / 2, this.height / 2 + 38, 14, '#8591a7', 700);
      }
      if (this.state === 'showing') {
        this.dots.forEach((dot) => {
          this.ctx.fillStyle = dot.color;
          this.ctx.beginPath();
          this.ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = dot.color;
          this.ctx.globalAlpha = 0.35;
          this.ctx.lineWidth = 8;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        });
      }
      if (this.state === 'answering') {
        this.text('?', this.width / 2, this.height / 2 - 20, 76, this.config.color);
        this.text('刚才出现了几个圆点？', this.width / 2, this.height / 2 + 48, 16, '#bac4d6', 800);
        this.answerBoxes().forEach((box) => {
          this.ctx.fillStyle = 'rgba(167,139,250,0.14)';
          this.ctx.strokeStyle = 'rgba(167,139,250,0.48)';
          this.roundRect(box.x, box.y, box.w, box.h, 8, true);
          this.text(String(box.value), box.x + box.w / 2, box.y + box.h / 2 + 1, 22, '#f4f7fb');
        });
      }
      if (this.state === 'feedback') {
        this.text(this.message, this.width / 2, this.height / 2, 32, this.config.color);
      }
      this.hud('视野广度', `第 ${Math.min(this.round || 1, this.maxRounds)} / ${this.maxRounds} 轮`, `正确 ${this.correct}`);
    }

    roundRect(x, y, w, h, r, fill) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      if (fill) ctx.fill();
      ctx.stroke();
    }
  }

  class TrackingGame extends BaseGame {
    start() {
      this.controlOffsetY = Math.min(118, this.height * 0.16);
      this.ball = { x: this.width / 2, y: this.height / 2, vx: 120, vy: -90 };
      this.target = { x: this.width / 2, y: this.height / 2 };
      this.finger = { x: this.width / 2, y: this.height / 2 + this.controlOffsetY };
      this.radius = 62;
      this.elapsed = 0;
      this.state = 'countdown';
      this.countdown = 3;
      this.countTimer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(this.countTimer);
          this.state = 'playing';
          this.last = now();
        }
      }, 1000);
      const move = (e) => {
        e.preventDefault();
        const p = this.pointer(e);
        this.finger.x = p.x;
        this.finger.y = p.y;
        this.target.x = clamp(p.x, 30, this.width - 30);
        this.target.y = clamp(p.y - this.controlOffsetY, 86, this.height - 120);
      };
      this.add('pointerdown', move);
      this.add('pointermove', move);
      this.add('touchstart', move, { passive: false });
      this.add('touchmove', move, { passive: false });
      super.start();
    }

    cleanup() {
      clearInterval(this.countTimer);
      super.cleanup();
    }

    update(dt) {
      if (this.state !== 'playing') return;
      this.elapsed += dt;
      const speed = 135 + this.elapsed * 10;
      const current = Math.hypot(this.ball.vx, this.ball.vy);
      this.ball.vx = this.ball.vx / current * speed;
      this.ball.vy = this.ball.vy / current * speed;
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      if (this.ball.x < 24 || this.ball.x > this.width - 24) this.ball.vx *= -1;
      if (this.ball.y < 88 || this.ball.y > this.height - 96) this.ball.vy *= -1;
      this.ball.x = clamp(this.ball.x, 24, this.width - 24);
      this.ball.y = clamp(this.ball.y, 88, this.height - 96);
      this.radius = Math.max(38, 62 - this.elapsed * 0.55);
      if (Math.hypot(this.ball.x - this.target.x, this.ball.y - this.target.y) > this.radius) {
        this.end(Number(this.elapsed.toFixed(1)));
      }
    }

    render() {
      this.clear();
      const ctx = this.ctx;
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.finger.x, this.finger.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.stroke();
      ctx.strokeStyle = this.config.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.target.x, this.target.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,95,157,0.12)';
      ctx.fill();
      ctx.fillStyle = '#ff8a2a';
      ctx.beginPath();
      ctx.arc(this.ball.x, this.ball.y, 17, 0, Math.PI * 2);
      ctx.fill();
      if (this.state === 'countdown') {
        this.text(this.countdown > 0 ? String(this.countdown) : 'GO', this.width / 2, this.height / 2, 78, this.config.color);
        this.text('手指放在下方，圆圈会显示在上方', this.width / 2, this.height / 2 + 78, 14, '#bac4d6', 700);
      }
      this.hud('动态追踪', this.state === 'playing' ? `${this.elapsed.toFixed(1)}s` : '偏移跟随校准', `半径 ${Math.round(this.radius)}`);
    }
  }

  class MemoryGame extends BaseGame {
    start() {
      this.buttons = [];
      this.sequence = [];
      this.input = [];
      this.score = 0;
      this.showingIndex = 0;
      this.state = 'showing';
      this.layoutButtons();
      const tap = (e) => {
        e.preventDefault();
        this.tap(this.pointer(e));
      };
      this.add('pointerdown', tap);
      this.add('touchstart', tap, { passive: false });
      this.addToSequence();
      this.showSequence();
      super.start();
    }

    resize(w, h) {
      super.resize(w, h);
      this.layoutButtons();
    }

    layoutButtons() {
      const size = Math.min(86, this.width * 0.22);
      const cx = this.width / 2;
      const cy = this.height / 2 + 8;
      const gap = size * 1.05;
      this.buttons = [
        { dir: 'up', label: 'UP', x: cx - size / 2, y: cy - gap - size / 2, size },
        { dir: 'down', label: 'DN', x: cx - size / 2, y: cy + gap - size / 2, size },
        { dir: 'left', label: 'LT', x: cx - gap - size / 2, y: cy - size / 2, size },
        { dir: 'right', label: 'RT', x: cx + gap - size / 2, y: cy - size / 2, size }
      ];
    }

    addToSequence() {
      const dirs = ['up', 'down', 'left', 'right'];
      this.sequence.push(dirs[Math.floor(Math.random() * dirs.length)]);
    }

    showSequence() {
      this.state = 'showing';
      this.input = [];
      this.showingIndex = 0;
      const step = () => {
        if (this.showingIndex >= this.sequence.length) {
          this.state = 'input';
          return;
        }
        const dir = this.sequence[this.showingIndex];
        const button = this.buttons.find((b) => b.dir === dir);
        button.flash = now() + 320;
        this.showingIndex += 1;
        this.timer = setTimeout(step, 560);
      };
      this.timer = setTimeout(step, 420);
    }

    tap(p) {
      if (this.state !== 'input') return;
      const b = this.buttons.find((button) => p.x >= button.x && p.x <= button.x + button.size && p.y >= button.y && p.y <= button.y + button.size);
      if (!b) return;
      b.flash = now() + 220;
      this.input.push(b.dir);
      const idx = this.input.length - 1;
      if (this.input[idx] !== this.sequence[idx]) {
        this.state = 'wrong';
        this.timer = setTimeout(() => this.end(this.score), 900);
        return;
      }
      if (this.input.length === this.sequence.length) {
        this.score = this.sequence.length;
        this.addToSequence();
        this.timer = setTimeout(() => this.showSequence(), 520);
      }
    }

    cleanup() {
      clearTimeout(this.timer);
      super.cleanup();
    }

    update() {}

    render(t) {
      this.clear();
      this.buttons.forEach((b) => {
        const active = b.flash && b.flash > t;
        this.ctx.fillStyle = active ? 'rgba(67,227,138,0.26)' : 'rgba(67,227,138,0.08)';
        this.ctx.strokeStyle = active ? this.config.color : 'rgba(67,227,138,0.3)';
        this.ctx.lineWidth = 2;
        this.roundRect(b.x, b.y, b.size, b.size, 10);
        this.text(b.label, b.x + b.size / 2, b.y + b.size / 2, 20, active ? '#f4f7fb' : this.config.color);
      });
      const msg = this.state === 'showing' ? `记住 ${this.showingIndex}/${this.sequence.length}` : this.state === 'input' ? `输入 ${this.input.length}/${this.sequence.length}` : '错误';
      this.text(msg, this.width / 2, this.height / 2 + 4, 22, this.state === 'wrong' ? '#ff4f5e' : '#bac4d6');
      this.hud('顺序记忆', `当前 ${this.score} 步`, '大触控区');
    }

    roundRect(x, y, w, h, r) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
      ctx.stroke();
    }
  }

  class CoordinationGame extends BaseGame {
    start() {
      this.controlOffsetY = Math.min(120, this.height * 0.16);
      this.score = 0;
      this.timeLeft = 30;
      this.paddle = { x: this.width / 2 - 58, y: this.height - 168, w: 116, h: 16 };
      this.finger = { x: this.width / 2, y: this.height - 48 };
      this.balls = [];
      this.particles = [];
      this.spawnClock = 0;
      const move = (e) => {
        e.preventDefault();
        const p = this.pointer(e);
        this.finger = p;
        this.paddle.x = clamp(p.x - this.paddle.w / 2, 12, this.width - this.paddle.w - 12);
        this.paddle.y = clamp(p.y - this.controlOffsetY, this.height * 0.48, this.height - 130);
      };
      this.add('pointerdown', move);
      this.add('pointermove', move);
      this.add('touchstart', move, { passive: false });
      this.add('touchmove', move, { passive: false });
      this.spawn();
      super.start();
    }

    spawn() {
      const speed = 145 + (30 - this.timeLeft) * 5;
      this.balls.push({
        x: 28 + Math.random() * (this.width - 56),
        y: 74,
        r: 12,
        vx: (Math.random() - 0.5) * 55,
        vy: speed
      });
    }

    update(dt) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) return this.end(this.score);
      this.spawnClock -= dt;
      const interval = Math.max(0.42, 1.05 - (30 - this.timeLeft) * 0.018);
      if (this.spawnClock <= 0) {
        this.spawnClock = interval;
        this.spawn();
      }
      this.balls.forEach((b) => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vy += 90 * dt;
        if (b.x < b.r || b.x > this.width - b.r) b.vx *= -1;
      });
      for (let i = this.balls.length - 1; i >= 0; i--) {
        const b = this.balls[i];
        const p = this.paddle;
        if (b.y + b.r >= p.y && b.y - b.r <= p.y + p.h && b.x >= p.x && b.x <= p.x + p.w) {
          this.score += 1;
          this.burst(b.x, p.y);
          this.balls.splice(i, 1);
        } else if (b.y > this.height + 30) {
          this.balls.splice(i, 1);
        }
      }
      this.particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      });
      this.particles = this.particles.filter((p) => p.life > 0);
    }

    burst(x, y) {
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        this.particles.push({ x, y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120, life: 0.45 });
      }
    }

    render() {
      this.clear();
      const ctx = this.ctx;
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(this.finger.x, this.finger.y);
      ctx.lineTo(this.paddle.x + this.paddle.w / 2, this.paddle.y + this.paddle.h / 2);
      ctx.stroke();
      ctx.fillStyle = this.config.color;
      this.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 8);
      this.balls.forEach((b) => {
        ctx.fillStyle = '#ff8a2a';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      this.particles.forEach((p) => {
        ctx.globalAlpha = clamp(p.life / 0.45, 0, 1);
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      this.text(String(this.score), this.width / 2, 116, 54, this.config.color);
      this.text('滑块在手指上方，视野不遮挡', this.width / 2, this.height - 48, 13, '#8591a7', 700);
      this.hud('手眼协调', '偏移接球', `${Math.ceil(this.timeLeft)}s`);
    }

    roundRect(x, y, w, h, r) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
    }
  }

  const GAME_CLASSES = {
    reaction: ReactionGame,
    clickspeed: ClickSpeedGame,
    vision: VisionGame,
    tracking: TrackingGame,
    memory: MemoryGame,
    coordination: CoordinationGame
  };

  document.addEventListener('DOMContentLoaded', () => {
    try {
      new App();
    } catch (_) {
      document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('is-active'));
      document.getElementById('errorScreen').classList.add('is-active');
    }
  });
})();
