import { NextResponse } from 'next/server'

const LLMS_CONTENT = `# Miss Culture Global Kenya

> Miss Culture Global Kenya is a cultural preservation and youth empowerment movement — showcasing Kenya's heritage through pageants, community programs, and global partnerships.

## About

Miss Culture Global Kenya celebrates and preserves Kenya's diverse cultural heritage while empowering young women through education, mentorship, and global exposure. Based in Nairobi, Kenya, the organization operates through cultural pageants, community outreach programs, artisan support initiatives, and international diplomatic engagements.

## Brand Ambassador

Susan Abong'o is the official Brand Ambassador of Miss Culture Global Kenya. She represents our mission of cultural preservation, youth empowerment, and global cultural diplomacy.

## Key Programs

- **Cultural Pageants** — Celebrating beauty with purpose through heritage-inspired competitions
- **Community Outreach** — Youth mentorship, artisan support, and educational programs
- **Global Diplomacy** — Representing Kenyan culture at international conferences and forums
- **Heritage Preservation** — Documenting and promoting Kenya's 47 counties' unique cultural identities

## Pages

- [Home](https://misscultureglobalkenya.com/) — Main landing page
- [About](https://misscultureglobalkenya.com/about) — Our mission, vision, leadership team
- [Kenya](https://misscultureglobalkenya.com/kenya) — Discover Kenya's cultural heritage by region
- [Ambassador](https://misscultureglobalkenya.com/ambassador) — Susan Abong'o's profile and achievements
- [Gallery](https://misscultureglobalkenya.com/gallery) — Photos and videos from events and programs
- [Events](https://misscultureglobalkenya.com/events) — Upcoming and past events, pageants, workshops
- [Partnership](https://misscultureglobalkenya.com/partnership) — Collaboration and sponsorship opportunities
- [Contribute](https://misscultureglobalkenya.com/contribute) — Support our mission
- [Contact](https://misscultureglobalkenya.com/contact) — Get in touch
- [FAQ](https://misscultureglobalkenya.com/faq) — Frequently asked questions

## Contact

- Website: https://misscultureglobalkenya.com
- Email: info@misscultureglobalkenya.com
- Phone: +254 721 706983
- Location: Nairobi, Kenya

## Social Media

- Instagram: https://www.instagram.com/misscultureglobalkenya
- TikTok: https://www.tiktok.com/@misscultureglobalkenya
- Facebook: https://www.facebook.com/misscultureglobalkenya

## Optional

- [Full context](https://misscultureglobalkenya.com/llms-full.txt)
`

export async function GET() {
  return new NextResponse(LLMS_CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
