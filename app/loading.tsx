import { EmojiHaha } from './_emoji-gather/emoji-gather';
import './loading.css';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative flex flex-col items-center justify-center">
        <div className="animate-ping rounded-full h-52 w-52 border-t-2 border-b-2 border-pink-600"></div>
        <div className="absolute inset-0 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <img src="/logo-benefiboard.svg" alt="logo" className="w-32 h-12 mt-4 animate-pulse" />
            <h2 className="-mt-2 text-xl text-pink-400 animate-pulse">loading...</h2>
          </div>
          <EmojiHaha />
        </div>
      </div>
    </div>
  );
}
