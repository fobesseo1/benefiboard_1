import LoadingSkeleton from './_components/LoadingSkeleton';
import { EmojiHaha } from './_emoji-gather/emoji-gather';
import './loading.css';
import Loading_emoji from './loading/Loading_emoji';

export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 opacity-75 z-30">
        <Loading_emoji />
      </div>
      <LoadingSkeleton />
    </>
  );
}
