import { MixCard, Playlist } from '../types';

// 基于真实data文件夹歌手的推荐分类
export const realTopMixes: MixCard[] = [
  {
    id: 'playlist-1',
    title: '华语流行精选',
    subtitle: '周杰伦、林俊杰、王力宏',
    coverUrl: '/img/songListPic/109951163097151464.jpg',
    type: 'playlist',
    genre: '华语流行'
  },
  {
    id: 'playlist-5',
    title: '经典港台',
    subtitle: '张国荣、李克勤、王菲',
    coverUrl: '/img/songListPic/109951163646671507.jpg',
    type: 'playlist',
    genre: '经典港台'
  },
  {
    id: 'playlist-2',
    title: '民谣时光',
    subtitle: '李荣浩、毛不易、朴树',
    coverUrl: '/img/songListPic/109951163924312766.jpg',
    type: 'playlist',
    genre: '华语民谣'
  },
  {
    id: 'playlist-3',
    title: 'K-POP精选',
    subtitle: 'IU、金泰妍、艺声',
    coverUrl: '/img/songListPic/109951163579465390.jpg',
    type: 'playlist',
    genre: '韩流'
  },
  {
    id: 'playlist-4',
    title: '摇滚青春',
    subtitle: '五月天、Beyond',
    coverUrl: '/img/songListPic/109951163692248020.jpg',
    type: 'playlist',
    genre: '华语摇滚'
  }
];

export const realMadeForYou: MixCard[] = [
  {
    id: 'made-for-you-1',
    title: '流行天王精选',
    subtitle: '周杰伦、林俊杰的热门歌曲',
    coverUrl: '/img/songListPic/109951163321304060.jpg',
    type: 'playlist',
    genre: '华语流行'
  },
  {
    id: 'made-for-you-2',
    title: '情歌王子',
    subtitle: '张杰、王力宏的经典情歌',
    coverUrl: '/img/songListPic/109951163401615779.jpg',
    type: 'playlist',
    genre: '华语流行'
  },
  {
    id: 'made-for-you-3',
    title: '韩流女声',
    subtitle: 'IU、金泰妍的温柔歌声',
    coverUrl: '/img/songListPic/109951163936991203.jpg',
    type: 'playlist',
    genre: '韩流'
  },
  {
    id: 'made-for-you-4',
    title: '民谣故事',
    subtitle: '李荣浩、毛不易的温暖民谣',
    coverUrl: '/img/songListPic/109951163515798929.jpg',
    type: 'playlist',
    genre: '华语民谣'
  }
];

export const realRecentlyPlayed: MixCard[] = [
  {
    id: 'recent-1',
    title: '最近播放',
    subtitle: '你最近听过的歌曲',
    coverUrl: '/img/songListPic/109951163594594622.jpg',
    type: 'playlist',
    genre: '混合'
  },
  {
    id: 'recent-2',
    title: '热门新歌',
    subtitle: '本周最受欢迎的新歌',
    coverUrl: '/img/songListPic/109951163862683663.jpg',
    type: 'playlist',
    genre: '新歌'
  }
];

export const realJumpBackIn: MixCard[] = [
  {
    id: 'jump-1',
    title: '怀旧金曲',
    subtitle: '经典老歌回忆',
    coverUrl: '/img/songListPic/109951163858422257.jpg',
    type: 'playlist',
    genre: '经典'
  },
  {
    id: 'jump-2',
    title: '青春记忆',
    subtitle: '那些年我们一起听过的歌',
    coverUrl: '/img/songListPic/109951163887710551.jpg',
    type: 'playlist',
    genre: '怀旧'
  }
];

export const realUniquelyYours: MixCard[] = [
  {
    id: 'unique-1',
    title: '专属推荐',
    subtitle: '根据你的喜好推荐',
    coverUrl: '/img/songListPic/109951163738160487.jpg',
    type: 'playlist',
    genre: '个性化'
  },
  {
    id: 'unique-2',
    title: '发现音乐',
    subtitle: '探索新的音乐风格',
    coverUrl: '/img/songListPic/109951163879964479.jpg',
    type: 'playlist',
    genre: '发现'
  }
];

export const realJustTheHits: MixCard[] = [
  {
    id: 'hits-1',
    title: '只要热门',
    subtitle: '最受欢迎的歌曲合集',
    coverUrl: '/img/songListPic/109951163932838310.jpg',
    type: 'playlist',
    genre: '热门'
  },
  {
    id: 'hits-2',
    title: '排行榜精选',
    subtitle: '各大排行榜冠军歌曲',
    coverUrl: '/img/songListPic/109951163942747948.jpg',
    type: 'playlist',
    genre: '排行榜'
  }
];

// 真实播放列表数据
export const realPlaylists: Playlist[] = [
  {
    id: 'real-1',
    name: '华语流行经典',
    description: '收录最经典的华语流行歌曲',
    coverUrl: '/img/songListPic/109951163826485303.jpg',
    songs: [],
    createdBy: 'Music Bot',
    isPublic: true,
    genre: '华语流行'
  },
  {
    id: 'real-2',
    name: '韩语精选集',
    description: '最新最热的韩语歌曲',
    coverUrl: '/img/songListPic/18814842976746273.jpg',
    songs: [],
    createdBy: 'Music Bot',
    isPublic: true,
    genre: 'K-Pop'
  },
  {
    id: 'real-3',
    name: '民谣温暖时光',
    description: '用温暖的民谣治愈心灵',
    coverUrl: '/img/songListPic/109951163670223947.jpg',
    songs: [],
    createdBy: 'Music Bot',
    isPublic: true,
    genre: '民谣'
  },
  {
    id: 'real-4',
    name: '摇滚青春',
    subtitle: '燃烧的青春摇滚',
    description: '燃烧的青春，激情的摇滚',
    coverUrl: '/img/songListPic/109951163203287436.jpg',
    songs: [],
    createdBy: 'Music Bot',
    isPublic: true,
    genre: '摇滚'
  },
  {
    id: 'real-5',
    name: '经典港台金曲',
    description: '永恒的港台经典',
    coverUrl: '/img/songListPic/109951163097151464.jpg',
    songs: [],
    createdBy: 'Music Bot',
    isPublic: true,
    genre: '港台'
  }
];
