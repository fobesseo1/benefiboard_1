// app/hooks/useCurrentUser.ts
'use client';

import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUserType } from '@/types/types';

// CurrentUserContext 생성
const CurrentUserContext = createContext<CurrentUserType | null | undefined>(undefined);

// Provider 컴포넌트 정의
export function CurrentUserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: CurrentUserType | null;
}) {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(initialUser);

  // 필요한 경우 여기에 사용자 정보 업데이트 로직을 추가할 수 있습니다.
  // 예: 실시간 업데이트, 로그아웃 처리 등

  return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
}

// useCurrentUser 훅 정의
export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }

  return context;
}

// 선택적: 사용자 정보 업데이트를 위한 훅
export function useUpdateCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useUpdateCurrentUser must be used within a CurrentUserProvider');
  }

  // 여기에 사용자 정보 업데이트 로직을 구현할 수 있습니다.
  // 예: API 호출을 통한 정보 갱신 등

  const updateUser = async (updates: Partial<CurrentUserType>) => {
    // API 호출 및 상태 업데이트 로직
    // 예시:
    // const updatedUser = await apiCallToUpdateUser(updates);
    // setCurrentUser(updatedUser);
  };

  return updateUser;
}
