'use client';

import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';

const HeaderBackClick: React.FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return <BiArrowBack size={24} onClick={handleBackClick} className="cursor-pointer" />;
};

export default HeaderBackClick;
