//app>post>_action>adPoint.ts
/* 1원 = 20point */

/* export const calculatePoints = (): number[] => {
  const rounds = 7 + Math.floor(Math.random() * 3); // 7 ~ 9 사이의 숫자
  const points: number[] = new Array(rounds).fill(0);
  let sum = 0;
  let bigPointIndex = Math.floor(Math.random() * rounds);

  for (let i = 0; i < rounds; i++) {
    if (i === bigPointIndex) {
      points[i] = 20 + Math.floor(Math.random() * 11); // 20 ~ 30 사이의 숫자
    } else {
      points[i] = Math.floor(Math.random() * 4); // 0 ~ 3 사이의 숫자
    }
    sum += points[i];
  }

  // 총합이 35가 아니면 다시 계산
  while (sum !== 35) {
    sum = 0;
    bigPointIndex = Math.floor(Math.random() * rounds);
    for (let i = 0; i < rounds; i++) {
      if (i === bigPointIndex) {
        points[i] = 20 + Math.floor(Math.random() * 11); // 20 ~ 30 사이의 숫자
      } else {
        points[i] = Math.floor(Math.random() * 4); // 0 ~ 3 사이의 숫자
      }
      sum += points[i];
    }
  }

  return points;
}; */

export const calculatePoints = (): number => {
  const random = Math.random();
  if (random < 1/8) return 0;  // 1/8 확률로 0 포인트
  if (random < 3/8) return 1;  // 2/8 확률로 1 포인트
  if (random < 5/8) return 2;  // 2/8 확률로 2 포인트
  if (random < 7/8) return 3;  // 2/8 확률로 3 포인트
  return 25;  // 1/8 확률로 25 포인트
};
