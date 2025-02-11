'use client';
import Button from '@/components/common/Button';
import Card from '@/components/ui/Card';
import CardSection from '@/components/ui/CardSection';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Result } from '@/types/results';
import { fetchLatestResult } from '@/utils/fetchLatestResult';

const Shimmer = () => (
  <div className="h-6 animate-pulse rounded bg-gray-300"></div>
);

const GetStarted = () => {
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

  if (error) {
    console.log(error);
  }

  return (
    <div className="flex flex-grow flex-col space-y-6 p-6">
      <Card>
        {loading ? (
          <CardSection title="Loading..." custom={<Shimmer />} />
        ) : result ? (
          <CardSection title="Your menopause results" bodytext={result.title} />
        ) : (
          <CardSection title="You haven't taken the menopause assessment yet" />
        )}
      </Card>
      <Button onClick={() => router.push('/menopause-assessment')}>
        Take the menopause assessment
      </Button>
    </div>
  );
};

export default GetStarted;
