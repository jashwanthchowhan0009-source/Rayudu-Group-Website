/**
 * Single source of truth for the Rayudu Group ecosystem.
 *
 * `position` / `normal` are the model-viewer hotspot coordinates, sampled from
 * the eagle geometry itself (face, wings, claws, back, breast) — they travel
 * with the mesh, so hotspots stay attached during every camera move.
 *
 * `view`   optional [theta, phi] camera override, degrees.
 * `zoom`   orbit radius as a fraction of the hero framing radius.
 * `arc`    concentric-system arc: [radius, startAngle, endAngle] (0 = 12 o'clock).
 */
export const SECTORS = [
  {
    id: 'ronohub',
    slot: 'hotspot-2',
    label: 'Ronohub / Intelligence',
    name: 'RONOHUB',
    sector: 'Business Intelligence',
    body: 'Predictive intelligence and data-driven decision architecture designed to help businesses understand risk, relationships and opportunity.',
    detail: ['Predictive intelligence', 'Big-data decision architecture', 'Risk assessment', 'Analytics'],
    accent: '#111C4A',
    accentLine: '#7C8AC8',
    position: '-0.0037m 0.8028m 0.7959m',
    normal: '0.0191m 0.7219m 0.6917m',
    view: [0, 71],
    zoom: 0.92,
    arc: [196, -22, 22]
  },
  {
    id: 'ogin',
    slot: 'hotspot-3',
    label: 'Ogin Logistics',
    name: 'OGIN LOGISTICS',
    sector: 'Supply Chain & Logistics',
    body: 'Multimodal logistics moving freight, materials and components across ocean, air and road — engineered for industrial scale.',
    detail: ['Multimodal logistics', 'Ocean & air freight', 'Mining logistics', 'Automotive supply chain', 'Container management'],
    accent: '#FF5A3C',
    accentLine: '#FF8A72',
    position: '-0.586m 1.1995m 0.2672m',
    normal: '-0.4901m 0.3811m 0.784m',
    zoom: 0.98,
    arc: [300, -78, -18]
  },
  {
    id: 'tech',
    slot: 'hotspot-4',
    label: 'Tech / Cybersecurity',
    name: 'RAYUDU TECH',
    sector: 'Technology & Cybersecurity',
    body: 'Enterprise software and digital architecture, secured end to end — with specialist technology staffing behind it.',
    detail: ['Enterprise software', 'Digital architecture', 'Cybersecurity', 'IT staffing'],
    accent: '#111C4A',
    accentLine: '#8FA0D8',
    position: '0.1347m 0.7418m 0.473m',
    normal: '0.962m -0.0152m 0.2726m',
    zoom: 1.08,
    arc: [196, 56, 110]
  },
  {
    id: 'blacore',
    slot: 'hotspot-7',
    label: 'Blacore / Energy & Commodities',
    name: 'BLACORE',
    sector: 'Energy & Commodities',
    body: 'Industrial coal importing and nationwide commodity distribution serving heavy industry.',
    detail: ['Industrial coal importing', 'Nationwide commodity distribution', 'Heavy-industry supply'],
    accent: '#9E2432',
    accentLine: '#D4707A',
    position: '0.0757m 0.0603m 0.3882m',
    normal: '0.7498m 0.1452m 0.6456m',
    zoom: 1.02,
    arc: [300, 118, 170]
  },
  {
    id: 'global',
    slot: 'hotspot-9',
    label: 'India / USA',
    name: 'GLOBAL NETWORK',
    sector: 'India + USA',
    body: 'A strategic presence connecting Indian operations with a broader North American footprint.',
    detail: ['Anantapur, Andhra Pradesh — India', 'Sheridan, Wyoming — USA', 'India — North America corridor'],
    accent: '#FFFFFF',
    accentLine: '#FFFFFF',
    position: '0.6736m 1.4222m 0.1224m',
    normal: '-0.6863m 0.6575m 0.311m',
    view: [38, 56],
    zoom: 1.0,
    arc: [408, 16, 76]
  },
  {
    id: 'media',
    slot: 'hotspot-10',
    label: 'Film Financing / Media',
    name: 'MEDIA & ENTERTAINMENT',
    sector: 'Film Financing & IP',
    body: 'Structured film financing, intellectual property management and creative investment.',
    detail: ['Structured film financing', 'IP management', 'Creative investment'],
    accent: '#4B183F',
    accentLine: '#B377A5',
    position: '-0.0473m 0.687m 0.0811m',
    normal: '0.1603m 0.8724m -0.4617m',
    view: [163, 62],
    zoom: 1.0,
    arc: [408, 190, 250]
  },
  {
    id: 'dazzlon',
    slot: 'hotspot-11',
    label: 'Dazzlon / Consumer Wellness',
    name: 'DAZZLON',
    sector: 'Consumer Wellness',
    body: 'Science-backed skincare and personal care, built around sustainable everyday lifestyle products.',
    detail: ['Science-backed skincare', 'Personal care', 'Sustainable lifestyle products'],
    accent: '#4B183F',
    accentLine: '#C98FB4',
    position: '-0.0007m 0.5516m 0.4483m',
    normal: '0.0158m -0.5698m 0.8216m',
    zoom: 0.86,
    arc: [196, 150, 214]
  }
];

/** Hero framing: front, slightly above, eagle sitting a little above centre. */
export const HERO = {
  theta: 0,
  phi: 76,
  radius: '108%',
  target: '0m 0.62m 0m'
};
