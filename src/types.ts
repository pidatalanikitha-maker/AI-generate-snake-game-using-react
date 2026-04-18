export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Future Beat',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Midnight Logic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/horizon/400/400',
  },
];

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
