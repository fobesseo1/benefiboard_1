// app/_components/FooterClient.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BiDice6, BiHomeAlt2, BiMenu, BiMessageDots, BiPlusCircle } from 'react-icons/bi';
import CommonSheet from './CommonSheet';
import Link from 'next/link';
import { CurrentUserType } from '@/types/types';
import { useEffect } from 'react';

const FooterClient = ({ currentUser }: { currentUser: CurrentUserType | null }) => {
  const pathname = usePathname();
  const categoryId = pathname.split('/').pop();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/post');
    router.prefetch('/goodluck');
    router.prefetch('/message');
  }, [router]);

  return (
    <>
      <Link href="/post">
        <div className="flex flex-col justify-center items-center">
          <BiHomeAlt2 size={24} />
          <p className="text-[10px] text-gray-800 text-center">홈</p>
        </div>
      </Link>
      <Link href="/goodluck">
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiDice6 size={24} />
          <p className="text-[10px] text-gray-800 text-center">로또번호</p>
        </div>
      </Link>
      <Link href={`/post/create?categoryId=${categoryId}`}>
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiPlusCircle size={24} />
          <p className="text-[10px] text-gray-800 text-center">글쓰기</p>
        </div>
      </Link>
      <Link href="/message">
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiMessageDots size={24} />
          <p className="text-[10px] text-gray-800 text-center">메세지</p>
        </div>
      </Link>
      <CommonSheet
        currentUser={currentUser}
        triggerElement={
          <div className="flex flex-col gap-[2px] justify-center items-center cursor-pointer">
            <BiMenu size={24} />
            <p className="text-[10px] text-gray-800 text-center">전체</p>
          </div>
        }
      />
    </>
  );
};

export default FooterClient;
