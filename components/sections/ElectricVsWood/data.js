/**
 * Content for the "Electric vs Traditional Wood Hamam" comparison ledger.
 *
 * One entry per row of the table. `label` is the criterion (it sits in the
 * centre column on desktop and above the pair on narrow screens); `wood` and
 * `electric` each carry a short headline value and a one-line explanation.
 *
 * Keep the two `value` strings roughly the same length — they sit on the same
 * baseline in adjacent columns, and a long one on either side unbalances the
 * row. Detail belongs in `note`.
 */

export const COMPARISON = [
  {
    id: 'warmup',
    label: 'Time to full warmth',
    wood: {
      value: '3–5 hours',
      note: 'Lit early, tended throughout, waited on before the room is usable.',
    },
    electric: {
      value: '45–60 minutes',
      note: 'Switched on and left alone. The floor comes up on its own.',
    },
  },
  {
    id: 'distribution',
    label: 'Heat across the floor',
    wood: {
      value: 'Hot core, cold edges',
      note: 'Warmth pools over the furnace and falls away towards the walls.',
    },
    electric: {
      value: 'Edge to edge',
      note: 'One even temperature across the entire floor surface.',
    },
  },
  {
    id: 'air',
    label: 'Air in the room',
    wood: {
      value: 'Smoke, soot and ash',
      note: 'Flue gases and airborne particulate, with carbon monoxide to manage.',
    },
    electric: {
      value: 'Nothing burned',
      note: 'Gentle radiant heat with no combustion, no smoke and no dust.',
    },
  },
  {
    id: 'operation',
    label: 'Running it day to day',
    wood: {
      value: 'Fuel, stoke, clear ash',
      note: 'Somebody has to source firewood and tend the fire, every single day.',
    },
    electric: {
      value: 'One temperature',
      note: 'A thermostat, a weekly schedule, or your phone. Nothing else.',
    },
  },
  {
    id: 'efficiency',
    label: 'Energy actually used',
    wood: {
      value: 'Most of it up the flue',
      note: 'A large share of the heat leaves by the chimney before it reaches you.',
    },
    electric: {
      value: 'Up to 70% better',
      note: 'Insulated underneath, so the heat travels up into the room, not down.',
    },
  },
  {
    id: 'buildup',
    label: 'Floor build-up',
    wood: {
      value: 'A chamber below',
      note: 'A furnace void and masonry excavated beneath the slab.',
    },
    electric: {
      value: '2.5–3 inches',
      note: 'Insulation, heating layer and floor finish, everything included.',
    },
  },
  {
    id: 'upkeep',
    label: 'Upkeep and lifespan',
    wood: {
      value: 'Sweeping and relining',
      note: 'Seasonal maintenance for as long as the hamam stays in use.',
    },
    electric: {
      value: 'Zero maintenance',
      note: 'Sealed into the floor, backed by a 10–25 year product guarantee.',
    },
  },
  {
    id: 'install',
    label: 'Getting it installed',
    wood: {
      value: 'Weeks of wet work',
      note: 'Masonry, curing time and dust running through the whole house.',
    },
    electric: {
      value: '5–6 hours',
      note: 'Civil prep to guarantee registration, finished inside a single day.',
    },
  },
];

/** The closing verdict strip. `count` renders through CounterNumber; entries
 *  without one render their `value` as static display type. */
export const VERDICT = [
  { count: 4, suffix: '×', label: 'faster to full warmth' },
  { count: 70, suffix: '%', label: 'more energy efficient' },
  { value: 'Zero', label: 'smoke, ash or soot' },
  { count: 25, suffix: ' yr', label: 'guarantee, up to' },
];
