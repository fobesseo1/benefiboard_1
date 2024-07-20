// pages/profile.tsx

import { GetServerSidePropsContext } from 'next';

type Props = {
  userData: {
    username: string;
    avatar_url: string;
    email: string;
  } | null;
};

const ProfilePage: React.FC<Props> = ({ userData }) => {
  // userData를 사용하여 프로필 페이지를 렌더링합니다.
  return <p>{userData?.username}</p>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const cookies = req.cookies;

  let userData = null;
  if (cookies.userData) {
    userData = JSON.parse(cookies.userData);
  }

  return {
    props: {
      userData,
    },
  };
}

export default ProfilePage;
