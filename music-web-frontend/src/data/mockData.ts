import { MixCard, Song, Playlist } from '../types';

// 模拟歌曲数据 - 使用免费音频文件用于测试
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Play it Safe',
    artist: 'Julia Wolf',
    album: 'Play it Safe',
    duration: 180,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '2',
    title: 'Test Audio 1',
    artist: 'Demo Artist',
    album: 'Demo Album',
    duration: 30,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav'
  },
  {
    id: '3',
    title: 'Test Audio 2',
    artist: 'Demo Artist 2',
    album: 'Demo Album 2',
    duration: 25,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: 'https://www.soundjay.com/misc/sounds/page-flip-01a.wav'
  },
  {
    id: '4',
    title: 'Background Music',
    artist: 'Ambient Artist',
    album: 'Relaxing Sounds',
    duration: 60,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: 'https://www.soundjay.com/misc/sounds/beep-07a.wav'
  },
  {
    id: '5',
    title: 'Nature Sounds',
    artist: 'Nature Collection',
    album: 'Peaceful Moments',
    duration: 45,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: 'https://www.soundjay.com/misc/sounds/camera-shutter-click-01.wav'
  }
];

// 模拟Mix卡片数据
export const mockTopMixes: MixCard[] = [
  {
    id: '1',
    title: '轻松音乐',
    subtitle: 'Julia Wolf, Khalid, ayokay 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '2',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '3',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '4',
    title: '独立音乐',
    subtitle: 'Joywave, The xx, The Neighbourhood 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '5',
    title: '每日音乐 1',
    subtitle: 'Arya Stark, Lil Keith, Ed Sheeran 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

export const mockMadeForYou: MixCard[] = [
  {
    id: '6',
    title: '民谣原声',
    subtitle: 'Canyon City, Crooked Still, Gregory Alan...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '7',
    title: '每日音乐 1',
    subtitle: 'Arya Stark, Lil Keith, Ed Sheeran 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '8',
    title: '每日音乐 5',
    subtitle: 'FRIENDSHIP, Brooke Sierra, Julia Wolf...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '9',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '10',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

export const mockRecentlyPlayed: MixCard[] = [
  {
    id: '11',
    title: '轻松音乐',
    subtitle: 'Julia Wolf, Khalid, ayokay 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '12',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '13',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '14',
    title: '独立音乐',
    subtitle: 'Joywave, The xx, The Neighbourhood...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '15',
    title: '民谣原声',
    subtitle: 'Canyon City, Crooked Still, Gregory Alan...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

export const mockJumpBackIn: MixCard[] = [
  {
    id: '16',
    title: '民谣原声',
    subtitle: 'Canyon City, Crooked Still, Gregory Alan...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '17',
    title: '每日音乐 1',
    subtitle: 'Arya Stark, Lil Keith, Ed Sheeran 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '18',
    title: '每日音乐 5',
    subtitle: 'FRIENDSHIP, Brooke Sierra, Julia Wolf...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '19',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '20',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

export const mockUniquelyYours: MixCard[] = [
  {
    id: '21',
    title: '轻松音乐',
    subtitle: 'Julia Wolf, Khalid, ayokay 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '22',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '23',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '24',
    title: '独立音乐',
    subtitle: 'Joywave, The xx, The Neighbourhood...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '25',
    title: '民谣原声',
    subtitle: 'Canyon City, Crooked Still, Gregory Alan...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

export const mockJustTheHits: MixCard[] = [
  {
    id: '26',
    title: '民谣原声',
    subtitle: 'Canyon City, Crooked Still, Gregory Alan...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '27',
    title: '每日音乐 1',
    subtitle: 'Arya Stark, Lil Keith, Ed Sheeran 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '28',
    title: '每日音乐 5',
    subtitle: 'FRIENDSHIP, Brooke Sierra, Julia Wolf...',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '29',
    title: '流行音乐',
    subtitle: 'Hey Violet, VÉRITÉ, Timelines 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  },
  {
    id: '30',
    title: 'Pheelz 音乐',
    subtitle: 'Wizkid, Asake, Tiwa Savage 等',
    coverUrl: '/api/placeholder/160/160',
    type: 'mix'
  }
];

// 模拟喜欢的歌曲数据
export const mockLikedSongs: Song[] = [
  {
    id: 'liked-1',
    title: 'Play it Safe',
    artist: 'Julia Wolf',
    album: 'Play it Safe',
    duration: 132,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/play-it-safe.mp3',
    dateAdded: '2023-11-15'
  },
  {
    id: 'liked-2', 
    title: 'Ocean Front Apt',
    artist: 'ayokay',
    album: 'In the Shape of a Dream',
    duration: 132,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/ocean-front-apt.mp3',
    dateAdded: '2023-11-10'
  },
  {
    id: 'liked-3',
    title: 'Free Spirit',
    artist: 'Khalid',
    album: 'Free Spirit',
    duration: 182,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/free-spirit.mp3',
    dateAdded: '2023-11-08'
  },
  {
    id: 'liked-4',
    title: 'Remind You',
    artist: 'FRENSHIP',
    album: 'Vacation',
    duration: 265,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/remind-you.mp3',
    dateAdded: '2023-11-05'
  },
  {
    id: 'liked-5',
    title: 'Same Old',
    artist: 'SHY Martin',
    album: 'Same Old',
    duration: 176,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/same-old.mp3',
    dateAdded: '2023-11-01'
  },
  {
    id: 'liked-6',
    title: 'A Moment Apart',
    artist: 'ODESZA',
    album: 'A Moment Apart',
    duration: 194,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/a-moment-apart.mp3',
    dateAdded: '2023-10-28'
  },
  {
    id: 'liked-7',
    title: 'Run Away',
    artist: 'Manila Killa, RUNAGROUND',
    album: '1993',
    duration: 193,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/run-away.mp3',
    dateAdded: '2023-10-25'
  },
  {
    id: 'liked-8',
    title: 'Sleepless Nights (feat. The Nghbrs)',
    artist: 'ayokay, Nightly',
    album: 'In the Shape of a Dream',
    duration: 132,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/sleepless-nights.mp3',
    dateAdded: '2023-10-20'
  },
  {
    id: 'liked-9',
    title: 'Wrong Kind Of People',
    artist: 'Baker Grace',
    album: 'Girl I Know',
    duration: 194,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/wrong-kind-of-people.mp3',
    dateAdded: '2023-10-18'
  },
  {
    id: 'liked-10',
    title: 'Slow Grenade',
    artist: 'Ellie Goulding, Lauv',
    album: 'Brightest Blue',
    duration: 217,
    coverUrl: '/api/placeholder/300/300',
    audioUrl: '/audio/slow-grenade.mp3',
    dateAdded: '2023-10-15'
  }
];

// 模拟播放列表数据
export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Mix',
    description: '放松心情的音乐合集',
    coverUrl: '/api/placeholder/300/300',
    songs: mockSongs.slice(0, 3),
    createdBy: 'davidfred13',
    isPublic: true
  },
  {
    id: '2',
    name: 'Workout Mix',
    description: '健身时的动感音乐',
    coverUrl: '/api/placeholder/300/300',
    songs: mockSongs.slice(1, 4),
    createdBy: 'davidfred13',
    isPublic: true
  }
];
