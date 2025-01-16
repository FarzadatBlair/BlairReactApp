'use client';
import GenericPage from '@components/layout/GenericPage';

const PrivacyPolicy = () => {
  return (
    <GenericPage className="p-6">
      <h1 className="mb-2">Privacy Policy</h1>
      <p className="mb-2">
        At Blair, we are committed to protecting your privacy. This Privacy
        Policy explains how we collect, use, and share information about you
        when you use our services.
      </p>
      <h3 className="mt-4">1. Information We Collect</h3>
      <p className="mb-2">
        We may collect personal information that you provide to us, such as your
        name, email address, and any other information you choose to provide.
      </p>
      <h3 className="mt-4">2. How We Use Your Information</h3>
      <p className="mb-2">
        We use your information to provide and improve our services, communicate
        with you, and comply with legal obligations.
      </p>
      <h3 className="mt-4">3. Sharing Your Information</h3>
      <p className="mb-2">
        We do not sell or rent your personal information to third parties. We
        may share your information with service providers who assist us in
        providing our services.
      </p>
      <h3 className="mt-4">4. Security of Your Information</h3>
      <p className="mb-2">
        We take reasonable measures to protect your information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet is 100% secure.
      </p>
      <h3 className="mt-4">5. Changes to This Privacy Policy</h3>
      <p className="mb-2">
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
      </p>
      <p className="mt-4">
        If you have any questions about this Privacy Policy, please contact us
        at support@blairhealth.ca.
      </p>
    </GenericPage>
  );
};

export default PrivacyPolicy;
