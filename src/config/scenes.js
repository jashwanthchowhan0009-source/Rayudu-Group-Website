import { COLOR, TINT } from './theme.js';

/**
 * The whole experience is one scroll through ten declarative scene states.
 *
 * camera   theta/phi in degrees, radius as a fraction of the model-viewer
 *          framing radius, target in model space (metres). Sector targets are
 *          baked 60% of the way from the hero target to the hotspot, so the
 *          camera always lands on real geometry.
 * shift    lateral push of the look-at point, scaled to the scene's zoom:
 *          the typography sits BEHIND the sculpture, so the two overlap at
 *          the edges without the sculpture swallowing the words.
 * bg       the colour field this scene lives in.
 * accent   drives the glow, the arc, the hotspot ring and the small type.
 * front    render the type in front of the sculpture (needs clickable links).
 *
 * Copy is Rayudu Group's own, from rayudugroup.in.
 */
export const SCENES = [
  {
    id: 'opening',
    label: 'Opening',
    hero: true,
    camera: { theta: 0, phi: 97, radius: 0.94, target: [0, 0.70, 0] },
    shift: 0,
    bg: '#15091A', accent: COLOR.purple, line: TINT.rose,
    align: 'left',
    eyebrow: 'Enterprise ecosystem',
    title: 'Rayudu&#8203;Group',
    body: 'Built for everyday life.<br>Inspired by tomorrow.',
    note: 'A growing ecosystem of businesses, built around real life.'
  },
  {
    id: 'ecosystem',
    label: 'The Group',
    camera: { theta: -24, phi: 72, radius: 1.02, target: [0, 0.66, 0] },
    shift: 0.30,
    bg: '#0D0C1C', accent: COLOR.navy, line: TINT.navy,
    align: 'right',
    eyebrow: 'Business with purpose',
    title: 'One group<br>many possibilities',
    body: 'An Indian conglomerate spanning twelve forward-looking enterprises — from agronomy to digital infrastructure. Built for scale, guided by ethics.',
    meta: ['Founded 20 June 2023', 'Anantapur · India', 'Sheridan · USA']
  },
  {
    id: 'ronohub',
    glass: true,
    label: 'Ronohub',
    hotspot: 'hotspot-2',
    camera: { theta: 0, phi: 74, radius: 0.34, target: [-0.004, 0.803, 0.796] },
    shift: 0.30,
    bg: '#07121F', accent: COLOR.blue, line: TINT.blue,
    align: 'right',
    eyebrow: 'Business intelligence',
    title: 'Ronohub',
    body: 'Advanced business intelligence platforms that let organisations gather, analyse and transform large volumes of structured and unstructured data — powering informed decisions and risk assessment across diverse industries.',
    meta: ['Decision architecture', 'Risk assessment', 'Predictive analytics']
  },
  {
    id: 'ogin',
    glass: true,
    label: 'Ogin Logistics',
    hotspot: 'hotspot-3',
    camera: { theta: -32.01, phi: 67.6, radius: 0.37, target: [-0.586, 1.200, 0.267] },
    shift: -0.38,
    bg: '#2A0A0B', accent: COLOR.red, line: TINT.coral,
    align: 'left',
    eyebrow: 'Supply chain & logistics',
    title: 'Ogin<br>Logistics',
    body: 'A trusted partner for logistics and supply chain solutions — comprehensive services that carry freight, materials and components through the complexities of modern trade, on schedule.',
    meta: ['Multimodal freight', 'Mining & automotive supply chain', 'Container management'],
    note: 'For the fast moving world…'
  },
  {
    id: 'tech',
    glass: true,
    label: 'Rayudu Tech',
    hotspot: 'hotspot-4',
    camera: { theta: 74.18, phi: 84, radius: 0.62, target: [0.135, 0.742, 0.473] },
    shift: 0.56,
    bg: '#081425', accent: COLOR.blue, line: TINT.azure,
    align: 'right',
    eyebrow: 'Technology & cybersecurity',
    title: 'Rayudu<br>Tech',
    body: 'Expert IT services and software development, built for the evolving needs of modern business — enterprise systems, digital architecture and the security that holds them together.',
    meta: ['Enterprise software', 'Digital architecture', 'Cybersecurity', 'IT staffing']
  },
  {
    id: 'blacore',
    glass: true,
    label: 'Blacore',
    hotspot: 'hotspot-7',
    camera: { theta: 49.27, phi: 81.65, radius: 0.36, target: [0.076, 0.060, 0.388] },
    shift: 0.38,
    bg: '#250A08', accent: COLOR.burgundy, line: TINT.burgundy,
    align: 'right',
    eyebrow: 'Energy & commodities',
    title: 'Blacore',
    body: 'Coal import and trading across India — supplying every major grade from all major ports to meet diverse industrial needs.',
    meta: ['Coal import & trading', 'All major Indian ports', 'Nationwide distribution']
  },
  {
    id: 'global',
    glass: true,
    label: 'Global Network',
    hotspot: 'hotspot-9',
    camera: { theta: 38, phi: 58, radius: 0.45, target: [0.674, 1.422, 0.122] },
    shift: -0.52,
    bg: '#0A0F1E', accent: COLOR.white, line: TINT.white,
    align: 'left',
    eyebrow: 'India + USA',
    title: 'Global<br>Network',
    body: 'A strategic presence connecting Indian operations with a broader North American footprint.',
    meta: ['6/5/989 Srinagar Colony, Anantapur, Andhra Pradesh 515002', '30 N Gould St Suite R, Sheridan, Wyoming 82801']
  },
  {
    id: 'media',
    glass: true,
    label: 'One Flag',
    hotspot: 'hotspot-10',
    camera: { theta: 163, phi: 64, radius: 0.52, target: [-0.047, 0.687, 0.081] },
    shift: 0.46,
    bg: '#1A0A1E', accent: COLOR.purple, line: TINT.purple,
    align: 'right', size: 'sm',
    eyebrow: 'Film, music & IP',
    title: 'Media &<br>Entertainment',
    note: 'One Flag Entertainment',
    body: 'Full-scale production and distribution across film, music and digital content — bringing creative visions to life and delivering them to audiences worldwide.',
    meta: ['End-to-end film production', 'Theatrical & digital distribution', 'Structured film financing']
  },
  {
    id: 'dazzlon',
    glass: true,
    label: 'Dazzlon',
    hotspot: 'hotspot-11',
    camera: { theta: 1.1, phi: 88, radius: 0.33, target: [-0.001, 0.552, 0.448] },
    shift: -0.30,
    bg: '#200B1C', accent: COLOR.purple, line: TINT.rose,
    align: 'left',
    eyebrow: 'Consumer wellness',
    title: 'Dazzlon',
    body: 'A blend of natural and scientifically crafted skincare, designed to nourish and revitalise skin while promoting a luxurious self-care experience.',
    meta: ['Science-backed skincare', 'Personal care', 'Sustainable lifestyle products']
  },
  {
    id: 'connect',
    label: 'Connect',
    camera: { theta: 14, phi: 78, radius: 1.08, target: [0, 0.64, 0] },
    shift: 0.32,
    bg: '#260B0C', accent: COLOR.red, line: TINT.red,
    align: 'right', last: true, front: true,
    eyebrow: 'Get in touch',
    title: 'Let’s build<br>what’s next',
    body: 'Whether you want to explore our businesses, start a partnership, or be part of the future we are building — we would be delighted to connect with you.',
    form: true
  }
];

/**
 * The rest of the site. Home and Contact live inside this experience;
 * the others are the existing rayudugroup.in pages until they are rebuilt
 * in this language.
 */
export const PAGES = [
  { label: 'Home',        scene: 'opening' },
  { label: 'About',       href: 'about.html' },
  { label: 'Our Brands',  href: 'brands.html' },
  { label: 'Careers',     href: 'careers.html' },
  { label: 'Contact Us',  href: 'contact.html' }
];

/**
 * Hotspot geometry — sampled from the mesh itself and passed straight to
 * model-viewer as data-position / data-normal. Never screen coordinates.
 */
export const HOTSPOTS = [
  { slot: 'hotspot-2',  scene: 'ronohub', label: 'Ronohub / Intelligence',
    position: '-0.0037m 0.8028m 0.7959m', normal: '0.0191m 0.7219m 0.6917m' },
  { slot: 'hotspot-3',  scene: 'ogin',    label: 'Ogin Logistics',
    position: '-0.586m 1.1995m 0.2672m',  normal: '-0.4901m 0.3811m 0.784m' },
  { slot: 'hotspot-4',  scene: 'tech',    label: 'Tech / Cybersecurity',
    position: '0.1347m 0.7418m 0.473m',   normal: '0.962m -0.0152m 0.2726m' },
  { slot: 'hotspot-7',  scene: 'blacore', label: 'Blacore / Energy',
    position: '0.0757m 0.0603m 0.3882m',  normal: '0.7498m 0.1452m 0.6456m' },
  { slot: 'hotspot-9',  scene: 'global',  label: 'India / USA',
    position: '0.6736m 1.4222m 0.1224m',  normal: '-0.6863m 0.6575m 0.311m' },
  { slot: 'hotspot-10', scene: 'media',   label: 'Film financing / Media',
    position: '-0.0473m 0.687m 0.0811m',  normal: '0.1603m 0.8724m -0.4617m' },
  { slot: 'hotspot-11', scene: 'dazzlon', label: 'Dazzlon / Wellness',
    position: '-0.0007m 0.5516m 0.4483m', normal: '0.0158m -0.5698m 0.8216m' }
];

/** Concentric arcs: [radius, startAngle, endAngle] with 0° at twelve o'clock. */
export const ARCS = {
  ronohub: [196, -22, 22],
  ogin:    [300, -78, -18],
  tech:    [196, 56, 110],
  blacore: [300, 118, 170],
  global:  [408, 16, 76],
  media:   [408, 190, 250],
  dazzlon: [196, 150, 214],
  ecosystem: [408, -46, 16],
  connect: [300, 196, 262],
  opening: [408, 92, 150]
};
