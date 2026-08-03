import MeasuringUpClient from './MeasuringUpClient';

export const metadata = {
  title: 'Heatable Area Calculator | How to Measure Up for Underfloor Heating',
  description:
    'Work out how much of your floor can actually be heated. Measure the room, deduct fixed furniture and fittings, apply the 10% perimeter allowance, and get the figure an underfloor heating quote is built from.',
  keywords: [
    'heatable area calculator',
    'measure room for underfloor heating',
    'underfloor heating sizing calculator',
    'fixed furniture deductions underfloor heating',
    'underfloor heating perimeter allowance',
    'how much underfloor heating do I need',
  ],
  openGraph: {
    title: 'Heatable Area Calculator | How to Measure Up for Underfloor Heating',
    description:
      'Three measurements, and the number a quote is built from. Free calculator.',
    type: 'article',
  },
  alternates: { canonical: '/measuring-up' },
};

export default function MeasuringUpPage() {
  return <MeasuringUpClient />;
}
