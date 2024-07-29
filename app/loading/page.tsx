import LoadingSkeleton from '../_components/LoadingSkeleton';
import Loading_emoji from './Loading_emoji';

export default function LoadingPage() {
  return (
    <>
      <div className="fixed inset-0 opacity-75 z-30">
        <Loading_emoji />
      </div>
      <LoadingSkeleton />
    </>
  );
}
