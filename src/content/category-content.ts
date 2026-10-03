export interface CategoryContent {
  title: string;
  description: string;
  heading?: string;
  introDescription?: string;
  emoji?: string;
  image?: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  blogTags?: string[];
  featuredHeading?: string;
  featuredDescription?: string;
  featuredPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
  familyHeading?: string;
  familyDescription?: string;
  familyPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
  searchIntentHeading?: string;
  searchIntentDescription?: string;
  searchIntents?: Array<{
    title: string;
    description: string;
  }>;
  faqHeading?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}
