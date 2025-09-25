// 画廊照片数据
const galleryData = [
  {
    title: "烟花前的合照",
    date: "2022.11.07",
    image: "../assets/images/1.jpg",
    year: "2022",
    description: "在美丽的烟花前留下的珍贵合照，这是我们爱情故事的美好开端"
  },
  {
    title: "芬兰极光之旅",
    date: "2023.01.15",
    image: "../assets/images/2.jpg",
    year: "2023",
    description: "在芬兰看到了梦幻般的极光，你的笑容比极光还要美丽"
  },
  {
    title: "芬兰雪景合照",
    date: "2023.01.16",
    image: "../assets/images/3.jpg",
    year: "2023",
    description: "雪花纷飞的芬兰，我们在雪地里拥抱，感受着彼此的温暖"
  },
  {
    title: "芬兰湖边漫步",
    date: "2023.01.17",
    image: "../assets/images/4.jpg",
    year: "2023",
    description: "在芬兰湖边手牵手漫步，享受着只属于我们的宁静时光"
  },
  {
    title: "芬兰森林探险",
    date: "2023.01.18",
    image: "../assets/images/5.jpg",
    year: "2023",
    description: "在芬兰的森林中探险，你就是我最美的风景"
  },
  {
    title: "情人节甜蜜时光",
    date: "2023.02.14",
    image: "../assets/images/6.jpg",
    year: "2023",
    description: "我们的第一个情人节，充满了甜蜜和浪漫"
  },
  {
    title: "春日踏青",
    date: "2023.03.20",
    image: "../assets/images/7.jpg",
    year: "2023",
    description: "春暖花开的季节，我们一起去踏青，感受春天的美好"
  },
  {
    title: "樱花飞舞",
    date: "2023.04.10",
    image: "../assets/images/8.jpg",
    year: "2023",
    description: "樱花飞舞的日子，你比樱花还要美丽动人"
  },
  {
    title: "生日快乐",
    date: "2023.05.10",
    image: "../assets/images/9.jpg",
    year: "2023",
    description: "你的生日，我为你准备了最美的惊喜，希望你永远开心"
  },
  {
    title: "夏日海边",
    date: "2023.06.15",
    image: "../assets/images/10.jpg",
    year: "2023",
    description: "夏日的海边，我们一起看海浪拍打着礁石，许下永恒的誓言"
  },
  {
    title: "黑山之旅开始",
    date: "2023.07.01",
    image: "../assets/images/11.jpg",
    year: "2023",
    description: "黑山之旅的开始，你兴奋的笑容让我觉得一切都值得"
  },
  {
    title: "黑山美丽风光",
    date: "2023.07.02",
    image: "../assets/images/12.jpg",
    year: "2023",
    description: "黑山的美丽风光，但最美的还是你"
  },
  {
    title: "黑山山顶合照",
    date: "2023.07.03",
    image: "../assets/images/13.jpg",
    year: "2023",
    description: "站在黑山的山顶，感受着你我之间深深的爱意"
  },
  {
    title: "黑山日落",
    date: "2023.07.04",
    image: "../assets/images/14.jpg",
    year: "2023",
    description: "黑山的日落很美，但和你一起看的日落更美"
  },
  {
    title: "黑山海边漫步",
    date: "2023.07.05",
    image: "../assets/images/15.jpg",
    year: "2023",
    description: "在黑山的海边漫步，海风轻抚着我们的脸庞"
  },
  {
    title: "夏日音乐节",
    date: "2023.07.20",
    image: "../assets/images/16.jpg",
    year: "2023",
    description: "夏日音乐节上，我们一起摇摆，青春正好"
  },
  {
    title: "巴黎浪漫之旅",
    date: "2023.08.01",
    image: "../assets/images/17.jpg",
    year: "2023",
    description: "巴黎的浪漫，配上你的美丽，简直完美"
  },
  {
    title: "埃菲尔铁塔下",
    date: "2023.08.02",
    image: "../assets/images/18.jpg",
    year: "2023",
    description: "在埃菲尔铁塔下许下的诺言，愿我们的爱情如铁塔般坚固"
  },
  {
    title: "巴黎街头漫步",
    date: "2023.08.03",
    image: "../assets/images/19.jpg",
    year: "2023",
    description: "巴黎街头的漫步，每一步都充满了浪漫"
  },
  {
    title: "塞纳河畔",
    date: "2023.08.04",
    image: "../assets/images/20.jpg",
    year: "2023",
    description: "塞纳河畔的夕阳，见证着我们的爱情"
  },
  {
    title: "卢浮宫前",
    date: "2023.08.05",
    image: "../assets/images/21.jpg",
    year: "2023",
    description: "在卢浮宫前，你就是我心中最美的艺术品"
  },
  {
    title: "巴黎咖啡厅",
    date: "2023.08.06",
    image: "../assets/images/22.jpg",
    year: "2023",
    description: "巴黎小咖啡厅里的温馨时光，只有我们两个人"
  },
  {
    title: "中秋赏月",
    date: "2023.09.29",
    image: "../assets/images/23.jpg",
    year: "2023",
    description: "中秋节的月圆夜，我们一起赏月，月亮都为我们的爱情感动"
  },
  {
    title: "秋日枫叶",
    date: "2023.10.15",
    image: "../assets/images/24.jpg",
    year: "2023",
    description: "秋天的枫叶正红，就像我对你炽热的爱意"
  },
  {
    title: "万圣节装扮",
    date: "2023.10.31",
    image: "../assets/images/25.jpg",
    year: "2023",
    description: "万圣节的可爱装扮，你总是能带给我惊喜"
  },
  {
    title: "冰岛极光之夜",
    date: "2023.11.10",
    image: "../assets/images/26.jpg",
    year: "2023",
    description: "冰岛的极光夜，我们一起追寻着最美的光芒"
  },
  {
    title: "冰岛蓝湖温泉",
    date: "2023.11.11",
    image: "../assets/images/27.jpg",
    year: "2023",
    description: "在冰岛的蓝湖温泉中，感受着大自然的神奇"
  },
  {
    title: "冰岛瀑布前",
    date: "2023.11.12",
    image: "../assets/images/28.jpg",
    year: "2023",
    description: "冰岛壮观的瀑布前，你的美丽让瀑布都黯然失色"
  },
  {
    title: "冰岛黑沙滩",
    date: "2023.11.13",
    image: "../assets/images/29.jpg",
    year: "2023",
    description: "冰岛神秘的黑沙滩，我们留下了最美的足迹"
  },
  {
    title: "冰岛冰川探险",
    date: "2023.11.14",
    image: "../assets/images/30.jpg",
    year: "2023",
    description: "冰岛的冰川探险，有你在身边，再冷的地方都是温暖的"
  },
  {
    title: "感恩节温馨",
    date: "2023.11.23",
    image: "../assets/images/31.jpg",
    year: "2023",
    description: "感恩节，感恩有你在我身边，让我的生活如此美好"
  },
  {
    title: "圣诞节快乐",
    date: "2023.12.25",
    image: "../assets/images/32.jpg",
    year: "2023",
    description: "圣诞节的雪花飞舞，我们一起度过了最温馨的节日"
  },
  {
    title: "新年倒计时",
    date: "2023.12.31",
    image: "../assets/images/33.jpg",
    year: "2023",
    description: "新年倒计时的那一刻，我们许下了新的愿望"
  },
  {
    title: "新年第一天",
    date: "2024.01.01",
    image: "../assets/images/34.jpg",
    year: "2024",
    description: "2024年的第一天，新的一年，我们的爱情继续绽放"
  },
  {
    title: "冬日雪景",
    date: "2024.01.15",
    image: "../assets/images/35.jpg",
    year: "2024",
    description: "冬日的雪景中，我们拥抱着彼此，温暖如春"
  },
  {
    title: "情人节惊喜",
    date: "2024.02.14",
    image: "../assets/images/36.jpg",
    year: "2024",
    description: "2024年的情人节，我为你准备了更大的惊喜"
  },
  {
    title: "春花烂漫",
    date: "2024.03.15",
    image: "../assets/images/37.jpg",
    year: "2024",
    description: "春天来了，花儿开了，我们的爱情也更加美丽"
  },
  {
    title: "复活节彩蛋",
    date: "2024.03.31",
    image: "../assets/images/38.jpg",
    year: "2024",
    description: "复活节的彩蛋，就像我们五彩斑斓的爱情"
  },
  {
    title: "春游踏青",
    date: "2024.04.10",
    image: "../assets/images/39.jpg",
    year: "2024",
    description: "春游踏青，和你一起感受大自然的美好"
  },
  {
    title: "樱花季浪漫",
    date: "2024.04.20",
    image: "../assets/images/40.jpg",
    year: "2024",
    description: "樱花季的浪漫，粉色的花瓣飘洒在我们身上"
  },
  {
    title: "生日庆祝",
    date: "2024.05.10",
    image: "../assets/images/41.jpg",
    year: "2024",
    description: "又一年的生日，我们一起庆祝，愿你永远年轻美丽"
  },
  {
    title: "母亲节感恩",
    date: "2024.05.12",
    image: "../assets/images/42.jpg",
    year: "2024",
    description: "母亲节，感恩所有给予我们爱的人"
  },
  {
    title: "夏日海滩",
    date: "2024.06.01",
    image: "../assets/images/43.jpg",
    year: "2024",
    description: "夏日的海滩，我们一起追逐海浪，享受自由"
  },
  {
    title: "意大利罗马行",
    date: "2024.06.15",
    image: "../assets/images/44.jpg",
    year: "2024",
    description: "意大利罗马之行开始，古老的城市见证我们的爱情"
  },
  {
    title: "罗马竞技场",
    date: "2024.06.16",
    image: "../assets/images/45.jpg",
    year: "2024",
    description: "在罗马竞技场前，感受着历史的厚重和爱情的永恒"
  },
  {
    title: "梵蒂冈之行",
    date: "2024.06.17",
    image: "../assets/images/46.jpg",
    year: "2024",
    description: "梵蒂冈的圣洁，见证着我们纯真的爱情"
  },
  {
    title: "罗马喷泉许愿",
    date: "2024.06.18",
    image: "../assets/images/47.jpg",
    year: "2024",
    description: "在罗马的喷泉前许愿，愿我们的爱情永远甜蜜"
  },
  {
    title: "托斯卡纳田园",
    date: "2024.06.19",
    image: "../assets/images/48.jpg",
    year: "2024",
    description: "托斯卡纳的田园风光，就像我们简单而美好的爱情"
  },
  {
    title: "威尼斯水城",
    date: "2024.06.20",
    image: "../assets/images/49.jpg",
    year: "2024",
    description: "威尼斯的水城风情，我们坐着贡多拉，看着夕阳西下"
  },
  {
    title: "意大利美食之夜",
    date: "2024.06.21",
    image: "../assets/images/50.jpg",
    year: "2024",
    description: "意大利美食之夜，和你一起品尝世界上最美味的食物"
  },
  {
    title: "夏日音乐节狂欢",
    date: "2024.07.15",
    image: "../assets/images/51.jpg",
    year: "2024",
    description: "夏日音乐节的狂欢夜，我们一起摇摆，青春无敌"
  },
  {
    title: "布鲁塞尔之旅",
    date: "2024.08.01",
    image: "../assets/images/52.jpg",
    year: "2024",
    description: "布鲁塞尔之旅开始，欧洲的心脏迎接着我们"
  },
  {
    title: "布鲁塞尔大广场",
    date: "2024.08.02",
    image: "../assets/images/53.jpg",
    year: "2024",
    description: "布鲁塞尔大广场的建筑之美，见证着我们的足迹"
  },
  {
    title: "布鲁塞尔撒尿小童",
    date: "2024.08.03",
    image: "../assets/images/54.jpg",
    year: "2024",
    description: "在撒尿小童前的合照，你的笑容比雕像更生动"
  },
  {
    title: "比利时巧克力之旅",
    date: "2024.08.04",
    image: "../assets/images/55.jpg",
    year: "2024",
    description: "比利时巧克力之旅，甜蜜如我们的爱情"
  },
  {
    title: "布鲁日古城",
    date: "2024.08.05",
    image: "../assets/images/56.jpg",
    year: "2024",
    description: "布鲁日古城的运河，倒映着我们的幸福"
  },
  {
    title: "夏末海边",
    date: "2024.08.25",
    image: "../assets/images/57.jpg",
    year: "2024",
    description: "夏末的海边，我们一起看着海鸥飞翔"
  },
  {
    title: "秋日来临",
    date: "2024.09.01",
    image: "../assets/images/58.jpg",
    year: "2024",
    description: "秋天来了，叶子黄了，但我们的爱情依然火热"
  },
  {
    title: "中秋团圆",
    date: "2024.09.17",
    image: "../assets/images/59.jpg",
    year: "2024",
    description: "中秋团圆夜，月圆人团圆，有你在身边就是最大的幸福"
  },
  {
    title: "国庆长假",
    date: "2024.10.01",
    image: "../assets/images/60.jpg",
    year: "2024",
    description: "国庆长假，我们一起去旅行，看祖国的大好河山"
  },
  {
    title: "秋日枫叶红",
    date: "2024.10.15",
    image: "../assets/images/61.jpg",
    year: "2024",
    description: "秋日的枫叶红了，就像我对你热烈的爱"
  },
  {
    title: "万圣节创意",
    date: "2024.10.31",
    image: "../assets/images/62.jpg",
    year: "2024",
    description: "万圣节的创意装扮，你总是最有想法的那一个"
  },
  {
    title: "初冬温暖",
    date: "2024.11.15",
    image: "../assets/images/63.jpg",
    year: "2024",
    description: "初冬的温暖，来自你给我的拥抱"
  },
  {
    title: "感恩有你",
    date: "2024.11.28",
    image: "../assets/images/64.jpg",
    year: "2024",
    description: "感恩节，感恩有你陪伴我走过每一个日子"
  },
  {
    title: "冬日初雪",
    date: "2024.12.01",
    image: "../assets/images/65.jpg",
    year: "2024",
    description: "冬日的初雪，我们一起堆雪人，回到童年"
  },
  {
    title: "圣诞准备",
    date: "2024.12.20",
    image: "../assets/images/66.jpg",
    year: "2024",
    description: "圣诞节的准备工作，和你一起装饰圣诞树"
  },
  {
    title: "平安夜温馨",
    date: "2024.12.24",
    image: "../assets/images/67.jpg",
    year: "2024",
    description: "平安夜的温馨，我们一起等待圣诞老人的礼物"
  },
  {
    title: "圣诞节魔法",
    date: "2024.12.25",
    image: "../assets/images/68.jpg",
    year: "2024",
    description: "圣诞节的魔法时刻，你就是我最好的礼物"
  },
  {
    title: "跨年倒计时",
    date: "2024.12.31",
    image: "../assets/images/69.jpg",
    year: "2024",
    description: "2024年的最后一天，我们一起迎接新的一年"
  },
  {
    title: "新年新开始",
    date: "2025.01.01",
    image: "../assets/images/70.jpg",
    year: "2025",
    description: "2025年新年第一天，新的开始，新的希望"
  },
  {
    title: "春节团圆",
    date: "2025.02.09",
    image: "../assets/images/71.jpg",
    year: "2025",
    description: "春节团圆，家人团聚，有你在身边就是最完美的年"
  },
  {
    title: "生日快乐公主",
    date: "2025.05.10",
    image: "../assets/images/72.jpg",
    year: "2025",
    description: "2025年的生日，我的公主，愿你永远快乐，永远美丽如初"
  }
];
