'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { CurrentUserType } from '@/types/types';

const components_repost: { title: string; href: string; description: string }[] = [
  {
    title: '오늘의 베스트',
    href: '/repost/best',
    description: '오늘 주요 커뮤니티 베스트 포스트 모음',
  },
  {
    title: '실시간 인기',
    href: '/repoost',
    description: '실시간 주요 커뮤니티 인기 포스트 모음',
  },
];
const components_goodluck: { title: string; href: string; description: string }[] = [
  {
    title: '로또 번호 생성기',
    href: '/goodluck',
    description: '로또 번호 뽑아보기',
  },
  {
    title: '연금복권 번호 생성기',
    href: '/goodluck',
    description: '연금복권 번호 뽑아보기',
  },
];
const components_post: { title: string; href: string; description: string }[] = [
  {
    title: '인기 포스트',
    href: '/post/best',
    description: '베네피보드 인기 포스트 모음',
  },
  {
    title: '전체 포스트',
    href: '/post',
    description: '베네피보드 전체 포스트 모음',
  },
];

export default function NavigationMenu_lg({
  currentUser,
}: {
  currentUser: CurrentUserType | null;
}) {
  const components_profile: { title: string; href: string; description: string }[] = currentUser
    ? [
        {
          title: '나의 프로필',
          href: `/profile/${currentUser.id}`,
          description: '나의 프로필 보기 및 수정하기',
        },
      ]
    : [
        {
          title: '나의 프로필(로그인 필요)',
          href: `/auth`,
          description: '로그인 후 이용가능',
        },
      ];

  const components_message: { title: string; href: string; description: string }[] = currentUser
    ? [
        {
          title: '나의 메세지',
          href: `/message`,
          description: '메세지 보내기 및 확인하기',
        },
      ]
    : [
        {
          title: '나의 메세지(로그인 필요)',
          href: `/auth`,
          description: '로그인 후 이용가능',
        },
      ];
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* 인기 커뮤니티 포스트 모음*/}
        <NavigationMenuItem>
          <NavigationMenuTrigger>주요 커뮤니티 포스트 모음</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[920px]">
              {components_repost.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* 행운의 숫자*/}
        <NavigationMenuItem>
          <NavigationMenuTrigger>행운의 숫자(로또/연금복권)</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[920px]">
              {components_goodluck.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* 베네피보드 게시판*/}
        <NavigationMenuItem>
          <NavigationMenuTrigger>베네피보드 게시판</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[920px]">
              {components_post.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 프로필 */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>프로필</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[920px]">
              {components_profile.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* 메세지 */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>메세지</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[920px]">
              {components_message.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className=" text-sm font-semibold leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
