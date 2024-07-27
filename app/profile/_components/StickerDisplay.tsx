interface StickerGradeDetails {
  title: string;
  color: string;
}

type StickerData = Record<
  string,
  {
    bronze: StickerGradeDetails;
    silver: StickerGradeDetails;
    gold: StickerGradeDetails;
  }
>;

const sticker: StickerData = {
  dolphin: {
    bronze: {
      title: '자연보호',
      color: '#CD7F32',
    },
    silver: {
      title: '자연보호',
      color: '#C0C0C0',
    },
    gold: {
      title: '자연보호',
      color: '#FFD700',
    },
  },
  grandmother: {
    bronze: {
      title: '노인공경',
      color: '#CD7F32',
    },
    silver: {
      title: '노인공경',
      color: '#C0C0C0',
    },
    gold: {
      title: '노인공경',
      color: '#FFD700',
    },
  },
  fireman: {
    bronze: {
      title: '불조심',
      color: '#CD7F32',
    },
    silver: {
      title: '불조심',
      color: '#C0C0C0',
    },
    gold: {
      title: '불조심',
      color: '#FFD700',
    },
  },
  hunter: {
    bronze: {
      title: '포인트사냥꾼',
      color: '#CD7F32',
    },
    silver: {
      title: '포인트사냥꾼',
      color: '#C0C0C0',
    },
    gold: {
      title: '포인트사냥꾼',
      color: '#FFD700',
    },
  },
  // 다른 카테고리 및 등급을 추가하려면 여기 추가
};

type StickerDisplayProps = {
  type: keyof typeof sticker;
  level: number;
};

const getGrade = (level: number): keyof typeof sticker.dolphin => {
  if (level >= 1 && level <= 30) {
    return 'bronze';
  } else if (level >= 31 && level <= 70) {
    return 'silver';
  } else if (level >= 71 && level <= 99) {
    return 'gold';
  } else {
    throw new Error('Invalid level');
  }
};

const StickerDisplay = ({ type, level }: StickerDisplayProps) => {
  const grade = getGrade(level);
  const stickerType = sticker[type]?.[grade];
  const src = `/sticker/${type}.webp`;

  if (!stickerType) {
    return <div>스티커 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mt-2 col-span-1 rounded-full flex flex-col gap-1 items-center justify-center">
      {/* 이미지부분 */}
      <div className="w-24 h-24 flex flex-col items-center justify-center relative border-b-2 border-gray-200">
        <img src={src} alt="sticjerImage" className="object-cover hover:animate-bounce" />
        <div
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex  justify-center items-center"
          style={{ backgroundColor: stickerType.color }}
        >
          <p className="text-sm font-semibold tracking-tighter">
            <span className="text-xs text-gray-600 tracking-tighter">lv.</span>
            {level}
          </p>
        </div>
      </div>
      {/* 텍스트 부분 */}
      <div className="flex flex-col">
        <p className="font-semibold">lv.{level}</p>
        <p className="font-semibold">{stickerType.title}</p>
      </div>
    </div>
  );
};

const StickerDisplayComponent = () => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <StickerDisplay type="dolphin" level={24} />
      <StickerDisplay type="dolphin" level={32} />
      <StickerDisplay type="dolphin" level={72} />
      <StickerDisplay type="grandmother" level={24} />
      <StickerDisplay type="grandmother" level={35} />
      <StickerDisplay type="grandmother" level={75} />
      <StickerDisplay type="fireman" level={28} />
      <StickerDisplay type="fireman" level={40} />
      <StickerDisplay type="fireman" level={80} />
      <StickerDisplay type="hunter" level={26} />
      <StickerDisplay type="hunter" level={45} />
      <StickerDisplay type="hunter" level={68} />
      {/* 필요한 만큼 더 많은 스티커 추가 */}
    </div>
  );
};

export default StickerDisplayComponent;
