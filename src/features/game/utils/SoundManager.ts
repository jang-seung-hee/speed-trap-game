export class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private bgmAudio: HTMLAudioElement | null = null;
    private bgmFiles: string[] = [
        '/Come Get With Us - TrackTribe.mp3',
        '/KnockOut - TrackTribe.mp3'
    ];
    private currentBgmIndex: number = -1;
    private shutterBuffer: AudioBuffer | null = null; // 셔터 사운드 버퍼 캐싱

    constructor() {
        if (typeof window !== 'undefined') {
            // 음소거 상태를 sessionStorage에서 복원 (탭 닫으면 리셋)
            const savedMuteState = sessionStorage.getItem('gameMuted');
            this.isMuted = savedMuteState === 'true';

            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.preloadShutterSound(); // 셔터 사운드 미리 생성
            }

            // BGM 초기화
            this.bgmAudio = new Audio();
            this.bgmAudio.volume = 0.5;
            this.bgmAudio.muted = this.isMuted; // 초기 음소거 상태 적용

            // 한 곡이 끝나면 자동으로 다음 곡(랜덤) 재생
            this.bgmAudio.addEventListener('ended', () => {
                this.playRandomTrack();
            });
        }
    }

    private getContext(): AudioContext | null {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) this.ctx = new AudioContextClass();
        }
        return this.ctx;
    }

    public resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 셔터 사운드 버퍼 미리 생성 (성능 최적화)
    private preloadShutterSound() {
        const ctx = this.getContext();
        if (!ctx) return;

        const bufferSize = ctx.sampleRate * 0.1; // 0.1 sec
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        this.shutterBuffer = buffer;
    }

    // 셔터음 (White Noise Burst) - 최적화 버전
    public playShutter() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        // 버퍼가 없으면 즉시 생성 (fallback)
        if (!this.shutterBuffer) {
            this.preloadShutterSound();
            if (!this.shutterBuffer) return;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = this.shutterBuffer;
        const gain = ctx.createGain();

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    }

    // 성공음 (High Pitch Ding)
    public playSuccess() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    // 실패/경고음 (Low Buzz)
    public playFail() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    // 레벨업 (Fanfare)
    public playLevelUp() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;

            const time = now + i * 0.1;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.3);
        });
    }

    // UI 버튼 클릭음 (Short Blip)
    public playClick() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    // 체력 회복 (Healing Chime)
    public playHeal() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    // 최대 체력 증가 (Power Up Fanfare)
    public playPowerUp() {
        const ctx = this.getContext();
        if (!ctx || this.isMuted) return;

        const now = ctx.currentTime;
        const freqs = [440, 554, 659, 880]; // A major arpeggio

        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = f;

            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
        });
    }

    // --- BGM System (Mixed Playlist) ---

    private playRandomTrack() {
        if (!this.bgmAudio) return;

        // 현재 곡과 다른 곡을 틀기 위해 랜덤 로직 개선 (2곡이라 toggle에 가까움)
        let nextIndex = Math.floor(Math.random() * this.bgmFiles.length);

        // 만약 곡이 2개 이상이고, 방금 튼 곡과 같다면 다시 뽑기 (최소한의 셔플 효과)
        if (this.bgmFiles.length > 1 && nextIndex === this.currentBgmIndex) {
            nextIndex = (nextIndex + 1) % this.bgmFiles.length;
        }

        this.currentBgmIndex = nextIndex;
        this.bgmAudio.src = this.bgmFiles[nextIndex];
        this.bgmAudio.muted = this.isMuted;
        this.bgmAudio.play().catch(e => console.log('BGM Play failed:', e));
    }

    public playBGM() {
        if (this.bgmAudio && !this.isMuted) {
            this.bgmAudio.muted = this.isMuted;
            // 재생 중이 아닐 때만 재생 시작 (처음 시작 or 재개)
            if (this.bgmAudio.paused) {
                // 아직 아무 곡도 선택 안 되었으면 랜덤 선택
                if (this.currentBgmIndex === -1) {
                    this.playRandomTrack();
                } else {
                    this.bgmAudio.play().catch(e => console.log('BGM Resume failed:', e));
                }
            }
        }
    }

    public stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            // 멈추되, 다음 재생 시 이어서 할지 처음부터 할지는 기획 의도에 따름.
            // 여기서는 게임 종료/타이틀 복귀 시 멈추는 것이므로, 
            // 아예 초기화하지 않고 pause만 해서 'toggleMute' 같은 상황에 대비하되,
            // 게임 재진입(GameStage mount)시 playBGM이 호출되는데 그때는 이어지는 게 자연스러울 수 있음.
            // 다만, 사용자가 "TitleScreen -> GameStage"로 갈 때마다 새로운 BGM을 원할 수도 있음.
            // 현재 구조상 GameStage 언마운트 시 stopBGM이 호출됨. 
            // 만약 매번 새로운 판마다 랜덤을 원하면 여기서 currentTime = 0 및 index 초기화를 해야 함.

            // 타이틀로 나갈 때 음악을 끄는 로직이라면 초기화가 맞음.
            this.bgmAudio.currentTime = 0;
            this.currentBgmIndex = -1; // 다음 playBGM 때 새로 뽑도록
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;

        // sessionStorage에 저장 (탭 닫으면 리셋)
        sessionStorage.setItem('gameMuted', String(this.isMuted));

        if (this.bgmAudio) {
            this.bgmAudio.muted = this.isMuted;

            // 음소거 해제 시 BGM이 일시정지 상태면 재생
            if (!this.isMuted && this.bgmAudio.paused) {
                this.playBGM();
            }
            // 음소거 시 BGM 일시정지
            else if (this.isMuted && !this.bgmAudio.paused) {
                this.bgmAudio.pause();
            }
        }

        return this.isMuted;
    }

    public toggleBGM(): boolean {
        if (!this.bgmAudio) return false;

        if (this.bgmAudio.paused) {
            this.playBGM();
            return true; // BGM ON
        } else {
            this.bgmAudio.pause();
            return false; // BGM OFF
        }
    }

    public isBGMPlaying(): boolean {
        return this.bgmAudio ? !this.bgmAudio.paused : false;
    }
}

export const soundManager = new SoundManager();
