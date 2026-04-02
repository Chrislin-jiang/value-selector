export const QUESTIONS: string[] = [
  '今天，你更想成为哪种人？',
  '如果今天只能展现一个品质，你选哪个？',
  '此刻你的内心在呼唤什么？',
  '今天你想用什么方式对待这个世界？',
  '回到床上前，你希望今天的自己被哪个词定义？',
]

export const getRandomQuestion = (): string => {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
}
