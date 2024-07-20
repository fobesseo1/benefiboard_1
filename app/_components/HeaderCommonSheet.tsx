'use client';

import { RxHamburgerMenu } from 'react-icons/rx';
import CommonSheet from './CommonSheet';
import { CurrentUserType } from '@/types/types';

interface HeaderCommonSheetProps {
  currentUser: CurrentUserType | null;
}

const HeaderCommonSheet: React.FC<HeaderCommonSheetProps> = ({ currentUser }) => {
  return (
    <CommonSheet
      currentUser={currentUser}
      triggerElement={
        <div className="flex flex-col items-center cursor-pointer">
          <RxHamburgerMenu size={24} />
          <p className="text-xs tracking-tighter text-gray-600 hidden lg:block">전체메뉴</p>
        </div>
      }
    />
  );
};

export default HeaderCommonSheet;
