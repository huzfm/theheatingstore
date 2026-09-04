'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const SECTION = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Information You Provide Directly',
        items: [
          'Name, email address, phone number, and shipping/billing address',
          'Order and payment details (processed via our payment gateway; we do not store full card numbers)',
          'Information submitted through contact forms, quote requests, or customer support inquiries',
          'Any information you provide when creating an account',
        ],
      },
      {
        subtitle: '1.2 Information Collected Automatically',
        items: [
          'IP address, browser type, device type, and operating system',
          'Pages visited, time spent on pages, referring URLs, and click behavior',
          'Approximate location (derived from IP address)',
        ],
      },
      {
        subtitle: '1.3 Information from Cookies and Tracking Technologies',
        text: 'We use cookies, pixels, and similar tracking technologies, including:',
        items: [
          'Meta Pixel and Meta Conversions API — to measure the effectiveness of our advertising on Facebook and Instagram, build audiences for future ads, and understand how visitors interact with our Site after seeing or clicking on a Meta ad.',
          'Google Analytics (if applicable) — to understand Site usage and improve user experience.',
          'Functional cookies necessary for the Site to operate correctly (e.g., shopping cart persistence).',
        ],
      },
    ],
  },
  {
    id: 'meta-business-tools',
    title: '2. How We Use Meta Business Tools',
    content: [
      {
        text: 'We use Meta Pixel and/or the Meta Conversions API on our Site. This means:',
        items: [
          'When you visit our Site or take an action (such as viewing a product, adding an item to your cart, or completing a purchase), certain data about that interaction may be shared with Meta Platforms, Inc. ("Meta").',
          'This data may include your IP address, browser and device information, pages visited, and actions taken on our Site (referred to as "event data").',
          'Where legally required, this data may be shared in hashed (encrypted) form to help protect your identity.',
          'Meta may use this information, combined with information Meta already has about you, to help us measure the effectiveness of our advertising, deliver more relevant ads to you, and build custom or lookalike audiences for future advertising.',
          'Meta acts as an independent data controller for the data it receives through these tools. You can learn more about how Meta collects and processes data at Meta\'s own Privacy Policy and Cookie Policy.',
          'You can control how Meta uses this information for ads by adjusting your ad preferences directly in your Facebook or Instagram account settings, or by opting out of interest-based advertising through the Digital Advertising Alliance or Your Online Choices (EU visitors).',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    content: [
      {
        text: 'We use the information we collect to:',
        items: [
          'Process and fulfill your orders, including shipping and installation-related communication',
          'Respond to inquiries and provide customer support',
          'Send order confirmations, shipping updates, and (with your consent) promotional communications',
          'Improve our Site, products, and services',
          'Measure and optimize our advertising, including campaigns run through Meta (Facebook/Instagram)',
          'Detect, prevent, and address fraud, security, or technical issues',
          'Comply with legal obligations',
        ],
      },
    ],
  },
  {
    id: 'how-we-share',
    title: '4. How We Share Your Information',
    content: [
      {
        text: 'We do not sell your personal information. We may share your information with:',
        items: [
          'Service providers — payment processors, shipping/logistics partners, and IT service providers who help us operate the Site, strictly for the purpose of providing their services to us.',
          'Advertising partners — including Meta Platforms, Inc., as described in Section 2 above.',
          'Legal authorities — where required by law, court order, or to protect our legal rights.',
          'Business transfers — in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    content: [
      {
        text: 'Cookies are small text files stored on your device. We use cookies to:',
        items: [
          'Keep you logged in and remember your cart',
          'Understand how visitors use our Site',
          'Deliver and measure the performance of our advertising (including Meta Pixel)',
        ],
        extra: 'You can control or disable cookies through your browser settings. Disabling cookies may affect certain features of the Site, such as cart functionality.',
      },
    ],
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: [
      {
        text: 'We retain your personal information for as long as necessary to fulfill the purposes described in this policy, including to comply with legal, accounting, or reporting requirements. Order and transaction records are typically retained for seven (7) years in accordance with applicable Indian tax and business record-keeping laws.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    content: [
      {
        text: 'Depending on your location, you may have the right to:',
        items: [
          'Access the personal information we hold about you',
          'Request correction of inaccurate information',
          'Request deletion of your personal information',
          'Withdraw consent for marketing communications at any time',
          'Object to or restrict certain processing of your data',
        ],
        extra: 'To exercise any of these rights, contact us at info@theheatingstore.in.\n\nIf you are located in the European Economic Area, you also have the right to lodge a complaint with your local data protection authority.',
      },
    ],
  },
  {
    id: 'data-security',
    title: '8. Data Security',
    content: [
      {
        text: 'We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    id: 'childrens-privacy',
    title: "9. Children's Privacy",
    content: [
      {
        text: 'Our Site is not directed at children under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.',
      },
    ],
  },
  {
    id: 'third-party-links',
    title: '10. Third-Party Links',
    content: [
      {
        text: 'Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review the privacy policies of any third-party sites you visit.',
      },
    ],
  },
  {
    id: 'international-transfers',
    title: '11. International Data Transfers',
    content: [
      {
        text: 'Your information may be transferred to, and processed in, countries other than the country in which you reside, including the United States (where Meta and other service providers may process data). By using our Site, you consent to such transfers.',
      },
    ],
  },
  {
    id: 'changes',
    title: '12. Changes to This Privacy Policy',
    content: [
      {
        text: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.',
      },
    ],
  },
  {
    id: 'contact',
    title: '13. Contact Us',
    content: [
      {
        text: 'If you have questions or concerns about this Privacy Policy or our data practices, please contact us:',
      },
    ],
  },
];

export default function PrivacyPolicyClient() {
  const reduce = useReducedMotion();

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #2B1E1A 0%, #1A1210 40%, #0F0B09 100%)',
      }}
    >
      {/* Top seam light */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(232,147,58,0.55) 50%, transparent 100%)',
        }}
      />

      {/* Warm bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 34% at 50% 0%, rgba(184,107,69,0.26), transparent 68%)',
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')", opacity: 0.035 }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pt-32 pb-24 sm:px-10 lg:pt-40 lg:pb-32">
        {/* Header */}
        <motion.div {...rise(0)}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            Privacy Policy
          </h1>
        </motion.div>

        <motion.div
          {...rise(0.1)}
          className="mt-4 flex flex-wrap gap-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'rgba(226,212,199,0.55)',
          }}
        >
          <span>Effective Date: 4 September 2026</span>
          <span aria-hidden>·</span>
          <span>Last Updated: 4 September 2026</span>
        </motion.div>

        <motion.div
          {...rise(0.15)}
          className="mt-6 h-px w-24 origin-left"
          style={{
            background:
              'linear-gradient(90deg, rgba(232,147,58,0.85), transparent)',
          }}
        />

        {/* Intro */}
        <motion.p
          {...rise(0.2)}
          className="mt-10"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15.5,
            lineHeight: 1.85,
            color: 'rgba(226,212,199,0.82)',
          }}
        >
          TheHeatingStore (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;)
          operates the website{' '}
          <strong className="text-[#E8933A]">theheatingstore.in</strong> (the
          &quot;Site&quot;). This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our Site,
          interact with our advertisements, or make a purchase from us.
        </motion.p>

        <motion.p
          {...rise(0.25)}
          className="mt-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15.5,
            lineHeight: 1.85,
            color: 'rgba(226,212,199,0.82)',
          }}
        >
          By using our Site, you agree to the collection and use of information
          in accordance with this policy.
        </motion.p>

        {/* Sections */}
        <div className="mt-14 space-y-14">
          {SECTION.map((section, i) => (
            <motion.div key={section.id} {...rise(0.15 + i * 0.04)}>
              <h2
                className="border-t border-white/[0.09] pt-8"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.005em',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                {section.title}
              </h2>

              <div className="mt-5 space-y-5">
                {section.content.map((block, j) => (
                  <div key={j}>
                    {block.subtitle && (
                      <h3
                        className="mb-3"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'rgba(232,147,58,0.9)',
                        }}
                      >
                        {block.subtitle}
                      </h3>
                    )}

                    {block.text && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          lineHeight: 1.85,
                          color: 'rgba(226,212,199,0.78)',
                        }}
                      >
                        {block.text}
                      </p>
                    )}

                    {block.items && (
                      <ul className="mt-3 space-y-2.5 pl-5">
                        {block.items.map((item, k) => (
                          <li
                            key={k}
                            className="relative"
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 15,
                              lineHeight: 1.8,
                              color: 'rgba(226,212,199,0.78)',
                              listStyleType: 'disc',
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {block.extra && (
                      <p
                        className="mt-4"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          lineHeight: 1.85,
                          color: 'rgba(226,212,199,0.78)',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {block.extra}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact block for Section 13 */}
        <motion.div
          {...rise(0.5)}
          className="mt-14 rounded-lg border border-white/[0.09] p-8"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <p
            className="text-lg font-semibold"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.88)',
            }}
          >
            TheHeatingStore
          </p>
          <dl className="mt-4 space-y-2">
            {[
              { label: 'Email', value: 'info@theheatingstore.in' },
              { label: 'Phone', value: '+91 90709 07035' },
              {
                label: 'Address',
                value: 'Rajbagh, Srinagar, Jammu and Kashmir 190008, India',
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <dt
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.34)',
                    minWidth: 80,
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    color: 'rgba(226,212,199,0.82)',
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          {...rise(0.55)}
          className="mt-12 border-t border-white/[0.07] pt-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            lineHeight: 1.8,
            color: 'rgba(226,212,199,0.45)',
          }}
        >
          This Privacy Policy is intended to comply with Meta&apos;s Business
          Tools Terms and Meta Advertising Policies, which require businesses
          using Meta Pixel or Conversions API to disclose their data collection
          and sharing practices to website visitors. It is also intended to align
          with applicable Indian data protection requirements (Information
          Technology Act, 2000 and associated rules). This document is provided
          as a starting template and does not constitute legal advice — we
          recommend having it reviewed by a qualified legal professional before
          publishing, particularly if you serve customers outside India (e.g.,
          EU/GDPR or California/CCPA considerations).
        </motion.p>
      </div>
    </section>
  );
}
