import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full max-w-[1272px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Terms of Service</h1>

      <div className="prose max-w-3xl mx-auto">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these
          Terms of Service and all applicable laws and regulations...
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Our company provides [brief description of your service]. We reserve
          the right to modify, suspend or discontinue the service at any time
          without notice...
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You may need to create an account to use some of our services. You are
          responsible for maintaining the confidentiality of your account
          information...
        </p>

        <h2>4. User Conduct</h2>
        <p>
          You agree not to use the service for any unlawful purpose or in any
          way that interrupts, damages, or impairs the service...
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          The service and its original content, features, and functionality are
          owned by [Your Company Name] and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual
          property or proprietary rights laws...
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever...
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          In no event shall [Your Company Name], nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential or punitive damages...
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country/State], without regard to its conflict of law
          provisions...
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time...
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us{" "}
          <Link href="/contact-us">here</Link>
        </p>
      </div>
    </div>
  );
}
