import { ReactNode } from 'react';
import './emoji-scss.scss'; // scss 파일을 import 합니다.

interface EmojiProps {
  size?: string;
  children?: ReactNode;
  className?: string;
}

const EmojiWrapper: React.FC<EmojiProps> = ({ size = '120px', children, className }) => {
  const scale = parseFloat(size) / 120;
  return (
    <div
      className={`emoji-wrapper ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const EmojiLike: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--like">
      <div className="emoji__hand">
        <div className="emoji__thumb" />
      </div>
    </div>
  </EmojiWrapper>
);

export const EmojiLove: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--love">
      <div className="emoji__heart" />
    </div>
  </EmojiWrapper>
);

export const EmojiHaha: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--haha">
      <div className="emoji__face">
        <div className="emoji__eyes" />
        <div className="emoji__mouth">
          <div className="emoji__tongue" />
        </div>
      </div>
    </div>
  </EmojiWrapper>
);

export const EmojiYay: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--yay">
      <div className="emoji__face">
        <div className="emoji__eyebrows" />
        <div className="emoji__mouth" />
      </div>
    </div>
  </EmojiWrapper>
);

export const EmojiWow: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--wow">
      <div className="emoji__face">
        <div className="emoji__eyebrows" />
        <div className="emoji__eyes" />
        <div className="emoji__mouth" />
      </div>
    </div>
  </EmojiWrapper>
);

export const EmojiSad: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--sad">
      <div className="emoji__face">
        <div className="emoji__eyebrows" />
        <div className="emoji__eyes" />
        <div className="emoji__mouth" />
      </div>
    </div>
  </EmojiWrapper>
);

export const EmojiAngry: React.FC<EmojiProps> = ({ size }) => (
  <EmojiWrapper size={size}>
    <div className="emoji emoji--angry">
      <div className="emoji__face">
        <div className="emoji__eyebrows" />
        <div className="emoji__eyes" />
        <div className="emoji__mouth" />
      </div>
    </div>
  </EmojiWrapper>
);
