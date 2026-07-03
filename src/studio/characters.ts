import catSprite from '../assets/characters/cat.png';
import robotSprite from '../assets/characters/robot.png';
import spaceSprite from '../assets/characters/space.png';
import wizardSprite from '../assets/characters/wizard.png';

export type Costume = {
  name: string;
  transform?: string;
  filter?: string;
};

export type CharacterAsset = {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
  accent: string;
  costumes: Costume[];
  sounds: string[];
};

export type Backdrop = {
  id: string;
  name: string;
  label: string;
};

export type StageSprite = {
  uid: string;
  characterId: string;
  costumeIndex: number;
  left: number;
  bottom: number;
  size: number;
};

const pictureCostumes: Costume[] = [
  { name: 'Costume 1' },
  { name: 'Flip' , transform: 'scaleX(-1)' },
  { name: 'Tiny jump', transform: 'rotate(-7deg) translateY(-4px)' },
];

export const characterLibrary: CharacterAsset[] = [
  {
    id: 'cat',
    name: 'Cat',
    image: catSprite,
    accent: '#ff9f1c',
    costumes: pictureCostumes,
    sounds: ['Meow', 'Pop', 'Purr'],
  },
  {
    id: 'robot',
    name: 'Robot',
    image: robotSprite,
    accent: '#2f8cff',
    costumes: pictureCostumes,
    sounds: ['Beep', 'Boop', 'Laser'],
  },
  {
    id: 'wizard',
    name: 'Wizard',
    image: wizardSprite,
    accent: '#8a5cff',
    costumes: pictureCostumes,
    sounds: ['Magic', 'Sparkle', 'Tada'],
  },
  {
    id: 'space',
    name: 'Astronaut',
    image: spaceSprite,
    accent: '#64b5f6',
    costumes: pictureCostumes,
    sounds: ['Rocket', 'Ping', 'Whoosh'],
  },
  {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    accent: '#59c059',
    costumes: [{ name: 'Green' }, { name: 'Flying', transform: 'rotate(-8deg)' }, { name: 'Tiny', transform: 'scale(0.82)' }],
    sounds: ['Roar', 'Fire', 'Wing'],
  },
  {
    id: 'unicorn',
    name: 'Unicorn',
    emoji: '🦄',
    accent: '#cf63cf',
    costumes: [{ name: 'Sparkle' }, { name: 'Bounce', transform: 'rotate(6deg)' }, { name: 'Small', transform: 'scale(0.82)' }],
    sounds: ['Sparkle', 'Chime', 'Gallop'],
  },
  {
    id: 'dino',
    name: 'Dino',
    emoji: '🦖',
    accent: '#55b86a',
    costumes: [{ name: 'Roar' }, { name: 'Stomp', transform: 'rotate(-5deg)' }, { name: 'Mini', transform: 'scale(0.82)' }],
    sounds: ['Stomp', 'Roar', 'Crunch'],
  },
  {
    id: 'bee',
    name: 'Bee',
    emoji: '🐝',
    accent: '#ffbf00',
    costumes: [{ name: 'Buzz' }, { name: 'Fly', transform: 'rotate(-12deg)' }, { name: 'Tiny', transform: 'scale(0.76)' }],
    sounds: ['Buzz', 'Pop', 'Chime'],
  },
  {
    id: 'crab',
    name: 'Crab',
    emoji: '🦀',
    accent: '#ff6b6b',
    costumes: [{ name: 'Wave' }, { name: 'Side step', transform: 'translateX(4px)' }, { name: 'Small', transform: 'scale(0.82)' }],
    sounds: ['Click', 'Bubble', 'Pop'],
  },
  {
    id: 'penguin',
    name: 'Penguin',
    emoji: '🐧',
    accent: '#4c97ff',
    costumes: [{ name: 'Waddle' }, { name: 'Slide', transform: 'rotate(-8deg)' }, { name: 'Tiny', transform: 'scale(0.8)' }],
    sounds: ['Waddle', 'Splash', 'Pop'],
  },
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    accent: '#ff6680',
    costumes: [{ name: 'Hop' }, { name: 'Turn', transform: 'scaleX(-1)' }, { name: 'Small', transform: 'scale(0.82)' }],
    sounds: ['Hop', 'Boing', 'Nibble'],
  },
  {
    id: 'star',
    name: 'Star',
    emoji: '⭐',
    accent: '#ffd166',
    costumes: [{ name: 'Glow' }, { name: 'Spin', transform: 'rotate(16deg)' }, { name: 'Tiny', transform: 'scale(0.78)' }],
    sounds: ['Twinkle', 'Chime', 'Tada'],
  },
];

export const backdrops: Backdrop[] = [
  { id: 'meadow', name: 'Meadow', label: 'Green hills' },
  { id: 'space', name: 'Space', label: 'Stars' },
  { id: 'ocean', name: 'Ocean', label: 'Blue waves' },
  { id: 'classroom', name: 'Classroom', label: 'Learning room' },
  { id: 'night', name: 'Night', label: 'Moon sky' },
  { id: 'party', name: 'Party', label: 'Celebration' },
];

export const getCharacter = (id: string) =>
  characterLibrary.find((character) => character.id === id) ?? characterLibrary[0];

export const makeStageSprite = (characterId: string, index: number): StageSprite => {
  const spots = [
    { left: 50, bottom: 17, size: 1 },
    { left: 28, bottom: 18, size: 0.88 },
    { left: 72, bottom: 18, size: 0.88 },
    { left: 15, bottom: 35, size: 0.7 },
    { left: 86, bottom: 35, size: 0.7 },
    { left: 42, bottom: 41, size: 0.7 },
    { left: 62, bottom: 41, size: 0.7 },
  ];
  const spot = spots[index % spots.length];

  return {
    uid: `sprite-${index + 1}`,
    characterId,
    costumeIndex: 0,
    ...spot,
  };
};
