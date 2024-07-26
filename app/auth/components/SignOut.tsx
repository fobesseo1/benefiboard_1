'use client';

import { Button } from '@/components/ui/button';
import { logout } from '../actions/logoutAction';
import { HiOutlineLogout } from 'react-icons/hi';

export default function SignOut() {
  return (
    <div className="w-full flex justify-end -mt-4 mb-12">
      <form action={logout} className="w-1/3">
        <Button variant="outline" className="w-full">
          <HiOutlineLogout size={24} className="text-gray-600" />
          &nbsp;로그아웃
        </Button>
      </form>
    </div>
  );
}
