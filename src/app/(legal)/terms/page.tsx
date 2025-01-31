'use client';
import GenericPage from '@components/layout/GenericPage';

const TermsOfServicePage = () => {
  return (
    <GenericPage className="p-6">
      <h1 className="mb-2">Terms of Service</h1>
      <p className="mb-2">
        Please read these terms carefully before accessing any of Blair&apos;s
        services.
      </p>
      <h3 className="mt-4">1. Acceptance of Terms</h3>
      <p className="mb-2">
        By using our services, you confirm that you accept these Terms and that
        you agree to comply with them. If you do not agree to these terms, you
        must not use our services.
      </p>
      <h3 className="mt-4">2. Changes to Terms</h3>
      <p className="mb-2">
        We may revise these Terms from time to time. Any changes will be posted
        on this page, and your continued use of the services after changes are
        made constitutes your acceptance of the new Terms.
      </p>
      <h3 className="mt-4">3. User Responsibilities</h3>
      <p className="mb-2">
        You are responsible for your use of the services and for any content you
        provide. You agree not to use the services for any unlawful purpose or
        in a way that violates any applicable laws or regulations.
      </p>
      <h3 className="mt-4">4. Limitation of Liability</h3>
      <p className="mb-2">
        To the fullest extent permitted by law, we will not be liable for any
        indirect, incidental, special, consequential, or punitive damages
        arising from your use of the services.
      </p>
      <h3 className="mt-4">5. Governing Law</h3>
      <p className="mb-2">
        These Terms shall be governed by and construed in accordance with the
        laws of the jurisdiction in which Blair operates.
      </p>
      <p className="mt-4">
        If you have any questions about these Terms, please contact us at
        support@blairhealth.ca.
      </p>
    </GenericPage>
  );
};

export default TermsOfServicePage;
