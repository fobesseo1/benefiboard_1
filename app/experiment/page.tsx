import dynamic from 'next/dynamic';

const BalloonAnimation = dynamic(
  () => import('../post/_component/BalloonAnimation').then((mod) => mod.BalloonAnimation),
  { ssr: false }
);

export default function Experiment() {
  return (
    <div>
      <h2>Experiment</h2>
      <BalloonAnimation />
    </div>
  );
}
