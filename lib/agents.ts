/**
 * Agent profile directory (T4.1). Backend-less MVP — profiles live as
 * a static record until the public-directory API ships in S5.
 *
 * Slug is the URL path segment (`/agent/<slug>`). It's lowercase-ASCII
 * to keep URLs stable across locales.
 */

export interface AgentReview {
  id: string;
  clientName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  postedAt: string; // ISO date
}

export interface AgentStat {
  label: string;
  value: string;
}

export interface AgentProfile {
  slug: string;
  fullName: string;
  headline: string;
  city: string;
  country: string; // ISO-3166 alpha-2
  bio: string;
  initials: string; // rendered when photoUrl is null
  photoUrl: string | null;
  languages: string[]; // ISO-639 alpha-2
  stats: AgentStat[];
  reviews: AgentReview[];
  contact: {
    phone: string; // E.164
    email: string;
    whatsapp?: string; // E.164
  };
  services: string[];
  currency: 'EUR' | 'USD' | 'AED';
}

const AGENTS: AgentProfile[] = [
  {
    slug: 'maria-silva',
    fullName: 'Maria Silva',
    headline: 'Lisbon showings · old town specialist',
    city: 'Lisbon',
    country: 'PT',
    bio:
      'Tenth year in Lisbon real estate, focused on Alfama, Graça and Príncipe Real. '
      + 'Works with international buyers and expats relocating to Portugal. Runs ≤4 '
      + 'showings per day to keep every tour personal.',
    initials: 'MS',
    photoUrl: null,
    languages: ['pt', 'en', 'es'],
    stats: [
      { label: 'Closed in 2025', value: '17 deals' },
      { label: 'Avg response', value: '< 2 h' },
      { label: 'Repeat clients', value: '34%' },
    ],
    reviews: [
      {
        id: 'r1',
        clientName: 'Elena K.',
        rating: 5,
        comment:
          'Maria made our relocation from Madrid smooth — she understood our budget in 15 minutes and had 3 perfect flats ready for the weekend.',
        postedAt: '2026-02-12',
      },
      {
        id: 'r2',
        clientName: 'Tom R.',
        rating: 5,
        comment:
          'Responsive even on weekends, caught a listing before it hit Idealista. Would work with her again.',
        postedAt: '2026-03-04',
      },
      {
        id: 'r3',
        clientName: 'Sofia B.',
        rating: 4,
        comment:
          'Great tour guide around Alfama. The paperwork side took one extra week but she kept us informed every day.',
        postedAt: '2026-03-27',
      },
    ],
    contact: {
      phone: '+351911000001',
      email: 'maria@lumi.estate',
      whatsapp: '+351911000001',
    },
    services: ['Buyer agent', 'Relocation', 'Showings', 'Mortgage intro'],
    currency: 'EUR',
  },
];

export function findAgentBySlug(slug: string): AgentProfile | null {
  const norm = slug.toLowerCase().trim();
  return AGENTS.find((a) => a.slug === norm) ?? null;
}

export function listAgentSlugs(): string[] {
  return AGENTS.map((a) => a.slug);
}
