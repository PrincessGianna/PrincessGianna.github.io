// Gallery data for all photos
const galleryData = [
    {
        title: "烟花前的合照",
        date: "2022.11.07",
        description: "这是那天在battersea park看烟花时，我们的合照，拍摄于2022.11.07",
        image: "../assets/images/2022.11.07.jpg",
        year: "2022"
    },
    {
        title: "芬兰赫尔辛基的合照",
        date: "2023.01.02",
        description: "这是在芬兰，赫尔辛基时我们的合照。",
        image: "../assets/images/2023.01.02.jpg",
        year: "2023"
    },
    {
        title: "在芬兰滑雪后",
        date: "2023.01.03",
        description: "那天在芬兰滑雪，你摔在了雪里太可爱了。",
        image: "../assets/images/2023.01.03.jpg",
        year: "2023"
    },
    {
        title: "芬兰的雪地摩托",
        date: "2023.01.04",
        description: "拍摄于我们在罗瓦涅米，骑雪地摩托前",
        image: "../assets/images/2023.01.04.jpg",
        year: "2023"
    },
    {
        title: "又一年春节",
        date: "2023.01.23",
        description: "那是我们第一次一起过春节",
        image: "../assets/images/2023.01.23.jpg",
        year: "2023"
    },
    {
        title: "去hasting的小火车上",
        date: "2023.05.17",
        description: "那个周末，在hasting的火车上，我们疯狂的自拍",
        image: "../assets/images/2023.05.17.jpg",
        year: "2023"
    },
    {
        title: "在hasting吃冰淇淋",
        date: "2023.05.17",
        description: "我们在哪都爱吃冰淇淋，还记得之前你给我的微信备注，余冰淇淋。",
        image: "../assets/images/2023.05.17(2).jpg",
        year: "2023"
    },
    {
        title: "你来陪我过生日",
        date: "2023.05.24",
        description: "你陪我度过的第一个生日",
        image: "../assets/images/2023.05.24.jpg",
        year: "2023"
    },
    {
        title: "那年暑假在广州",
        date: "2023.08.07",
        description: "你从香港来广州陪我。",
        image: "../assets/images/2023.08.07.jpg",
        year: "2023"
    },
    {
        title: "我们一起进入大三",
        date: "2023.09.21",
        description: "我们在waterstone听讲座",
        image: "../assets/images/2023.09.21.jpg",
        year: "2023"
    },
    {
        title: "在Tesco",
        date: "2023.09.24",
        description: "在tesco买东西也要记录。",
        image: "../assets/images/2023.09.24.jpg",
        year: "2023"
    },
    {
        title: "陪你过的第一个生日",
        date: "2023.09.29",
        description: "那是我陪你过的第一个生日，陪你吃饭，陪你点蜡烛，给你唱生日歌。",
        image: "../assets/images/2023.09.29.jpg",
        year: "2023"
    },
    {
        title: "黑山之旅",
        date: "2023.10.05",
        description: "那是在黑山酒店里等车。",
        image: "../assets/images/2023.10.05.jpg",
        year: "2023"
    },
    {
        title: "下课放学",
        date: "2023.10.16",
        description: "那天是在hci下课，等电梯，咔嚓合照。",
        image: "../assets/images/2023.10.16.jpg",
        year: "2023"
    },
    {
        title: "猪肚鸡之旅",
        date: "2023.10.25",
        description: "那天是我们的routine，吃完猪肚鸡，去吃yole的路上",
        image: "../assets/images/2023.10.25.jpg",
        year: "2023"
    },
    {
        title: "黑山旅程",
        date: "2023.11.05",
        description: "那天我们刚到黑山，坐着车走着山路，去到我们住过的最好的酒店",
        image: "../assets/images/2023.11.05.jpg",
        year: "2023"
    },
    {
        title: "黑山旅程",
        date: "2023.11.05",
        description: "到了黑山之后我们出门觅食",
        image: "../assets/images/2023.11.05(2).jpg",
        year: "2023"
    },
    {
        title: "黑山旅程day2",
        date: "2023.11.06",
        description: "第二天我们出门，在布得瓦去玩滑翔伞",
        image: "../assets/images/2023.11.06.jpg",
        year: "2023"
    },
    {
        title: "黑山旅程day3",
        date: "2023.11.07",
        description: "第三天，我们乘船去看果冻海，被吹成了落汤鸡，喜提感冒",
        image: "../assets/images/2023.11.07.jpg",
        year: "2023"
    },
    {
        title: "黑山旅程day4",
        date: "2023.11.08",
        description: "那是我们在黑山的最后一天",
        image: "../assets/images/2023.11.08.jpg",
        year: "2023"
    },
    {
        title: "巴黎day1",
        date: "2023.12.18",
        description: "这是我们坐eurostar去巴黎，在火车上。",
        image: "../assets/images/2023.12.18.jpg",
        year: "2023"
    },
    {
        title: "巴黎day1",
        date: "2023.12.18",
        description: "我们在巴黎的第一天，猛吃",
        image: "../assets/images/2023.12.18(2).jpg",
        year: "2023"
    },
    {
        title: "巴黎day2",
        date: "2023.12.19",
        description: "巴黎迪士尼限定系列",
        image: "../assets/images/2023.12.19.jpg",
        year: "2023"
    },
    {
        title: "巴黎day2",
        date: "2023.12.19",
        description: "巴黎迪士尼限定系列",
        image: "../assets/images/2023.12.19(2).jpg",
        year: "2023"
    },
    {
        title: "巴黎day2",
        date: "2023.12.19",
        description: "巴黎迪士尼限定系列",
        image: "../assets/images/2023.12.19(3).jpg",
        year: "2023"
    },
    {
        title: "巴黎day2",
        date: "2023.12.19",
        description: "巴黎迪士尼限定系列",
        image: "../assets/images/2023.12.19(4).jpg",
        year: "2023"
    },
    {
        title: "圣诞节",
        date: "2023.12.25",
        description: "又是一年圣诞节，你来我家打牌，拿我的手机自拍",
        image: "../assets/images/2023.12.25.jpg",
        year: "2023"
    },
    {
        title: "冰岛day0",
        date: "2024.01.03",
        description: "我在给你拿行李，你坐在我行李上偷懒！",
        image: "../assets/images/2024.01.03.jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "我们在冰岛看日出",
        image: "../assets/images/2024.01.04.jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "我们在冰岛看日出",
        image: "../assets/images/2024.01.04(2).jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "我们在冰岛看日出",
        image: "../assets/images/2024.01.04(3).jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "我们在冰岛看日出",
        image: "../assets/images/2024.01.04(4).jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "我们在冰岛看见辽阔",
        image: "../assets/images/2024.01.04(5).jpg",
        year: "2024"
    },
    {
        title: "冰岛day1系列",
        date: "2024.01.04",
        description: "还记得那天，我笨拙的立着三脚架，给我俩自拍",
        image: "../assets/images/2024.01.04(6).jpg",
        year: "2024"
    },
    {
        title: "冰岛day2系列",
        date: "2024.01.05",
        description: "你又拿我手机自拍！我可都有记录的！",
        image: "../assets/images/2024.01.05.jpg",
        year: "2024"
    },
    {
        title: "冰岛day2系列",
        date: "2024.01.05",
        description: "从没嫌你能叭叭，只对你有那么多耐心",
        image: "../assets/images/2024.01.05(2).jpg",
        year: "2024"
    },
    {
        title: "冰岛day2系列",
        date: "2024.01.05",
        description: "那天晚上我们一起在零下20度里等极光，放着绿光也没等来极光，不过等来了满天星，下次，一定一起去看极光",
        image: "../assets/images/2024.01.05(3).jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "在黑沙滩被吹麻了，还记得那个穿吊带拍照的小姐姐嘛，我们真像老年人哈哈",
        image: "../assets/images/2024.01.06.jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "也是在黑沙滩，那是还不太会用相机拍照，现在厉害多了，有机会就给你拍",
        image: "../assets/images/2024.01.06(2).jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "那天去看蓝冰洞",
        image: "../assets/images/2024.01.06(3).jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "你在那看蓝冰洞，像个矿工哈哈",
        image: "../assets/images/2024.01.06(4).jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "那天阳光穿过你的发丝，太漂亮了刘萨拉公主",
        image: "../assets/images/2024.01.06(5).jpg",
        year: "2024"
    },
    {
        title: "冰岛day3系列",
        date: "2024.01.06",
        description: "我们在中途吃三明治，你说我吃东西总漏嘴",
        image: "../assets/images/2024.01.06(6).jpg",
        year: "2024"
    },
    {
        title: "我们的出圈合照",
        date: "2024.02.23",
        description: "我剪完头回来我们的第一次合照，你总夸我帅",
        image: "../assets/images/2024.02.23.jpg",
        year: "2024"
    },
    {
        title: "我们的出圈合照",
        date: "2024.02.23",
        description: "我们一口气拍了四张拍立得",
        image: "../assets/images/2024.02.23(2).jpg",
        year: "2024"
    },
    {
        title: "裤子也爱吃肉",
        date: "2024.03.05",
        description: "去吃韩料，吃到了裤子上",
        image: "../assets/images/2024.03.05.jpg",
        year: "2024"
    },
    {
        title: "布鲁塞尔day1系列",
        date: "2024.03.15",
        description: "那天在布鲁塞尔，我们在广场上吹着风，听着歌",
        image: "../assets/images/2024.03.15.jpg",
        year: "2024"
    },
    {
        title: "布鲁塞尔day1系列",
        date: "2024.03.15",
        description: "我们在布鲁尔塞的小巷子里",
        image: "../assets/images/2024.03.15(2).jpg",
        year: "2024"
    },
    {
        title: "布鲁塞尔day2系列",
        date: "2024.03.16",
        description: "那天你拍出了我最喜欢的照片！",
        image: "../assets/images/2024.03.16.jpg",
        year: "2024"
    },
    {
        title: "巴黎系列",
        date: "2024.03.17",
        description: "看！你吃的超大开心果冰淇淋！",
        image: "../assets/images/2024.03.17.jpg",
        year: "2024"
    },
    {
        title: "巴黎系列",
        date: "2024.03.17",
        description: "我们在巴黎铁塔前的合照",
        image: "../assets/images/2024.03.17(2).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.22",
        description: "我们坐火车上岛威尼斯",
        image: "../assets/images/2024.3.22.jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.22",
        description: "在威尼斯小巷子里吃饭",
        image: "../assets/images/2024.3.22(2).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.22",
        description: "我们在眼镜店里耍酷",
        image: "../assets/images/2024.3.22(3).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.22",
        description: "那天晚霞很美，你也很美",
        image: "../assets/images/2024.3.22(4).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.24",
        description: "在佛罗伦萨的杂货铺，又开始搞怪",
        image: "../assets/images/2024.3.24.jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.24",
        description: "那天去比萨的火车cancelled了，我们在河边散步",
        image: "../assets/images/2024.3.24(2).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.24",
        description: "在米开朗基罗广场上突遇暴雨，我们站在屋檐下，你喝了点酒，一直唧唧咋咋的很可爱。",
        image: "../assets/images/2024.3.24(3).jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.25",
        description: "我们在罗马的出圈神图",
        image: "../assets/images/2024.3.25.jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.26",
        description: "你那天说你是啥，黑帮老大的女人，我是你的小弟",
        image: "../assets/images/2024.3.26.jpg",
        year: "2024"
    },
    {
        title: "意大利系列",
        date: "2024.03.26",
        description: "那天你在许愿池许愿，我也许愿，你的愿望都实现",
        image: "../assets/images/2024.3.26(2).jpg",
        year: "2024"
    },
    {
        title: "异地之后去青岛找你",
        date: "2024.07.06",
        description: "你在大声的唱 I love u",
        image: "../assets/images/2024.07.06.png",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.24",
        description: "我们一起到先锋书店，写下属于我们的明信片",
        image: "../assets/images/2024.12.24.jpg",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.24",
        description: "你陪我去逛谷子店，即使你并不喜欢哈哈",
        image: "../assets/images/2024.12.24(2).jpg",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.25",
        description: "我们去音乐台听歌，看和平鸽从我们上方飞过",
        image: "../assets/images/2024.12.25.jpg",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.25",
        description: "我们在玄武湖坐船，那个小鸭船，我们都控制不住方向盘",
        image: "../assets/images/2024.12.25(2).jpg",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.26",
        description: "错峰过圣诞，我们去吃了漂亮饭，但也没你好看",
        image: "../assets/images/2024.12.26.jpg",
        year: "2024"
    },
    {
        title: "你放假回国在南京",
        date: "2024.12.27",
        description: "最后一天去了博物馆，之后你便一早返程回家了，我们又开始异地",
        image: "../assets/images/2024.12.27.jpg",
        year: "2024"
    },
    {
        title: "陪我过22岁生日",
        date: "2025.05.09",
        description: "你带着蛋糕和花，带着夏日的热烈和惊喜，来北京陪我过生日",
        image: "../assets/images/2025.5.9.jpg",
        year: "2025"
    },
    {
        title: "陪我过22岁生日",
        date: "2025.05.10",
        description: "那天陪你在北京闲逛，你坐在地铁上，我低头看你，你在看我们的合照",
        image: "../assets/images/2025.5.10.jpg",
        year: "2025"
    },
    {
        title: "陪我过22岁生日",
        date: "2025.05.10",
        description: "相聚时间很多，又匆匆送你回家，如果没记错的话，那是我们最后一次见面。距离现在我们已经142天没见了。",
        image: "../assets/images/2025.5.10(2).jpg",
        year: "2025"
    }
];

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = galleryData;
}
