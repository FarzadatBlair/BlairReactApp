'use client';
import React from 'react';
import resultsData from '@data/results.json';
import GenericPage from '@components/layout/GenericPage';
import Card from '@/components/ui/Card';
import CardSections from '@/components/ui/CardSections';
import { Clipboard, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  // Dynamically fetch the first result for now
  const result = resultsData[0];
  const router = useRouter();

  return (
    <>
      <div className="w-full bg-secondary-100 py-9 text-center">
        <h1>Assessment complete!</h1>
      </div>
      <GenericPage>
        <div className="flex flex-col space-y-8">
          <Card>
            <CardSections
              title="Your Menopause Journey"
              bodytext={result.desc}
              custom={<img src="./img/graphic.png" alt="Doctor" />}
            />
          </Card>

          <Card>
            <CardSections
              title="Common Symptoms"
              icon={<Clipboard />}
              list={result.symptoms}
            />
          </Card>

          <Card>
            <CardSections
              title="Next Steps"
              list={result.nextSteps}
              icon={<ThumbsUp />}
            />
          </Card>
        </div>
        <button
          className="mt-4 w-full rounded-lg border border-[#6d4c41] bg-white px-4 py-2 font-semibold text-[#6d4c41] hover:bg-[#fbe9e7]"
          onClick={() => router.push('/')}
        >
          Take me home
        </button>
      </GenericPage>
    </>
  );
};

export default Page;
