const intro = document.querySelector('#intro'), card = document.querySelector('#card'), openBtn = document.querySelector('#openBtn');
const heart = document.querySelector('#flowerHeart'), message = document.querySelector('#message'), soundBtn = document.querySelector('#soundBtn');
let audioCtx, playing = false, startTime;

document.querySelector('#today').textContent = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());

// Phủ kín lòng trái tim bằng hoa để hai thùy tròn đều và phần chóp rõ nét.
let flowerCount = 0;
while (flowerCount < 900) {
  const x = -1.18 + Math.random() * 2.36;
  const y = -1.08 + Math.random() * 2.32;
  const inside = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;
  if (!inside) continue;
  const f = document.createElement('i'); f.className = 'flower';
  f.style.left = `${50 + x * 40}%`; f.style.top = `${51 - y * 39}%`;
  f.style.setProperty('--delay', `${.45 + Math.random() * 2.8}s`);
  f.style.setProperty('--size', `${7 + Math.random() * 5}px`);
  f.style.opacity = .72 + Math.random() * .28;
  heart.appendChild(f); flowerCount++;
}

const wishes = [
  'Gửi Xuân Hương — cô gái đáng iu dịu dàng của anhh,',
  'Chúc người anh yêu tuổi mới luôn rạng rỡ như những bông hoa này,',
  'Mỗi ngày đều có thật nhiều niềm vui, may mắn và bình an.',
  'Mong mọi điều bạn ước sẽ dần trở thành hiện thực.',
  'Chúc mừng sinh nhật em iuu! 🎂✨'
];
function showWishes(i = 0) { if (i >= wishes.length) return; const p = document.createElement('p'); p.textContent = wishes[i]; message.appendChild(p); setTimeout(() => showWishes(i + 1), 720) }

function dropHeart() {
  const p = document.createElement('span');
  p.className = 'petal'; p.textContent = '❤';
  p.style.left = Math.random() * 100 + '%'; p.style.top = '-25px';
  p.style.fontSize = 8 + Math.random() * 13 + 'px';
  p.style.color = Math.random() > .45 ? '#ff5f91' : '#ffc94a';
  p.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
  const duration = 4 + Math.random() * 3;
  p.style.animationDuration = duration + 's';
  card.appendChild(p);
  setTimeout(() => p.remove(), duration * 1000 + 200);
}
function startHeartRain() {
  for (let i = 0; i < 12; i++)setTimeout(dropHeart, i * 120);
  setInterval(dropHeart, 280);
}

openBtn.addEventListener('click', () => { intro.classList.add('hide'); card.classList.add('show'); card.setAttribute('aria-hidden', 'false'); startTime = Date.now(); playMusic(); setTimeout(showWishes, 850); setTimeout(startHeartRain, 500); setInterval(updateCounter, 1000) });

function updateCounter() { const s = Math.floor((Date.now() - startTime) / 1000); document.querySelector('#minutes').textContent = String(Math.floor(s / 60)).padStart(2, '0'); document.querySelector('#seconds').textContent = String(s % 60).padStart(2, '0') }

// Giai điệu ngắn tạo bằng Web Audio, không cần tệp nhạc bên ngoài.
function playMusic() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); playing = true; soundBtn.classList.add('playing'); melody() }
function melody() { if (!playing) return; const notes = [261.6, 261.6, 293.7, 261.6, 349.2, 329.6, 261.6, 261.6, 293.7, 261.6, 392, 349.2, 261.6, 261.6, 523.3, 440, 349.2, 329.6, 293.7, 466.2, 466.2, 440, 349.2, 392, 349.2]; let now = audioCtx.currentTime; notes.forEach((n, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = 'sine'; o.frequency.value = n; g.gain.setValueAtTime(0, now + i * .28); g.gain.linearRampToValueAtTime(.055, now + i * .28 + .025); g.gain.exponentialRampToValueAtTime(.001, now + i * .28 + .25); o.connect(g).connect(audioCtx.destination); o.start(now + i * .28); o.stop(now + i * .28 + .27) }); setTimeout(melody, 7600) }
soundBtn.addEventListener('click', () => { if (!card.classList.contains('show')) return; if (playing) { playing = false; soundBtn.classList.remove('playing') } else playMusic() });

// Nền sao lấp lánh.
const canvas = document.querySelector('#stars'), ctx = canvas.getContext('2d'); let stars = [];
function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); stars = Array.from({ length: 85 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.6, a: Math.random(), v: .003 + Math.random() * .012 })) }
function draw() { ctx.clearRect(0, 0, innerWidth, innerHeight); stars.forEach(s => { s.a += s.v; if (s.a > 1 || s.a < .1) s.v *= -1; ctx.globalAlpha = s.a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill() }); requestAnimationFrame(draw) }
addEventListener('resize', resize); resize(); draw();
