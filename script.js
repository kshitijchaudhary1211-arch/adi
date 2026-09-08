// JavaScript for Aditi Yadav's Birthday Website

// --- 1. COUNTDOWN TIMER ---
function updateCountdown() {
    const now = new Date();
    // Target date: September 8th 2026
    let targetYear = now.getFullYear();
    let birthdayDate = new Date(targetYear, 8, 8, 0, 0, 0); // Month is 0-indexed (8 = September)

    // If Sep 8 has already passed this year, set for next year
    if (now > birthdayDate && (now.getMonth() !== 8 || now.getDate() !== 8)) {
        birthdayDate = new Date(targetYear + 1, 8, 8, 0, 0, 0);
    }

    const isBirthdayToday = (now.getMonth() === 8 && now.getDate() === 8);

    if (isBirthdayToday) {
        document.getElementById('countdownGrid').classList.add('hidden');
        document.getElementById('birthdayCelebrationMessage').classList.remove('hidden');
        document.getElementById('statusBadge').innerText = "🎉 It's Today!";
        document.getElementById('statusBadge').className = "text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold animate-pulse";
        document.getElementById('heroTitle').innerText = "HAPPY BIRTHDAY ADITI! 👑🎂";
        triggerConfettiBurst();
        return;
    }

    const diff = birthdayDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();


// --- 2. BACKGROUND CANVAS (FLOATING HEARTS & STARS) ---
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.type = Math.random() > 0.4 ? 'heart' : 'star';
        this.color = this.type === 'heart' ? '#fb7185' : '#fbbf24';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -30) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        if (this.type === 'heart') {
            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(this.x, this.y + topCurveHeight);
            // top left curve
            ctx.bezierCurveTo(
                this.x, this.y, 
                this.x - this.size / 2, this.y, 
                this.x - this.size / 2, this.y + topCurveHeight
            );
            // bottom left curve
            ctx.bezierCurveTo(
                this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                this.x, this.y + this.size, 
                this.x, this.y + this.size
            );
            // bottom right curve
            ctx.bezierCurveTo(
                this.x, this.y + this.size, 
                this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                this.x + this.size / 2, this.y + topCurveHeight
            );
            // top right curve
            ctx.bezierCurveTo(
                this.x + this.size / 2, this.y, 
                this.x, this.y, 
                this.x, this.y + topCurveHeight
            );
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw Sparkle Star
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

for (let i = 0; i < 35; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


// --- 3. 3D FLIP CARDS LISTENER ---
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});


// --- 4. LOVE LETTER & LIGHTBOX MODALS ---
function openLetterModal() {
    const modal = document.getElementById('letterModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('modal-open');
    }, 10);
}

function closeLetterModal() {
    const modal = document.getElementById('letterModal');
    modal.classList.remove('modal-open');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function openLightbox(title, desc, src) {
    document.getElementById('lightboxTitle').innerText = title;
    document.getElementById('lightboxDesc').innerText = desc;
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxModal').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.add('hidden');
}


// --- 5. INTERACTIVE BIRTHDAY CAKE CANDLES ---
let candlesLit = { 1: true, 2: true, 3: true };

function toggleCandle(id) {
    const flameG = document.getElementById(`flame${id}`);
    if (flameG) {
        candlesLit[id] = !candlesLit[id];
        if (candlesLit[id]) {
            flameG.classList.remove('extinguished');
        } else {
            flameG.classList.add('extinguished');
        }
    }
    checkAllCandlesExtinguished();
}

function blowOutAllCandles() {
    for (let id = 1; id <= 3; id++) {
        candlesLit[id] = false;
        const flameG = document.getElementById(`flame${id}`);
        if (flameG) flameG.classList.add('extinguished');
    }
    triggerConfettiBurst();
    const btn = document.getElementById('blowCandlesBtn');
    btn.innerHTML = `✨ Wish Granted! 🎉`;
    btn.className = "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg inline-flex items-center gap-2";
}

function checkAllCandlesExtinguished() {
    const allOut = !candlesLit[1] && !candlesLit[2] && !candlesLit[3];
    if (allOut) {
        triggerConfettiBurst();
        const btn = document.getElementById('blowCandlesBtn');
        btn.innerHTML = `✨ Wish Granted! 🎉`;
        btn.className = "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg inline-flex items-center gap-2";
    }
}

function triggerConfettiBurst() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}


// --- 6. ADITI TRIVIA LOVE QUIZ ---
const quizData = [
    {
        question: "What makes Aditi Yadav truly one of a kind? 💖",
        options: [
            { text: "Her irresistible smile 😊", correct: true },
            { text: "Her warm and caring heart 💕", correct: true },
            { text: "Her adorable sense of humor ✨", correct: true },
            { text: "All of the above! (She is perfect 🥰)", correct: true }
        ]
    },
    {
        question: "What is the best way to celebrate Aditi's Birthday? 🎂",
        options: [
            { text: "With endless love, hugs, and cake! 🍰", correct: true },
            { text: "Making every wish she has come true ✨", correct: true },
            { text: "Surrounding her with joy and smiles 💖", correct: true }
        ]
    },
    {
        question: "How much is Aditi loved? 🚀",
        options: [
            { text: "To the moon and back! 🌙", correct: false },
            { text: "More than all the stars in the galaxy ✨", correct: false },
            { text: "Beyond infinity & forever! 💖", correct: true }
        ]
    }
];

let currentQuestion = 0;
let quizScore = 0;

function renderQuiz() {
    const container = document.getElementById('quizOptions');
    const questionEl = document.getElementById('quizQuestion');
    const progressEl = document.getElementById('quizProgress');
    const scoreBadge = document.getElementById('quizScoreBadge');

    if (currentQuestion >= quizData.length) {
        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('quizResult').classList.remove('hidden');
        document.getElementById('quizResultMessage').innerText = `You scored ${quizScore}/${quizData.length * 100}! You are officially the sweetest girlfriend in the world! 💕`;
        triggerConfettiBurst();
        return;
    }

    const item = quizData[currentQuestion];
    questionEl.innerText = item.question;
    progressEl.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;
    scoreBadge.innerText = `Score: ${quizScore}`;

    container.innerHTML = '';
    item.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left bg-rose-50/70 hover:bg-rose-100/90 text-slate-800 font-semibold px-5 py-3.5 rounded-2xl border border-pink-200 transition-all flex items-center justify-between group";
        btn.innerHTML = `
            <span>${opt.text}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform"></i>
        `;
        btn.onclick = () => {
            if (opt.correct) quizScore += 100;
            currentQuestion++;
            renderQuiz();
            if (window.lucide) lucide.createIcons();
        };
        container.appendChild(btn);
    });
}

function resetQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    document.getElementById('quizContainer').classList.remove('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    renderQuiz();
}

renderQuiz();


// --- 7. ROMANTIC MELODY AUDIO SYNTHESIZER (WEB AUDIO API) ---
let audioCtx = null;
let isPlayingMelody = false;
let melodyInterval = null;

function playMelodyNote(freq, duration) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e){}
}

const chordProgression = [
    [261.63, 329.63, 392.00], // C major
    [220.00, 261.63, 329.63], // A minor
    [174.61, 220.00, 261.63], // F major
    [196.00, 246.94, 293.66]  // G major
];

let chordStep = 0;

function toggleMusic() {
    const musicText = document.getElementById('musicText');
    const musicIcon = document.getElementById('musicIcon');

    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }

    if (isPlayingMelody) {
        clearInterval(melodyInterval);
        isPlayingMelody = false;
        musicText.innerText = "Play Romantic Melody 🎵";
        musicIcon.className = "p-1 bg-pink-100 rounded-full";
    } else {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        isPlayingMelody = true;
        musicText.innerText = "Playing Melody 💕 (Pause)";
        musicIcon.className = "p-1 bg-rose-200 text-rose-700 rounded-full animate-spin";

        melodyInterval = setInterval(() => {
            const chord = chordProgression[chordStep % chordProgression.length];
            chord.forEach((freq, i) => {
                setTimeout(() => playMelodyNote(freq, 1.8), i * 300);
            });
            chordStep++;
        }, 1600);
    }
}

document.getElementById('musicToggleBtn').addEventListener('click', toggleMusic);
