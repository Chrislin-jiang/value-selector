import { MicroAction } from '@/types'

export const MICRO_ACTIONS: MicroAction[] = [
  // 勇敢 (valueId: 1)
  { id: 101, valueId: 1, content: '对镜子里的自己说"我可以的"', difficulty: 1, timeContext: 'morning' },
  { id: 102, valueId: 1, content: "在一个群里发一条你的真实想法", difficulty: 1, timeContext: 'anytime' },
  { id: 103, valueId: 1, content: "给那个你一直想联系的人发条简短的消息", difficulty: 1, timeContext: 'anytime' },
  { id: 104, valueId: 1, content: "主动问一个你不确定的问题", difficulty: 2, timeContext: 'anytime' },
  { id: 105, valueId: 1, content: "拒绝一件你不想做但不好意思拒绝的事", difficulty: 2, timeContext: 'anytime' },

  // 负责 (valueId: 2)
  { id: 201, valueId: 2, content: "回复那条你一直拖着的消息", difficulty: 1, timeContext: 'anytime' },
  { id: 202, valueId: 2, content: "把桌面上的一样东西放回原处", difficulty: 1, timeContext: 'anytime' },
  { id: 203, valueId: 2, content: "完成那个拖延了最久的小任务", difficulty: 1, timeContext: 'anytime' },
  { id: 204, valueId: 2, content: "给一个承诺设定具体的截止日期", difficulty: 2, timeContext: 'morning' },
  { id: 205, valueId: 2, content: "为之前的一个过错向某人说声对不起", difficulty: 2, timeContext: 'anytime' },

  // 好奇 (valueId: 3)
  { id: 301, valueId: 3, content: "搜索一个你一直想了解的话题，读5分钟", difficulty: 1, timeContext: 'anytime' },
  { id: 302, valueId: 3, content: '问一个朋友"你最近在看什么书或剧？"', difficulty: 1, timeContext: 'anytime' },
  { id: 303, valueId: 3, content: "走一条你从没走过的路", difficulty: 1, timeContext: 'anytime' },
  { id: 304, valueId: 3, content: "尝试一种你从没吃过的食物", difficulty: 2, timeContext: 'afternoon' },
  { id: 305, valueId: 3, content: "找一个你不了解的领域，看一段入门视频", difficulty: 2, timeContext: 'evening' },

  // 温柔 (valueId: 4)
  { id: 401, valueId: 4, content: "给自己倒杯温水，慢慢喝完", difficulty: 1, timeContext: 'anytime' },
  { id: 402, valueId: 4, content: "给一个朋友发送一句真诚的赞美", difficulty: 1, timeContext: 'anytime' },
  { id: 403, valueId: 4, content: "给父母或伴侣发一条关心的消息", difficulty: 1, timeContext: 'anytime' },
  { id: 404, valueId: 4, content: "对一个犯错的人选择理解而非批评", difficulty: 2, timeContext: 'anytime' },
  { id: 405, valueId: 4, content: "写一封感谢信给某个影响过你的人", difficulty: 2, timeContext: 'evening' },

  // 专注 (valueId: 5)
  { id: 501, valueId: 5, content: "关闭手机通知，专心做一件事10分钟", difficulty: 1, timeContext: 'anytime' },
  { id: 502, valueId: 5, content: "吃饭时不看手机，感受食物的味道", difficulty: 1, timeContext: 'afternoon' },
  { id: 503, valueId: 5, content: "设定今天最重要的一件事，优先完成它", difficulty: 1, timeContext: 'morning' },
  { id: 504, valueId: 5, content: "用番茄钟法完成一个25分钟的深度工作", difficulty: 2, timeContext: 'morning' },
  { id: 505, valueId: 5, content: "今晚不刷手机，做一件真正想做的事", difficulty: 2, timeContext: 'evening' },

  // 创造 (valueId: 6)
  { id: 601, valueId: 6, content: "随手画一个涂鸦（任何东西都行）", difficulty: 1, timeContext: 'anytime' },
  { id: 602, valueId: 6, content: "用一句话描述你此刻窗外的风景", difficulty: 1, timeContext: 'anytime' },
  { id: 603, valueId: 6, content: '用手机拍一张"寻找美"的照片', difficulty: 1, timeContext: 'anytime' },
  { id: 604, valueId: 6, content: "改编一首歌的歌词变成你自己的版本", difficulty: 2, timeContext: 'anytime' },
  { id: 605, valueId: 6, content: "写一段100字以内的微小说", difficulty: 2, timeContext: 'evening' },

  // 感恩 (valueId: 7)
  { id: 701, valueId: 7, content: "写下今天让你感到幸运的一件小事", difficulty: 1, timeContext: 'evening' },
  { id: 702, valueId: 7, content: '对下一个为你服务的人说声"谢谢，辛苦了"', difficulty: 1, timeContext: 'anytime' },
  { id: 703, valueId: 7, content: "拍一张让你感到感恩的照片", difficulty: 1, timeContext: 'anytime' },
  { id: 704, valueId: 7, content: "给一个你很少感谢的人发一条感恩消息", difficulty: 2, timeContext: 'anytime' },
  { id: 705, valueId: 7, content: "写下3件今天感恩的小事", difficulty: 1, timeContext: 'evening' },

  // 活力 (valueId: 8)
  { id: 801, valueId: 8, content: "站起来伸展身体30秒", difficulty: 1, timeContext: 'anytime' },
  { id: 802, valueId: 8, content: "播放一首你喜欢的歌，跟着节奏动起来", difficulty: 1, timeContext: 'anytime' },
  { id: 803, valueId: 8, content: "走出去晒5分钟太阳", difficulty: 1, timeContext: 'morning' },
  { id: 804, valueId: 8, content: "做10个开合跳", difficulty: 1, timeContext: 'anytime' },
  { id: 805, valueId: 8, content: "用最快的速度把一件事情完成掉", difficulty: 2, timeContext: 'anytime' },

  // 平静 (valueId: 9)
  { id: 901, valueId: 9, content: "闭眼做3次深呼吸", difficulty: 1, timeContext: 'anytime' },
  { id: 902, valueId: 9, content: "观察窗外的天空30秒，什么都不想", difficulty: 1, timeContext: 'anytime' },
  { id: 903, valueId: 9, content: "写下此刻你的情绪，不评判，只记录", difficulty: 1, timeContext: 'anytime' },
  { id: 904, valueId: 9, content: "放下手机，静坐5分钟", difficulty: 2, timeContext: 'evening' },
  { id: 905, valueId: 9, content: "在感到烦躁时，先数到10再回应", difficulty: 2, timeContext: 'anytime' },

  // 连接 (valueId: 10)
  { id: 1001, valueId: 10, content: "给一个很久没联系的朋友点个赞", difficulty: 1, timeContext: 'anytime' },
  { id: 1002, valueId: 10, content: "认真听别人说话3分钟，不打断", difficulty: 1, timeContext: 'anytime' },
  { id: 1003, valueId: 10, content: "约一个朋友下周见面", difficulty: 2, timeContext: 'anytime' },
  { id: 1004, valueId: 10, content: '对一个重要的人说"你对我很重要"', difficulty: 2, timeContext: 'anytime' },
  { id: 1005, valueId: 10, content: '主动问一个朋友"最近过得怎么样？"', difficulty: 1, timeContext: 'anytime' },

  // 公正 (valueId: 11)
  { id: 1101, valueId: 11, content: "在一个讨论中尝试理解对方的立场", difficulty: 1, timeContext: 'anytime' },
  { id: 1102, valueId: 11, content: "为一个被忽视的人说一句公道话", difficulty: 2, timeContext: 'anytime' },
  { id: 1103, valueId: 11, content: "捐出一小笔钱给你关心的公益项目", difficulty: 2, timeContext: 'anytime' },
  { id: 1104, valueId: 11, content: "在做决定前，想想这对所有人是否公平", difficulty: 1, timeContext: 'anytime' },
  { id: 1105, valueId: 11, content: "承认一件你做得不够公平的事", difficulty: 2, timeContext: 'evening' },

  // 幽默 (valueId: 12)
  { id: 1201, valueId: 12, content: "给朋友发一个你觉得好笑的表情包", difficulty: 1, timeContext: 'anytime' },
  { id: 1202, valueId: 12, content: "对着镜子做一个搞笑的表情", difficulty: 1, timeContext: 'morning' },
  { id: 1203, valueId: 12, content: "用幽默的方式描述你今天遇到的一件烦事", difficulty: 1, timeContext: 'evening' },
  { id: 1204, valueId: 12, content: "在社交场合主动讲一个笑话", difficulty: 2, timeContext: 'anytime' },
  { id: 1205, valueId: 12, content: "找一段让你开心大笑的视频看", difficulty: 1, timeContext: 'anytime' },
]

export const getActionsByValueId = (valueId: number): MicroAction[] =>
  MICRO_ACTIONS.filter((a) => a.valueId === valueId && a.difficulty === 1)

export const getRandomAction = (valueId: number, excludeIds: number[] = []): MicroAction | undefined => {
  const actions = MICRO_ACTIONS.filter(
    (a) => a.valueId === valueId && a.difficulty === 1 && !excludeIds.includes(a.id)
  )
  if (actions.length === 0) return undefined
  return actions[Math.floor(Math.random() * actions.length)]
}
