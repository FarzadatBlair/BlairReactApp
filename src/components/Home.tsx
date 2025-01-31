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
    <div className="p-4">
      {/* Upcoming Appointment */}
      <div className="mb-4 rounded-lg border p-4 shadow-sm">
        <h2 className="text-base font-bold">Upcoming Appointment</h2>
        <p className="text-sm">Dr. Amanda Shaw</p>
        <p className="text-sm text-gray-500">Today at 10:00am EST</p>
        <button className="bg-primary-600 mt-2 rounded-md px-4 py-2 text-white">
          Join Call
        </button>
      </div>

      {/* Progress Section */}
      <div className="rounded-lg border p-4 shadow-sm">
        <h2 className="text-base font-bold">Your Progress</h2>
        <ul className="space-y-2 text-sm">
          <li>✔️ Stage assessment completed</li>
          <li>✔️ Daily symptom tracking</li>
          <li>⬜ First professional consult booked</li>
          <li>⬜ Read an article</li>
        </ul>
        {/* <ButtonLink onClick={handleSignOut} variant="secondary">
                Sign Out
            </ButtonLink>
            this was for debugging */}
      </div>
      <ButtonLink
        variant="secondary"
        onClick={() => router.push('/menopause-assessment')}
      >
        Menopause Assessment
      </ButtonLink>
    </div>
  );
};

export default GetStarted;
