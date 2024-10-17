import Link from "next/link";

export default function DataPolicyPage() {
  return (
    <div className="min-h-screen w-full max-w-[1272px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Data Policy</h1>

      <div className="prose max-w-3xl mx-auto">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create or modify your account, request on-demand services, contact
          customer support, or otherwise communicate with us...
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We may use the information we collect about you to provide, maintain,
          and improve our Services, such as to...
        </p>

        <h2>3. Sharing of Information</h2>
        <p>
          We may share the information we collect about you as described in this
          policy or as disclosed at the time of collection or sharing, including
          as follows...
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to provide our
          services and for other essential purposes such as complying with our
          legal obligations, resolving disputes, and enforcing our agreements...
        </p>

        <h2>5. Security</h2>
        <p>
          We take reasonable measures to help protect information about you from
          loss, theft, misuse and unauthorized access, disclosure, alteration
          and destruction...
        </p>

        <h2>6. Your Choices</h2>
        <p>
          You may update, correct or delete information about you at any time by
          logging into your online account or by contacting us...
        </p>

        <h2>7. Changes to this Policy</h2>
        <p>
          We may change this policy from time to time. If we make changes, we
          will notify you by revising the date at the top of the policy...
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us{" "}
          <Link href="/contact-us">here</Link>
        </p>
      </div>
    </div>
  );
}
