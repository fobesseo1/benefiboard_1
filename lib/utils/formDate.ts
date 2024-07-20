import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function listformatDate(created_at: string) {
  // 현재 날짜와 시간을 한국 시간으로 변환
  const now = dayjs().tz('Asia/Seoul');
  const today = now.format('YYYY-MM-DD'); // 'YYYY-MM-DD' 형식으로 오늘 날짜 추출

  // 게시물 작성 시간은 이미 한국 시간이라고 가정
  const [datePart, timePart] = created_at.split('T'); // 날짜와 시간을 분리

  if (datePart === today) {
    // 오늘 날짜인 경우 시간 부분만 추출하여 반환
    const [hours, minutes] = timePart.split(':');
    return `${hours}:${minutes}`;
  } else {
    // 오늘 날짜가 아닌 경우 날짜 부분만 추출하여 반환
    const [, month, day] = datePart.split('-');
    return `${month}-${day}`;
  }
}

export function postformatDate(created_at: string) {
  const datePart = created_at.split('T')[0]; // '2024-06-05' 부분 추출
  const timePart = created_at.split('T')[1]; // '06:58:23.404661+00' 부분 추출
  const [, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');

  return `${month}-${day} ${hours}:${minutes}`;
}
