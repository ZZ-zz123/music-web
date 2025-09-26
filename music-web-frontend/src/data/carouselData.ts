import { CarouselItem } from '../components/Common/Carousel';

// 首页轮播图数据
export const homeCarouselData: CarouselItem[] = [
  {
    id: '1',
    title: '古典音乐殿堂',
    subtitle: '交响乐团演奏经典名曲',
    description: '感受古典音乐的优雅与庄重，聆听来自世界顶级交响乐团的演奏',
    image: '/img/carouselPic/classical-orchestra.png',
    onClick: () => {
      // 跳转到古典音乐播放列表
      console.log('点击古典音乐殿堂');
    }
  },
  {
    id: '2',
    title: '民谣温暖时光',
    subtitle: '班卓琴与温暖的民间音乐',
    description: '用温暖的民谣治愈心灵，在质朴的音乐中找到内心的宁静',
    image: '/img/carouselPic/folk-banjo.png',
    onClick: () => {
      console.log('点击民谣温暖时光');
    }
  },
  {
    id: '3',
    title: '街头音乐文化',
    subtitle: '城市街头的音乐灵魂',
    description: '感受街头音乐的自由与激情，体验城市文化的多元魅力',
    image: '/img/carouselPic/street-guitarist.png',
    onClick: () => {
      console.log('点击街头音乐文化');
    }
  },
  {
    id: '4',
    title: '摇滚电音狂潮',
    subtitle: '电吉他的震撼音浪',
    description: '燃烧的青春，激情的摇滚，让电吉他的音浪震撼你的心灵',
    image: '/img/carouselPic/electric-guitar.png',
    onClick: () => {
      console.log('点击摇滚电音狂潮');
    }
  }
];

// 歌单页面轮播图数据
export const playlistCarouselData: CarouselItem[] = [
  {
    id: 'p1',
    title: '私人定制歌单',
    subtitle: '根据你的喜好智能推荐',
    description: '基于你的听歌历史，为你量身打造的专属音乐体验',
    image: '/img/songListPic/109951163271025942.jpg'
  },
  {
    id: 'p2',
    title: '热门歌单榜',
    subtitle: '最受欢迎的音乐合集',
    description: '发现当下最热门的歌单，跟随音乐潮流的脚步',
    image: '/img/songListPic/109951163443093546.jpg'
  },
  {
    id: 'p3',
    title: '心情歌单',
    subtitle: '不同心情，不同音乐',
    description: '快乐、悲伤、怀念、励志，用音乐表达你的每一种心情',
    image: '/img/songListPic/109951163609743240.jpg'
  }
];
