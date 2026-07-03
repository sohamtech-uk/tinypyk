export type TinyPykSound = {
  name: string;
  track: string;
  label: string;
  frequency: number;
  duration: number;
  wave: OscillatorType;
  color: string;
};

export const musicSounds: TinyPykSound[] = [
  {
    name: 'Drum Beat',
    track: 'Drums',
    label: 'Drum',
    frequency: 110,
    duration: 0.45,
    wave: 'square',
    color: '#ef4444',
  },
  {
    name: 'Guitar Chord',
    track: 'Guitar',
    label: 'Guitar',
    frequency: 196,
    duration: 0.65,
    wave: 'sawtooth',
    color: '#f97316',
  },
  {
    name: 'Bass Intro',
    track: 'Bass',
    label: 'Bass',
    frequency: 82,
    duration: 0.7,
    wave: 'triangle',
    color: '#22c55e',
  },
  {
    name: 'Keys Intro',
    track: 'Keys',
    label: 'Keys',
    frequency: 330,
    duration: 0.6,
    wave: 'sine',
    color: '#3b82f6',
  },
  {
    name: 'Soft Bell',
    track: 'Sparkle',
    label: 'Bell',
    frequency: 660,
    duration: 0.55,
    wave: 'sine',
    color: '#06b6d4',
  },
  {
    name: 'Chorus Hook',
    track: 'Lead',
    label: 'Hook',
    frequency: 440,
    duration: 0.75,
    wave: 'triangle',
    color: '#ec4899',
  },
];

const soundMap = new Map(musicSounds.map((sound) => [sound.name, sound]));
const activeTimers: number[] = [];
let audioContext: AudioContext | null = null;

function makeCharacterSound(name: string): TinyPykSound {
  const seed = [...name].reduce((total, character) => total + character.charCodeAt(0), 0);
  const frequencies = [220, 247, 262, 294, 330, 392, 440, 523, 587, 659];

  return {
    name,
    track: 'Character',
    label: 'FX',
    frequency: frequencies[seed % frequencies.length],
    duration: 0.36,
    wave: seed % 3 === 0 ? 'triangle' : 'sine',
    color: '#cf63cf',
  };
}

function getAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext ??= new AudioContextConstructor();
  return audioContext;
}

export function getTinyPykSound(name: string) {
  return soundMap.get(name) ?? makeCharacterSound(name);
}

export function stopTinyPykSounds() {
  activeTimers.splice(0).forEach((timer) => window.clearTimeout(timer));
}

export function playTinyPykSound(name: string, delayMs = 0) {
  const sound = getTinyPykSound(name);
  if (!sound) {
    return 0;
  }

  const timer = window.setTimeout(() => {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = sound.wave;
    oscillator.frequency.value = sound.frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + sound.duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + sound.duration);
  }, Math.max(0, delayMs));

  activeTimers.push(timer);
  return sound.duration;
}
