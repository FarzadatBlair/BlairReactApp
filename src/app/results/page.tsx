'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLatestResult } from '@utils/fetchLatestResult';
import Card from '@/components/ui/Card';
import CardSection from '@/components/ui/CardSection';
import { Clipboard, ThumbsUp } from 'lucide-react';
import Button from '@/components/common/Button';
import { Result } from '@/types/results';

// import Image from 'next/image';
// import menopauseGraphic from '@assets/img/graphic.png';

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getResult = async () => {
      try {
        const fetchedResult = await fetchLatestResult();
        setResult(fetchedResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    getResult();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-primary-900">
        Loading results...
      </div>
    );

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-6 bg-background px-6 text-primary-900">
        <h2>Oops! {error}</h2>
        <p className="text-center text-error-500">
          {error === 'No assessment found.'
            ? "It looks like you haven't completed the menopause assessment yet."
            : 'There was an issue retrieving your result.'}
        </p>
        <Button onClick={() => router.push('/menopause-assessment')}>
          Take the menopause assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full bg-secondary-100 px-6 pb-6 pt-14">
        <h1 className="text-[2.5rem]">Assessment complete!</h1>
      </header>

      <div className="flex flex-grow flex-col bg-background px-6 pb-16 pt-6 text-primary-900">
        <div className="flex-grow space-y-6 pb-16">
          <Card>
            <CardSection
              title={result?.title || 'Loading...'}
              bodytext={result?.description || 'Loading...'}
              // custom={<Image src={menopauseGraphic} alt="Menopause graphic" />}
            />
          </Card>

          <Card>
            <CardSection
              title="Common Symptoms"
              icon={<Clipboard />}
              list={result?.symptoms || ['Loading...']}
            />
          </Card>

          <Card>
            <CardSection
              title="Next Steps"
              list={result?.nextSteps || ['Loading...']}
              icon={<ThumbsUp />}
            />
          </Card>
        </div>

        <Button onClick={() => router.push('/')}>Take me home</Button>
      </div>
    </div>
  );
};

export default ResultsPage;
