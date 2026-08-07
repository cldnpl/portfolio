export interface PageContent {
  /** Foto a tutta pagina, oppure in cima quando c'è anche del testo. */
  photo?: string;
  eyebrow?: string;
  heading?: string;
  body?: string[];
  caption?: string;
  folio?: string;
}

/**
 * Una voce per FACCIATA, in ordine di lettura.
 * pages[0] è la prima facciata che si vede aprendo la copertina (pagina di destra).
 * Le facciate pari finiscono a destra, le dispari a sinistra.
 * Schema: pagina di sinistra la foto, pagina di destra il testo.
 */
export const pages: PageContent[] = [
  // — apertura: foto e dedica sulla stessa pagina —
  {
    photo: '01.jpg',
    body: ['one of our very first photos'],
    caption: 'with love, Claudia',
  },

  // — Stoccolma —
  { photo: '02.jpg' },
  {
    eyebrow: 'stockholm',
    body: [
      'Our first trip together, to one of my favourite places in the world: Sweden. Because of you I found out how to play in the snow, how to build snowmen, and how to survive a cold that I — being a southerner — am really not used to.',
      'I want our children to grow up the way we spent those three days in Stockholm: having fun, playing in the snow, and never being afraid of catching a cold because it was "too freezing".',
    ],
    folio: '1',
  },

  // — Navruz —
  { photo: '03.jpg' },
  {
    eyebrow: 'rome',
    body: [
      'NAVRUZZZZZ, gnam gnam. My only regret is the plov we never got to eat.',
      'Anyway — that little house we rented: top 3 most beautiful places I have ever stayed in. Maybe one day we will have one just like it, exactly like that, up in the hills, or better still, up in the mountains. Just me and you.',
      'Ps. the next Navruz I am coming to spend in Uzbekistan. Already decided.',
    ],
    folio: '2',
  },

  // — Caserta —
  { photo: '04.jpg' },
  {
    eyebrow: 'the palace of caserta',
    body: [
      'How much I love travelling with you, even when it is only a thirty-minute trip — I would never get tired of it.',
      '"Can you imagine living in a palace like this? Can you believe someone, all those years ago, actually did?"',
      'Even though I do not live in one, you still make me feel treated like a queen. You never let me want for anything, and that is the thing I am most grateful to you for in the whole world.',
    ],
    folio: '3',
  },

  // — engagement day —
  { photo: '05.jpg' },
  {
    eyebrow: 'our engagement day',
    body: [
      'Maybe one of my favourite days ever spent with you: our engagement day. You have no idea how much that day meant to me.',
      'Imagine: a dream finally coming true, in a society that does not exactly look kindly on this kind of goal.',
      'I never take our ring off — to me it is a symbol, a promise of something much bigger that is coming in the future (and not too far away, either!)',
    ],
    folio: '4',
  },

  // — shopping —
  { photo: '06.jpg' },
  {
    eyebrow: 'the prom',
    body: [
      'Another wonderful thing? Going shopping together. We spent hours and hours and hours wandering around Naples (and beyond) looking for the right clothes for the occasion for you.',
      'You know when I tell you that doing the grocery shopping together makes me feel as if we already lived as a family? Exactly — same thing.',
      'I cannot wait to go and buy those same clothes for our children, you know, those tiny little onesies for newborns... or furniture for our home.',
    ],
    folio: '5',
  },

  // — the Academy —
  { photo: '07.jpg' },
  {
    eyebrow: 'the academy',
    body: [
      'I would have a million pages to write about this, but I only have one.',
      'Think for a second: if I had never listened to my father, if I had never chosen to go to the Academy. I mean, I simply would not be here right now. I would still be confined to my little town, with its noisy car horns and its unbearable people.',
      'But no: not only did I get the chance to learn a hundred new things and turn my life around, I also met the person who is, today and without a doubt, the most important person in the world (literally) to me. Maybe that is also why my life has changed so much.',
    ],
    folio: '6',
  },

  // — Lecce —
  { photo: '08.jpg' },
  {
    eyebrow: 'lecce',
    body: [
      'LECCEEEE, my favourite city in Italy. I would visit it another three hundred times, I would eat another thousand pasticciotti — but always and only with you, and in better weather than the one that kept us company the first time.',
      'I miss it so much. When are we going back?',
    ],
    folio: '7',
  },

  // — chiusura: pagina singola —
  {},
  {
    photo: '09.jpg',
    eyebrow: 'tashkent',
    body: [
      'And now here I am, here we are. Who knows where we will be in another six months, or a year, or two. I have no idea, but I am certain of one thing: wherever I am, I will be with you.',
    ],
    caption: 'I love you. Happy birthday again <3',
  },
];

/** Numero di fogli di carta: ogni foglio ha due facciate. */
export const sheetCount = Math.ceil(pages.length / 2);

export const coverTitle = 'happy birthday!';
