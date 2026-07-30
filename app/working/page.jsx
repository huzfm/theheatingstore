import WorkingClient from './WorkingClient';

export const metadata = {
  title: 'How Underfloor Heating Works | Electric Hamam Explained',
  description:
    'The physics of electric hamam underfloor heating: radiant heat instead of blown air, the floor layers from carpet down to insulation, thermostat control, and what it costs to run in Kashmir.',
  keywords: [
    'how underfloor heating works',
    'radiant floor heating explained',
    'electric hamam working principle Kashmir',
    'underfloor heating layers',
    'underfloor heating thermostat',
    'underfloor heating running cost Kashmir',
  ],
  openGraph: {
    title: 'How Underfloor Heating Works | Electric Hamam Explained',
    description:
      'Radiant heat instead of blown air. The floor layers, the thermostat, and the running cost, explained.',
    type: 'article',
  },
  alternates: { canonical: '/working' },
};

export default function WorkingPage() {
  return <WorkingClient />;
}
