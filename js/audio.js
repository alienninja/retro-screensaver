// ============================================================
// RETROAUDIO: Procedural Web Audio API Sound Synthesizer
// Zero external audio files — 100% synthesized in real time!
// ============================================================

class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.muted = false;
        this.volume = 0.7;
        this.initialized = false;

        // Restore saved volume and mute
        try {
            const savedVol = localStorage.getItem('retro_volume');
            if (savedVol !== null) this.volume = parseFloat(savedVol);
            const savedMute = localStorage.getItem('retro_muted');
            if (savedMute !== null) this.muted = savedMute === 'true';
        } catch (e) {}

        // Listen for first user interaction to resume/unlock audio context
        const unlock = () => {
            this.ensureContext();
            ['click', 'keydown', 'touchstart'].forEach(evt => 
                document.removeEventListener(evt, unlock)
            );
        };
        ['click', 'keydown', 'touchstart'].forEach(evt => 
            document.addEventListener(evt, unlock, { once: true })
        );
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            this.ctx = new AudioCtx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        try { localStorage.setItem('retro_volume', this.volume); } catch (e) {}
        if (this.masterGain && this.ctx && !this.muted) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    setMuted(muted) {
        this.muted = !!muted;
        try { localStorage.setItem('retro_muted', this.muted); } catch (e) {}
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    // ── Helper Tone Synthesizer ─────────────────────────────
    playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.3, detune = 0, fadeOut = true) {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        if (fadeOut) {
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        }

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    // ── Win98 Startup Chime (Synthesized Pentatonic Progression) ─
    playStartup() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;

        const now = ctx.currentTime + 0.05;

        // Chords & Arpeggio inspired by Ken Kato's Win98 sound
        // Chord 1 (Fmaj9): F2, C3, A3, C4, E4
        // Chord 2 (Bbmaj7): Bb2, F3, D4, F4, A4
        // Chord 3 (Cadd9): C3, G3, E4, G4, D5
        // Ending bell chime: G5, C6
        const chords = [
            { time: 0.0,  duration: 1.6, notes: [87.31, 130.81, 220.00, 261.63, 329.63] },
            { time: 1.0,  duration: 1.8, notes: [116.54, 174.61, 293.66, 349.23, 440.00] },
            { time: 2.2,  duration: 2.5, notes: [130.81, 196.00, 329.63, 392.00, 587.33] }
        ];

        chords.forEach(c => {
            c.notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

                osc.type = (i === 0) ? 'triangle' : (i % 2 === 0 ? 'sine' : 'sawtooth');
                osc.frequency.setValueAtTime(freq, now + c.time);
                osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now + c.time);

                const noteVol = (i === 0) ? 0.25 : 0.12;
                gain.gain.setValueAtTime(0.001, now + c.time);
                gain.gain.linearRampToValueAtTime(noteVol, now + c.time + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + c.time + c.duration);

                if (pan) {
                    pan.pan.setValueAtTime((i / (c.notes.length - 1)) * 1.2 - 0.6, now + c.time);
                    osc.connect(gain);
                    gain.connect(pan);
                    pan.connect(this.masterGain);
                } else {
                    osc.connect(gain);
                    gain.connect(this.masterGain);
                }

                osc.start(now + c.time);
                osc.stop(now + c.time + c.duration + 0.1);
            });
        });

        // Twinkling bells at climax
        const bells = [
            { t: 2.2, f: 523.25 }, // C5
            { t: 2.4, f: 659.25 }, // E5
            { t: 2.6, f: 783.99 }, // G5
            { t: 2.8, f: 1046.50 }, // C6
            { t: 3.2, f: 1318.51 }  // E6
        ];
        bells.forEach(b => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(b.f, now + b.t);
            gain.gain.setValueAtTime(0.15, now + b.t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + b.t + 1.2);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + b.t);
            osc.stop(now + b.t + 1.3);
        });
    }

    // ── Win98 Chord (Error / Warning) ──────────────────────
    playChord() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        // Classic chord.wav: Rich brassy minor/suspended chord (C3 + G3 + C4 + Eb4)
        const freqs = [130.81, 196.00, 261.63, 311.13];
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = (i === 0) ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(f, now);
            osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.95);
        });
    }

    // ── Win98 Ding (Information) ───────────────────────────
    playDing() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        // Pure bell chime around 1046 Hz (C6) with harmonic
        [1046.5, 2093.0].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(i === 0 ? 0.3 : 0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.85);
        });
    }

    // ── Win98 Exclamation / Asterisk ───────────────────────
    playExclamation() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        // Two quick ascending bells: F#5 -> C#6
        [ { t: 0, f: 739.99 }, { t: 0.12, f: 1108.73 } ].forEach(b => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(b.f, now + b.t);
            gain.gain.setValueAtTime(0.25, now + b.t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + b.t + 0.4);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + b.t);
            osc.stop(now + b.t + 0.45);
        });
    }

    // ── UI Click ───────────────────────────────────────────
    playClick() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.035);
    }

    // ── Floppy Drive Seek Noise (Drive A:) ─────────────────
    playFloppy() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;

        // Sequence of mechanical stepper clicks
        const clicks = [0, 0.06, 0.12, 0.18, 0.28, 0.34, 0.45, 0.52, 0.60, 0.72, 0.85];
        clicks.forEach(t => {
            // High frequency friction click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(240 + Math.random() * 80, now + t);
            gain.gain.setValueAtTime(0.12, now + t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.025);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + t);
            osc.stop(now + t + 0.03);

            // Low frequency mechanical thud
            const thud = ctx.createOscillator();
            const thudGain = ctx.createGain();
            thud.type = 'triangle';
            thud.frequency.setValueAtTime(90, now + t);
            thudGain.gain.setValueAtTime(0.18, now + t);
            thudGain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.035);
            thud.connect(thudGain);
            thudGain.connect(this.masterGain);
            thud.start(now + t);
            thud.stop(now + t + 0.04);
        });
    }

    // ── Defrag HDD Head Seek Click ─────────────────────────
    playDefragSeek() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(450 + Math.random() * 300, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.015);
    }

    // ── DVD Corner Hit Victory Chime 🎉 ─────────────────────
    playDvdHit() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.2, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.65);
        });
    }

    // ── Solitaire Card Snap ────────────────────────────────
    playCardSnap() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.045);
    }

    // ── BSOD Hardware Beep ─────────────────────────────────
    playCrashBeep() {
        const ctx = this.ensureContext();
        if (!ctx || this.muted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.55);
    }
}

// Global Singleton
window.RetroAudio = new RetroAudioEngine();
