// 预设冲煮方案数据
export const PRESET_RECIPES = [
  {
    recipeId: 'v60-standard',
    name: 'V60 标准四六法',
    device: 'V60',
    coffeeWeight: 20,
    totalWater: 300,
    ratio: '1:15',
    temperature: 92,
    grindSize: 800,
    grindSizeDesc: '中细研磨',
    steps: [
      {
        stepId: 0,
        name: '闷蒸',
        waterAmount: 60,
        duration: 30,
        instruction: '轻柔注水，浸润所有粉层，形成汉堡状',
        startTime: 0,
        endTime: 30
      },
      {
        stepId: 1,
        name: '第一次注水',
        waterAmount: 110,
        duration: 60,
        instruction: '中心向外画圈注水，保持水流稳定',
        startTime: 30,
        endTime: 90
      },
      {
        stepId: 2,
        name: '第二次注水',
        waterAmount: 130,
        duration: 60,
        instruction: '继续画圈注水，避免冲到滤纸',
        startTime: 90,
        endTime: 150
      },
      {
        stepId: 3,
        name: '等待滴滤完成',
        waterAmount: 0,
        duration: 30,
        instruction: '等待所有咖啡液滴滤完成',
        startTime: 150,
        endTime: 180
      }
    ],
    tags: ['浅烘焙', '果香调', '四六法'],
    difficulty: '初级',
    isPreset: true,
    createdBy: 'system',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16')
  },
  {
    recipeId: 'chemex-classic',
    name: 'Chemex 经典冲煮',
    device: 'Chemex',
    coffeeWeight: 25,
    totalWater: 400,
    ratio: '1:16',
    temperature: 93,
    grindSize: 900,
    grindSizeDesc: '中粗研磨',
    steps: [
      {
        stepId: 0,
        name: '闷蒸',
        waterAmount: 75,
        duration: 45,
        instruction: '环绕注水，浸润咖啡粉，等待气体释放',
        startTime: 0,
        endTime: 45
      },
      {
        stepId: 1,
        name: '第一次注水',
        waterAmount: 150,
        duration: 60,
        instruction: '中心向外螺旋注水，保持稳定速度',
        startTime: 45,
        endTime: 105
      },
      {
        stepId: 2,
        name: '第二次注水',
        waterAmount: 175,
        duration: 75,
        instruction: '继续螺旋注水，注意不要冲破粉层',
        startTime: 105,
        endTime: 180
      },
      {
        stepId: 3,
        name: '等待萃取完成',
        waterAmount: 0,
        duration: 60,
        instruction: '等待咖啡液完全滴滤，总时长约 4 分钟',
        startTime: 180,
        endTime: 240
      }
    ],
    tags: ['中烘焙', '醇厚', '经典'],
    difficulty: '初级',
    isPreset: true,
    createdBy: 'system',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16')
  },
  {
    recipeId: 'aeropress-fast',
    name: '爱乐压快速萃取',
    device: 'AeroPress',
    coffeeWeight: 15,
    totalWater: 200,
    ratio: '1:13',
    temperature: 85,
    grindSize: 700,
    grindSizeDesc: '细研磨',
    steps: [
      {
        stepId: 0,
        name: '加入咖啡粉',
        waterAmount: 0,
        duration: 10,
        instruction: '放入滤纸，湿润，倒入咖啡粉并轻拍平整',
        startTime: 0,
        endTime: 10
      },
      {
        stepId: 1,
        name: '注入热水',
        waterAmount: 200,
        duration: 10,
        instruction: '快速注入全部热水，开始计时',
        startTime: 10,
        endTime: 20
      },
      {
        stepId: 2,
        name: '搅拌',
        waterAmount: 0,
        duration: 10,
        instruction: '快速搅拌 3-4 次，确保粉水混合均匀',
        startTime: 20,
        endTime: 30
      },
      {
        stepId: 3,
        name: '浸泡',
        waterAmount: 0,
        duration: 60,
        instruction: '盖上盖子，静置浸泡',
        startTime: 30,
        endTime: 90
      },
      {
        stepId: 4,
        name: '压滤',
        waterAmount: 0,
        duration: 30,
        instruction: '稳定均匀地下压，约 30 秒完成',
        startTime: 90,
        endTime: 120
      }
    ],
    tags: ['深烘焙', '醇厚', '快速'],
    difficulty: '初级',
    isPreset: true,
    createdBy: 'system',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16')
  }
]

// 风味轮数据
export const FLAVOR_WHEEL_DATA = {
  categories: [
    {
      id: 'fruity',
      name: '果香',
      color: '#FF6B6B',
      icon: '🍎',
      subcategories: [
        {
          id: 'citrus',
          name: '柑橘',
          flavors: ['橙子', '柠檬', '柚子', '柑橘']
        },
        {
          id: 'berry',
          name: '浆果',
          flavors: ['草莓', '蓝莓', '覆盆子', '黑莓']
        },
        {
          id: 'stone-fruit',
          name: '核果',
          flavors: ['桃子', '李子', '樱桃', '杏']
        },
        {
          id: 'tropical',
          name: '热带水果',
          flavors: ['芒果', '菠萝', '百香果', '荔枝']
        }
      ]
    },
    {
      id: 'floral',
      name: '花香',
      color: '#FFB6C1',
      icon: '🌸',
      subcategories: [
        {
          id: 'white-floral',
          name: '白花',
          flavors: ['茉莉', '栀子', '百合', '橙花']
        },
        {
          id: 'rose',
          name: '玫瑰',
          flavors: ['玫瑰', '月季']
        }
      ]
    },
    {
      id: 'sweet',
      name: '甜感',
      color: '#FFD700',
      icon: '🍯',
      subcategories: [
        {
          id: 'caramel',
          name: '焦糖',
          flavors: ['焦糖', '太妃糖', '枫糖']
        },
        {
          id: 'chocolate',
          name: '巧克力',
          flavors: ['黑巧克力', '牛奶巧克力', '可可']
        },
        {
          id: 'honey',
          name: '蜂蜜',
          flavors: ['蜂蜜', '糖浆']
        }
      ]
    },
    {
      id: 'nutty',
      name: '坚果',
      color: '#A0522D',
      icon: '🥜',
      subcategories: [
        {
          id: 'almond',
          name: '杏仁',
          flavors: ['杏仁', '榛子', '核桃', '花生']
        }
      ]
    },
    {
      id: 'spicy',
      name: '香料',
      color: '#CD853F',
      icon: '🌶️',
      subcategories: [
        {
          id: 'cinnamon',
          name: '肉桂',
          flavors: ['肉桂', '丁香', '肉豆蔻']
        }
      ]
    },
    {
      id: 'roasted',
      name: '烘焙',
      color: '#8B4513',
      icon: '☕',
      subcategories: [
        {
          id: 'toast',
          name: '烤面包',
          flavors: ['烤面包', '谷物', '麦芽']
        }
      ]
    },
    {
      id: 'herbal',
      name: '草本',
      color: '#90EE90',
      icon: '🌿',
      subcategories: [
        {
          id: 'tea',
          name: '茶感',
          flavors: ['红茶', '绿茶', '草本']
        }
      ]
    },
    {
      id: 'earthy',
      name: '泥土',
      color: '#8B7355',
      icon: '🌱',
      subcategories: [
        {
          id: 'woody',
          name: '木质',
          flavors: ['木质', '雪松', '烟熏']
        }
      ]
    },
    {
      id: 'others',
      name: '其他',
      color: '#808080',
      icon: '✨',
      subcategories: [
        {
          id: 'wine',
          name: '酒香',
          flavors: ['红酒', '威士忌', '兰姆']
        }
      ]
    }
  ]
}
