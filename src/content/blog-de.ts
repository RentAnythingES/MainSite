import { getPublishedPosts, type BlogPost } from "@/content/blog";
import page0 from "@/content/blog-de/best-beaches-valencia-families.json";
import page1 from "@/content/blog-de/best-day-trips-from-valencia.json";
import page2 from "@/content/blog-de/digital-nomad-guide-valencia.json";
import page3 from "@/content/blog-de/home-office-setup-valencia-apartment.json";
import page4 from "@/content/blog-de/rent-vs-buy-baby-gear-valencia.json";
import page5 from "@/content/blog-de/valencia-summer-survival-guide.json";
import page6 from "@/content/blog-de/valencia-with-kids-complete-guide.json";
import page7 from "@/content/blog-de/wheelchair-accessibility-valencia.json";

/** Complete translations only; original section structure and assets are verified before registration. */
export const germanBlogPosts: BlogPost[] = [page0 as BlogPost, page1 as BlogPost, page2 as BlogPost, page3 as BlogPost, page4 as BlogPost, page5 as BlogPost, page6 as BlogPost, page7 as BlogPost];
export function getPublishedGermanPosts(): BlogPost[] { return getPublishedPosts().flatMap(original => { const translated = germanBlogPosts.find(page => page.slug === original.slug); return translated ? [translated] : []; }); }
export function getGermanBlogPostBySlug(slug: string): BlogPost | undefined { return getPublishedGermanPosts().find(page=>page.slug===slug); }
