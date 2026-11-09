SEO + AI search fixes for seasonsofsurrender.org (from my SEO review, Oct 21). Please apply fixes 1-5 below, plus #7 (link "Published by Quellsicht" in the footer to https://www.quellsicht.com/), #9 (self-host fonts with font-display: swap) and #10 (replace "pre-order on Amazon" in the signup thank-you with neutral wording, e.g. "when it's available to order").

Rules: keep the look and all visible copy identical except where a fix says otherwise. NO placeholder text may ship: anything in [brackets] (ISBN, subtitle, release date, page count, buy link, price) must be omitted for now; I'll give you those values later. Keep mobile picture-free. Show me the diff/preview before deploying.

**TOP 5 fixes, ranked by impact**

Each fix has a prompt Sven can paste into Claude Code. Replace or delete every **[placeholder]** before deploying. No placeholder text should go live.

### **1. Add structured data: Book, both authors, Quellsicht as publisher, WebSite**

**Why:** there is no JSON-LD today, and the title collides with another 2026 book and an album. Structured data tells Google and AI systems exactly which "Seasons of Surrender" this is, who wrote it, and who publishes it.

> * **Sources for each fact:**  
  * names: site and doc;  
  * descriptions: the live meta description and the author cards;  
  * paperback: the 3D book's aria-label, "3D view of the Seasons of Surrender paperback";  
  * publisher URL: quellsicht.com, captured.  
> * **Placeholders:** ISBN, date, page count and subtitle (the doc lists the subtitle as unconfirmed).  
> * **Validation:** the block below parses as valid JSON. It has not been run through Google's Rich Results Test (that requires submitting the page).

**Prompt for Claude Code:**

| In index.html (static site on Vercel), add the JSON-LD block below inside <head>, just before </head>, wrapped in <script type="application/ld+json"> ... </script>. Do not change any visible copy. Before committing: for every property whose value starts with "[" (a placeholder), either replace it with the confirmed value I give you, or delete that property entirely. No "[...]" text may ship. After adding, run: node -e "JSON.parse(require('fs').readFileSync('jsonld.tmp','utf8'))" on the extracted block (or equivalent) to confirm it parses. |
| :---- |

| {   "@context": "https://schema.org",   "@graph": [     {       "@type": "WebSite",       "@id": "https://www.seasonsofsurrender.org/#website",       "url": "https://www.seasonsofsurrender.org/",       "name": "Seasons of Surrender",       "description": "Official site of Seasons of Surrender, a memoir by Mark & Paula Batory.",       "inLanguage": "en",       "publisher": {         "@id": "https://www.quellsicht.com/#organization"       },       "about": {         "@id": "https://www.seasonsofsurrender.org/#book"       }     },     {       "@type": "Organization",       "@id": "https://www.quellsicht.com/#organization",       "name": "Quellsicht",       "url": "https://www.quellsicht.com/",       "description": "Quellsicht is an independent publishing imprint."     },     {       "@type": "Person",       "@id": "https://www.seasonsofsurrender.org/#paula-batory",       "name": "Paula Batory",       "description": "Wife, mother, missionary, and storyteller.",       "spouse": {         "@id": "https://www.seasonsofsurrender.org/#mark-batory"       }     },     {       "@type": "Person",       "@id": "https://www.seasonsofsurrender.org/#mark-batory",       "name": "Mark Batory",       "description": "Missionary, church planter, and missions leader.",       "spouse": {         "@id": "https://www.seasonsofsurrender.org/#paula-batory"       }     },     {       "@type": "Book",       "@id": "https://www.seasonsofsurrender.org/#book",       "name": "Seasons of Surrender",       "alternativeHeadline": "[SUBTITLE - confirm against final print proof]",       "description": "A personal memoir of nearly fifty years learning to trust God through missionary service, family, illness, changed plans, and the joy of surrender.",       "url": "https://www.seasonsofsurrender.org/",       "image": "https://www.seasonsofsurrender.org/assets/cover-front.jpg",       "author": [         {           "@id": "https://www.seasonsofsurrender.org/#paula-batory"         },         {           "@id": "https://www.seasonsofsurrender.org/#mark-batory"         }       ],       "publisher": {         "@id": "https://www.quellsicht.com/#organization"       },       "inLanguage": "en",       "genre": "Memoir",       "bookFormat": "https://schema.org/Paperback",       "isbn": "[ISBN - confirm]",       "datePublished": "[PUBLICATION DATE YYYY-MM-DD - confirm; site says mid-November 2026]",       "numberOfPages": "[PAGE COUNT - confirm]"     }   ] } |
| :---- |

When a buy link exists, paste this snippet **inside the Book node** (as one more property of the "@type": "Book" object, with a comma after the preceding property). The URL and price are placeholders. When the page count is confirmed, numberOfPages must be a whole number without quotes (e.g. "numberOfPages": 240), not a string:

| "offers": {   "@type": "Offer",   "url": "[BUY / PRE-ORDER URL - confirm]",   "price": "[PRICE - confirm]",   "priceCurrency": "USD",   "availability": "https://schema.org/PreOrder" } |
| :---- |

### **2. Complete the head tags: canonical, social previews, favicon**

**Why:**

> * **No canonical tag**, so /index.html and /?utm_source=x both serve the same page with status 200.  
> * **The og:image URL isn't final.** It points at the bare domain, which only reaches the image through a 308 redirect. Crawlers do follow it, but the final URL is safer.  
> * **The preview image is small and portrait** (448×661, 92 KB). Facebook, LinkedIn and X show their large previews from landscape images around 1200×630. With this image, previews will likely be small or cropped (not tested on the platforms themselves).  
> * **Already present:** og:type, og:title, og:description and og:image exist in the live head. The block below **replaces** them, so there are no duplicates.  
> * **Missing tags:** og:url, og:site_name, og:image:alt and any twitter:* tags.  
> * **No favicon:** /favicon.ico returns 404 and shows as a console error in Lighthouse.

**Prompt for Claude Code:**

| In index.html <head> (static site), make these changes and nothing else: 1) Add: <link rel="canonical" href="https://www.seasonsofsurrender.org/"> 2) REPLACE the existing og:type, og:title, og:description and og:image tags with the block below    (delete the old ones first; do not leave duplicates), then add the new og/twitter tags from it. 3) Create a 1200x630 social image at /assets/og-cover.jpg (landscape: front cover centered on the    dark #0B151B background with the title "Seasons of Surrender" and "A memoir by Mark & Paula Batory").    Use the approved cover only. Keep cover-front.jpg as is. 4) Add a favicon: /favicon.ico (32x32) and /apple-touch-icon.png (180x180), e.g. a "S" monogram    in the site's Cormorant Garamond italic on #0B151B, and link them. |
| :---- |

| <link rel="canonical" href="https://www.seasonsofsurrender.org/"> <meta property="og:type" content="book"> <meta property="og:site_name" content="Seasons of Surrender"> <meta property="og:url" content="https://www.seasonsofsurrender.org/"> <meta property="og:title" content="Seasons of Surrender | Mark &amp; Paula Batory"> <meta property="og:description" content="A personal memoir of nearly fifty years learning to trust God through missionary service, family, illness, changed plans, and the joy of surrender."> <meta property="og:image" content="https://www.seasonsofsurrender.org/assets/og-cover.jpg"> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <meta property="og:image:alt" content="Cover of Seasons of Surrender, a memoir by Mark and Paula Batory"> <!-- add when confirmed: <meta property="book:isbn" content="[ISBN - confirm]"> and <meta property="book:release_date" content="[YYYY-MM-DD - confirm]"> --> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title" content="Seasons of Surrender | Mark &amp; Paula Batory"> <meta name="twitter:description" content="A personal memoir of nearly fifty years learning to trust God through missionary service, family, illness, changed plans, and the joy of surrender."> <meta name="twitter:image" content="https://www.seasonsofsurrender.org/assets/og-cover.jpg"> <meta name="twitter:image:alt" content="Cover of Seasons of Surrender, a memoir by Mark and Paula Batory"> <link rel="icon" href="/favicon.ico" sizes="32x32"> <link rel="apple-touch-icon" href="/apple-touch-icon.png"> |
| :---- |

*book:author was left out on purpose: in Open Graph it expects a profile URL, not a name. Add it later only if the Batorys have official author profile pages, e.g. <meta property="book:author" content="[AUTHOR PROFILE URL - confirm]">.*

### **3. Add robots.txt and sitemap.xml, then ask Google and Bing to recrawl**

**Why:** both files return 404, and the built-in search tool still shows the old copy. A sitemap with a lastmod date plus a recrawl request is the fastest standard way to get the new copy indexed.

> * Search Console and Bing Webmaster submissions are for Sven to do. Nothing was submitted in this review.

**Prompt for Claude Code:**

| Create two static files next to index.html (so they are served at the site root on Vercel): robots.txt and sitemap.xml, with exactly the contents below. Set <lastmod> to the deploy date. Do not block /assets/. Do not add /api/ to the sitemap. |
| :---- |

| # robots.txt User-agent: * Allow: / Disallow: /api/   Sitemap: https://www.seasonsofsurrender.org/sitemap.xml |
| :---- |

| <?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">   <url>     <loc>https://www.seasonsofsurrender.org/</loc>     <lastmod>[DEPLOY DATE YYYY-MM-DD]</lastmod>   </url> </urlset> |
| :---- |

**Then (Sven, manually):**

> 1. In Google Search Console, add the domain property seasonsofsurrender.org (DNS verification), submit the sitemap, and use URL Inspection → Request indexing on the home page.  
> 2. Do the same in Bing Webmaster Tools, which feeds Copilot and other AI tools.

### **4. Make the page easy for AI tools to answer from: a visible "About the book" fact block, an FAQ and llms.txt**

**Why:** an AI tool needs short, quotable answers to "who are the Batorys?", "who publishes it?", "when is it out?" and "where can I buy it?".

> * The page has the story but no compact fact summary or FAQ, and llms.txt returns 404.  
> * The AI summary in the built-in search tool answered "Seasons of Surrender" with the wrong book. Clear on-page facts that name the authors and publisher help AI tools tell the books apart.  
> * Google limits FAQ rich results to well-known, authoritative government and health sites (Google Search Central Blog, Aug 8, 2023: https://developers.google.com/search/blog/2023/08/howto-faq-changes, checked Oct 20, 2026), so the FAQ is for readers and AI answers, not for rich results.  
> * Every answer below comes from the live page or the doc. Placeholders stay hidden until confirmed.

**Prompt for Claude Code:**

| 1) In index.html, add a short "About the Book" fact list and an FAQ section just above the signup    section (#signup), in the existing site style, visible on desktop AND mobile (keep it short on mobile,    e.g. <details> per question). Use ONLY the text below.    - Fact list: omit any <li> still containing "[" until I confirm it.    - FAQ: if a question's answer contains "[", omit the WHOLE Q&A pair (the <h3> and its <p>) AND its      entry in the FAQPage JSON-LD. Today that means "When is it released?" and "Where can I buy it?"      are left out until confirmed. 2) Add the FAQPage JSON-LD block below in <head>, wrapped in <script type="application/ld+json">.    Its question and answer text must stay word-for-word identical to the visible Q&As. 3) Create /llms.txt next to index.html with the content below (confirmed lines only). |
| :---- |

| <section id="facts" aria-labelledby="facts-h">   <h2 id="facts-h">About the Book</h2>   <ul>     <li><b>Title:</b> Seasons of Surrender</li>     <li><b>Subtitle:</b> [SUBTITLE - confirm against final print proof]</li>     <li><b>Authors:</b> Mark &amp; Paula Batory</li>     <li><b>Publisher:</b> Quellsicht</li>     <li><b>Format:</b> Paperback</li>     <li><b>Release:</b> mid-November 2026 [CONFIRM launch date]</li>     <li><b>ISBN:</b> [ISBN - confirm]</li>     <li><b>Where to buy:</b> [BUY / PRE-ORDER LINK - confirm]</li>   </ul>   <h2>Questions</h2>   <h3>What is Seasons of Surrender?</h3>   <p>Seasons of Surrender is a memoir by Mark &amp; Paula Batory: a personal account of marriage, family, missionary service, illness, redirection, leadership, and letting go, told across four seasons: Trust, Trial, Refinement, and Release.</p>   <h3>Who are Mark and Paula Batory?</h3>   <p>Mark and Paula Batory met as teenagers who shared a desire to serve the Lord. They married in 1977 and began missionary service the following year. Their service included Mexico, church planting, ministry among Spanish-speaking people, missions leadership, and care for fellow servants of Christ. Paula is a wife, mother, missionary, and storyteller; Mark is a missionary, church planter, and missions leader.</p>   <h3>Who publishes the book?</h3>   <p>Seasons of Surrender is published by Quellsicht (<a href="https://www.quellsicht.com/">quellsicht.com</a>).</p>   <h3>When is it released?</h3>   <p>Seasons of Surrender is planned for release in mid-November 2026. [CONFIRM launch date]</p>   <h3>Where can I buy it?</h3>   <p>[BUY / PRE-ORDER LINK - confirm]. Until then, <a href="#signup">sign up</a> to be notified when it is available.</p> </section> |
| :---- |

| # Seasons of Surrender   > Seasons of Surrender is a memoir by Mark & Paula Batory, published by Quellsicht. A personal memoir of nearly fifty years learning to trust God through missionary service, family, illness, changed plans, and the joy of surrender.   - Authors: Mark & Paula Batory (married 1977; began missionary service the following year; served in Mexico, church planting, ministry among Spanish-speaking people, and missions leadership) - Publisher: Quellsicht (https://www.quellsicht.com/) - Format: Paperback - Structure: four seasons: Trust, Trial, Refinement, Release - Release: mid-November 2026 [CONFIRM] - ISBN: [ISBN - confirm] - Buy: [BUY / PRE-ORDER LINK - confirm] - Not to be confused with: "Seasons of Surrender" by Vic Clesceri (a different book) or "Season of Surrender" by August Burns Red (an album)   ## Pages - [Home](https://www.seasonsofsurrender.org/): book overview, the four seasons, an excerpt ("Three eggs", Chapter 2), the authors, and launch signup |
| :---- |

FAQPage JSON-LD (only the three confirmed Q&As; the text matches the visible answers word for word, checked by script; parses as valid JSON):

| {   "@context": "https://schema.org",   "@type": "FAQPage",   "@id": "https://www.seasonsofsurrender.org/#faq",   "mainEntity": [     {       "@type": "Question",       "name": "What is Seasons of Surrender?",       "acceptedAnswer": {         "@type": "Answer",         "text": "Seasons of Surrender is a memoir by Mark & Paula Batory: a personal account of marriage, family, missionary service, illness, redirection, leadership, and letting go, told across four seasons: Trust, Trial, Refinement, and Release."       }     },     {       "@type": "Question",       "name": "Who are Mark and Paula Batory?",       "acceptedAnswer": {         "@type": "Answer",         "text": "Mark and Paula Batory met as teenagers who shared a desire to serve the Lord. They married in 1977 and began missionary service the following year. Their service included Mexico, church planting, ministry among Spanish-speaking people, missions leadership, and care for fellow servants of Christ. Paula is a wife, mother, missionary, and storyteller; Mark is a missionary, church planter, and missions leader."       }     },     {       "@type": "Question",       "name": "Who publishes the book?",       "acceptedAnswer": {         "@type": "Answer",         "text": "Seasons of Surrender is published by Quellsicht (quellsicht.com)."       }     }   ] } |
| :---- |

When the release date or buy link is confirmed, add that Q&A to the page and to mainEntity together, with identical text.  
*Note: the "not to be confused with" line is based on the built-in search tool's results. Keep it in llms.txt only, not on the visible page, unless Sven wants it there.*

### **5. One H1, and make the cover a real image with alt text**

**Why:**

> * **Two H1s in the HTML.** The desktop and mobile versions are both in the page and hidden with CSS. The desktop H1 is "We all say we trust God until He asks us to surrender." and the mobile H1 is "Seasons of Surrender". Most H2/H3 headings appear twice for the same reason.  
> * **The title isn't consistently the H1.** Google indexes the mobile version, but a single H1 containing the book title is clearer for every crawler.  
> * **No <img> elements.** The cover is only a CSS background on the 3D book, so image search and AI tools can't see or describe it, and there is no alt text anywhere.

**Prompt for Claude Code:**

| In index.html (keep the look identical): 1) Use exactly one <h1> in the whole document: "Seasons of Surrender". In the desktop hero, change the    current <h1> "We all say we trust God until He asks us to surrender." to <p class="headline"> and give    .headline the same CSS the h1 has now; put the book title into the h1 (it can be visually styled as the    existing book line). In the mobile hero keep <h1>Seasons of Surrender</h1> but ensure only one h1 is in    the DOM (e.g. render the title h1 once, outside the .d-only/.m-only blocks, styled per breakpoint). 2) Add a real image of the front cover that crawlers can see, e.g. inside the 3D book's front face or as a    visually-hidden-safe <img> in the book column:    <img src="/assets/cover-front.jpg" width="448" height="661"         alt="Front cover of Seasons of Surrender by Mark and Paula Batory, showing the Mexican mountains where they lived and served"         loading="lazy">    Keep the CSS 3D book working. Do not add an image to the mobile layout (authors asked mobile to be picture-free). |
| :---- |

*The alt text reuses the site's own cover caption. The "no image on mobile" rule comes from the doc.*

## ---

**Rest of the fix list (prioritized)**

> 6. **Release dates don't match.** quellsicht.com says "October 2026" and the book site says "mid-November 2026". Use one date everywhere; the doc still marks it CONFIRM.  
> 7. **Link the book site to the publisher.** The footer says "Published by Quellsicht" as plain text. Link it to https://www.quellsicht.com/, which already links back to the book site.  
> 8. **Add Organization and Book JSON-LD to quellsicht.com.** It has none, and the built-in search tool did not surface it for "Quellsicht". It also needs its own robots.txt and sitemap (not checked).  
> 9. **Speed up the fonts (lab: about 2,030 ms est. saving).** The page loads 4 Google Font families from a render-blocking stylesheet. Self-host the WOFF2 files with font-display: swap and preload the 1–2 used above the fold, or drop a family. Lighthouse puts 82% of the 3.3 s LCP in render delay.  
> 10. **"Pre-order on Amazon" in the signup thank-you message.** The live page says "We’ll let you know when we announce the publishing date and when you can pre-order on Amazon.", but the doc marks Amazon as unconfirmed. Replace it with neutral wording until a retailer is confirmed.  
> 11. **Confirm the subtitle.** The site uses "A Fifty-Year Journey of Trust, Trial, Refinement, and Release", but the doc says the proof/cover reads "Trust, Trial, and Release". Make the site, schema and book match.  
> 12. **Strengthen HSTS (optional).** HSTS is present (max-age=63072000) but has no includeSubDomains or preload. Consider adding them in Vercel once all subdomains serve HTTPS.  
> 13. **Author pages (later).** Once the Batorys approve, a short author bio with a couple photo (the doc needs Paula's OK) and links to any official author profiles would strengthen the Person entities.  
    * A third-party bio exists at gfamissions.org/batory. It was **not** used for facts here; whether to link it via sameAs is a Batory decision.  
> 14. **After launch,** add the ISBN, buy link and the Offer to the JSON-LD, plus book:isbn and book:release_date, and put the buy button in place of "Notify Me" as the doc describes.

## ---

