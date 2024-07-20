// app/_components/Footer.tsx
import { CurrentUserType } from '@/types/types';
import FooterClient from './FooterClient';

const Footer = ({ currentUser }: { currentUser: CurrentUserType | null }) => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 h-16 w-screen bg-white flex items-center justify-between px-9 rounded-t-2xl border-[1px] border-gray-200 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:hidden">
      <FooterClient currentUser={currentUser} />
    </footer>
  );
};

export default Footer;
