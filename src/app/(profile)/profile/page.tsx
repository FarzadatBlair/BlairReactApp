'use client';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/actions';
import ButtonLink from '@/components/common/ButtonLink';

const GetStarted = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <>
      <ButtonLink onClick={handleSignOut} variant="secondary">
        Sign Out
      </ButtonLink>
    </>
  );
};
export default GetStarted;
