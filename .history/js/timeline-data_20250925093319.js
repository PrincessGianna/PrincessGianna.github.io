// 时间线数据
const timelineData = {
  pageTitle: "关于我们",
  pageSubtitle: "我们的故事从这里开始",
  timeline: [
    {
      year: "2021",
      events: [
        {
          date: "2021.09",
          title: "初识",
          description:
            "我们第一次加上微信，非常官方的交换了备注，便不再有更多的联系",
          tag: "初识",
          position: "left",
        },
        {
          date: "2021.10",
          title: "初见",
          description:
            "机缘巧合下参加了一起参加了社团的活动，还参观了city250的二居室（也许是未来我们的闺蜜房），那天是我们第一次聚餐",
          tag: "初见",
          position: "right",
        },
      ],
    },
    {
      year: "2022",
      events: [
        {
          date: "2022.10",
          title: "日常",
          description: "我们一起下课，去吃了fuwafuwa",
          tag: "日常",
          position: "left",
        },
        {
          date: "2022.11",
          title: "约会日记",
          description: "我们一起在battersea park看了伦敦最盛大的烟花",
          tag: "约会日记",
          position: "right",
        },
      ],
    },
    {
      year: "2023",
      events: [
        {
          date: "2023.01",
          title: "旅游日记",
          description: "我们一起相约芬兰",
          tag: "旅游日记",
          position: "left",
        },
        {
          date: "2023.05",
          title: "约会日记",
          description: "短暂的周末，我们在hasting约会",
          tag: "约会日记",
          position: "right",
        },
        {
          date: "2023.05",
          title: "节日",
          description: "同月，你陪伴我过的第一个生日",
          tag: "节日",
          position: "left",
        },
        {
          date: "2023.08",
          title: "有难同当",
          description: "我们一起泪洒广州",
          tag: "有难同当",
          position: "right",
        },
        {
          date: "2023.09",
          title: "节日",
          description:
            "房子租期还没开始，赖在你家同吃同住，先吃猪肚鸡，再吃yole，再错进waterstone听无趣的讲座, 在我家陪你过着简单又幸福的生日",
          tag: "节日",
          position: "left",
        },
        {
          date: "2023.10",
          title: "日常",
          description:
            "日常在家吃火锅，5分钟无痛串门，大半夜连麦玩无聊小游戏，我们的pencil video也在课上火出了圈",
          tag: "日常",
          position: "right",
        },
        {
          date: "2023.11",
          title: "日常",
          description:
            "心有灵犀的想吃nandos，心有灵犀的穿上ucl的卫衣，玩overcooked玩到大火灾",
          tag: "日常",
          position: "left",
        },
        {
          date: "2023.11",
          title: "旅游日记",
          description:
            "同月，我们又相约黑山，第一次玩滑翔伞是跟你，第一次看果冻海也是跟你",
          tag: "旅游日记",
          position: "right",
        },
        {
          date: "2023.12",
          title: "旅游日记",
          description:
            "我们一同去了巴黎，吃了80串牛羊肉串，成功把我俩的胃都吃坏了，不过你在迪士尼很开心，我其实对这些可爱的小玩意没啥兴致，因为你在，她们才变得可爱",
          tag: "旅游日记",
          position: "left",
        },
      ],
    },
    {
      year: "2024",
      events: [
        {
          date: "2024.01",
          title: "旅游日记",
          description:
            "新年，我们立刻出发冰岛，看蓝冰洞，黑沙滩，漫天的星空，为刘萨拉公主拍人生大片，我的荣幸，看见比巴卜里面记录的我，才发现原来你眼中的我，也如此有生气。",
          tag: "旅游日记",
          position: "right",
        },
        {
          date: "2024.02",
          title: "日常",
          description:
            "我扎了个狼尾来接你下课，你开心的不的了，抓着我和画着绿色眼妆的你拍照，那个文案是谐音梗的合照，真的很漂亮",
          tag: "日常",
          position: "left",
        },
        {
          date: "2024.03",
          title: "日常",
          description: "我们抓着一个晴天，去kingscross草坪上晒太阳聊天",
          tag: "日常",
          position: "right",
        },
        {
          date: "2024.03",
          title: "旅游日记",
          description:
            "我们又偷了些时间，去了布鲁塞尔和巴黎，在那里报复性消费，在巴黎铁塔前合影，我永远记得那天",
          tag: "旅游日记",
          position: "left",
        },
        {
          date: "2024.03",
          title: "旅游日记",
          description:
            "月底，我们又出发了，这次目的地是意大利，我们走过威尼斯，佛罗伦萨，还有罗马，意大利的风很甜，和在米开朗基罗广场上微醺的你说糊话一样。",
          tag: "旅游日记",
          position: "right",
        },
        {
          date: "2024.04",
          title: "日常",
          description:
            "你回家了，我们在微信里煲电话粥，陪着我沉迷玄学，不过是现实还是神秘，我们都最相配",
          tag: "日常",
          position: "left",
        },
        {
          date: "2024.05",
          title: "节日",
          description:
            "你来我家，第二次，陪我过生日，你做了一相框我们的合照，你总是给我惊喜，将我世界照的透亮",
          tag: "节日",
          position: "right",
        },
        {
          date: "2024.07",
          title: "日常",
          description: "我去青岛见你，我们唱歌，在海边散步",
          tag: "日常",
          position: "left",
        },
        {
          date: "2024.08",
          title: "日常",
          description:
            "你去美国，我们正式开启了异国，也是第一次，我们相距如此的遥远",
          tag: "日常",
          position: "right",
        },
        {
          date: "2024.09",
          title: "节日",
          description:
            "你的22岁如约而至，第一次没能在你身边陪你过生日，我很想你",
          tag: "节日",
          position: "left",
        },
        {
          date: "2024.10",
          title: "有难同当",
          description:
            "我们仿佛在世界的两端，共同的焦虑，迷茫，我们互相陪伴，数着见面的日子",
          tag: "有难同当",
          position: "right",
        },
        {
          date: "2024.12",
          title: "旅游日记",
          description:
            "圣诞，我们在南京见面了，正如你所说，见面很难，每一天对我来说，都如数珍宝",
          tag: "旅游日记",
          position: "left",
        },
      ],
    },
    {
      year: "2025",
      events: [
        {
          date: "2025.05",
          title: "节日",
          description:
            "你趁着春假回国，来北京提前给我过生日，那束花是惊喜，蛋糕是惊喜，你存在的本身，与我而言，更是惊喜",
          tag: "节日",
          position: "right",
        },
        {
          date: "2025.09",
          title: "未来",
          description:
            "距离我们上次见面，已经过去142天了，我们终于在一个国家，从12小时时差，变成了3小时，遗憾的是，今年又不能亲自陪你迎接你的23岁，但我们的故事未完待续，我们终会更盛大的相见。",
          tag: "未来",
          position: "left",
          isFuture: true,
        },
      ],
    },
  ],
};

// 导出数据
if (typeof module !== "undefined" && module.exports) {
  module.exports = timelineData;
}
