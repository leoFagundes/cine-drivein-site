/**
 * Áudio do jogo com o menor atraso possível.
 *
 * - Efeitos curtos ficam decodificados em memória e tocam pelo Web Audio:
 *   saem na hora, podem se sobrepor, e o silêncio do começo do arquivo é
 *   cortado automaticamente (o coin.mp3, por exemplo, começa com ~185 ms mudos).
 * - A música (arquivo longo) vem por streaming num <audio>, roteado pelo
 *   Web Audio para o volume funcionar também no iPhone — lá `audio.volume`
 *   é ignorado.
 * - Navegadores só liberam som depois de um toque/tecla: `unlock()` deve ser
 *   chamado nesses eventos.
 */

export type SfxName = "eat" | "crash" | "countdown";

export interface SnakeAudioConfig {
  music?: { src: string; volume: number };
  sfx: Partial<Record<SfxName, { src: string; volume: number }>>;
}

const MUTE_KEY = "cdi_snake_muted";
/** Mantém alguns ms antes do primeiro som para não cortar o ataque. */
const ONSET_MARGIN_S = 0.004;
const MUSIC_FADE_S = 0.35;
/** Logo após liberar o áudio, o contexto leva alguns ms para "acordar". */
const RESUME_GRACE_MS = 400;

type AudioContextCtor = typeof AudioContext;
type OfflineAudioContextCtor = typeof OfflineAudioContext;

function audioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext ??
    null
  );
}

function offlineContextCtor(): OfflineAudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.OfflineAudioContext ??
    (window as unknown as { webkitOfflineAudioContext?: OfflineAudioContextCtor })
      .webkitOfflineAudioContext ??
    null
  );
}

/** Onde o som começa de fato (pula o silêncio inicial do MP3). */
function findOnset(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  if (peak === 0) return 0;
  const threshold = peak * 0.05;
  let i = 0;
  while (i < data.length && Math.abs(data[i]) < threshold) i++;
  return Math.max(0, i / buffer.sampleRate - ONSET_MARGIN_S);
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx = new Map<SfxName, { buffer: AudioBuffer; offset: number; volume: number }>();
  private music: HTMLAudioElement | null = null;
  private musicGain: GainNode | null = null;
  private musicPauseTimer = 0;
  private resumedAt = 0;
  /** O jogo quer a música tocando (corrida em andamento). */
  private musicWanted = false;
  private musicPrimed = false;
  private disposed = false;
  muted: boolean;

  constructor(private readonly config: SnakeAudioConfig) {
    this.muted = readMuted();
  }

  /**
   * Baixa e decodifica os efeitos já na abertura da página, num contexto
   * offline (não precisa de toque e não gera aviso de autoplay).
   */
  preload() {
    const Offline = offlineContextCtor();
    if (!Offline) return;
    const decoder = new Offline(1, 1, 44100);
    for (const [name, entry] of Object.entries(this.config.sfx) as [
      SfxName,
      { src: string; volume: number },
    ][]) {
      fetch(entry.src)
        .then((res) => res.arrayBuffer())
        .then(
          (data) =>
            new Promise<AudioBuffer>((resolve, reject) =>
              decoder.decodeAudioData(data, resolve, reject),
            ),
        )
        .then((buffer) => {
          if (!this.disposed) {
            this.sfx.set(name, { buffer, offset: findOnset(buffer), volume: entry.volume });
          }
        })
        .catch(() => {
          // sem esse efeito: o jogo segue mudo nesse ponto
        });
    }
  }

  /** Chamar dentro de um gesto do usuário (toque, clique, tecla). */
  unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state !== "running") {
      this.resumedAt = performance.now();
      void ctx.resume().catch(() => {});
    }

    const music = this.music;
    if (!music) return;
    if (this.musicWanted && !this.muted) {
      // A corrida já começou mas o play() tinha sido barrado: agora vai.
      if (music.paused) this.playMusicElement();
    } else if (!this.musicPrimed) {
      // iPhone: o <audio> só toca "sozinho" depois de um play() dentro de um gesto.
      this.musicPrimed = true;
      music.muted = true;
      music
        .play()
        .then(() => {
          if (!this.musicWanted || this.muted) music.pause();
          music.muted = false;
        })
        .catch(() => {
          music.muted = false;
          this.musicPrimed = false;
        });
    }
  }

  /** Toca um efeito imediatamente (se o áudio já estiver liberado). */
  play(name: SfxName) {
    if (this.muted) return;
    const ctx = this.ctx;
    const entry = this.sfx.get(name);
    if (!ctx || !this.master || !entry) return;
    // Suspenso há muito tempo (sem toque ainda): descarta em vez de tocar atrasado.
    if (ctx.state !== "running" && performance.now() - this.resumedAt > RESUME_GRACE_MS) return;
    const source = ctx.createBufferSource();
    source.buffer = entry.buffer;
    const gain = ctx.createGain();
    gain.gain.value = entry.volume;
    source.connect(gain);
    gain.connect(this.master);
    source.start(0, entry.offset);
  }

  /** Corrida começou (ou voltou da pausa): música entra com fade. */
  startMusic() {
    if (!this.config.music) return;
    this.musicWanted = true;
    if (!this.muted) this.playMusicElement();
  }

  /** Pausa, batida ou fim: a música sai com fade e continua dali na próxima. */
  stopMusic() {
    this.musicWanted = false;
    this.fadeOutMusic();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch {
      // preferência só nesta visita
    }
    if (muted) this.fadeOutMusic();
    else if (this.musicWanted) this.playMusicElement();
  }

  dispose() {
    this.disposed = true;
    window.clearTimeout(this.musicPauseTimer);
    if (this.music) {
      this.music.pause();
      this.music.removeAttribute("src");
      this.music.load();
    }
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }

  /* ───────────── internos ───────────── */

  private ensureContext(): AudioContext | null {
    if (this.ctx || this.disposed) return this.ctx;
    const Ctor = audioContextCtor();
    if (!Ctor) return null;
    const ctx = new Ctor({ latencyHint: "interactive" });
    const master = ctx.createGain();
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.resumedAt = performance.now();
    this.setupMusic(ctx, master);
    return ctx;
  }

  private setupMusic(ctx: AudioContext, master: GainNode) {
    const cfg = this.config.music;
    if (!cfg) return;
    const music = new Audio();
    music.src = cfg.src;
    music.loop = true;
    music.preload = "auto";
    try {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(music).connect(gain);
      gain.connect(master);
      this.musicGain = gain;
    } catch {
      music.volume = cfg.volume;
    }
    this.music = music;
  }

  private playMusicElement() {
    const music = this.music;
    const cfg = this.config.music;
    if (!music || !cfg) return;
    window.clearTimeout(this.musicPauseTimer);
    if (music.paused) void music.play().catch(() => {});
    this.rampMusic(cfg.volume);
  }

  private fadeOutMusic() {
    const music = this.music;
    if (!music || music.paused) return;
    this.rampMusic(0);
    window.clearTimeout(this.musicPauseTimer);
    this.musicPauseTimer = window.setTimeout(
      () => {
        if (!this.musicWanted || this.muted) music.pause();
      },
      this.musicGain ? MUSIC_FADE_S * 1000 + 30 : 0,
    );
  }

  private rampMusic(target: number) {
    const ctx = this.ctx;
    const gain = this.musicGain;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + MUSIC_FADE_S);
  }
}
