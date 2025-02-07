'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/supabase';
import Card from '@/components/ui/Card';
import CardSections from '@/components/ui/CardSections';
import { Clipboard, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import menopauseGraphic from '@assets/img/graphic.png';
import Button from '@/components/common/Button';
import { fetchResults } from '@/utils/fetchResults';
import { Result } from '@/types/results';

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const { data: user, error: authError } = await supabase.auth.getUser();
        if (authError || !user?.user?.id)
          throw new Error('User not authenticated');

        const user_id = user.user.id;

        // Get the latest menopause assessment for the user
        const { data: latestAssessment, error: fetchError } = await supabase
          .schema('menopause_assessment')
          .from('assess_results_user')
          .select('result_id')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false }) // Get latest assessment
          .limit(1)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('No assessment found.');
            return;
          }
          throw fetchError;
        }

        if (!latestAssessment?.result_id) {
          setError('No assessment result found.');
          return;
        }

        const resultId = latestAssessment.result_id;
        console.log(`User ${user_id} latest result ID: ${resultId}`);

        // Fetch the result details
        const fetchedResult = await fetchResults(resultId);
        if (!fetchedResult) {
          setError(`Invalid result ID: ${resultId}`);
          return;
        }

        setResult(fetchedResult);
      } catch (err) {
        console.error('Error fetching latest result:', err);
        setError('Failed to fetch your assessment results.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-primary-900">
        Loading results...
      </div>
    );

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-6 px-6 text-primary-900">
        <h1 className="text-[2rem]">Oops! {error}</h1>
        <p className="text-center">
          {error === 'No assessment found.'
            ? 'It looks like you haven’t completed the menopause assessment yet.'
            : 'There was an issue retrieving your result.'}
        </p>
        <Button onClick={() => router.push('/menopause-assessment')}>
          Take the Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="w-full bg-secondary-100 px-6 pb-6 pt-14">
        <h1 className="text-[2.5rem]">Assessment complete!</h1>
      </div>

      <div className="flex flex-grow flex-col justify-between bg-background px-6 pb-16 pt-6 text-primary-900">
        <div className="space-y-8">
          <Card>
            <CardSections
              title="Your Menopause Journey"
              bodytext={result?.description || 'Loading...'}
              custom={<Image src={menopauseGraphic} alt="Menopause graphic" />}
            />
          </Card>

          <Card>
            <CardSections
              title="Common Symptoms"
              icon={<Clipboard />}
              list={result?.symptoms || ['Loading...']}
            />
          </Card>

          <Card>
            <CardSections
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
