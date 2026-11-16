import Head from "next/head";
import { type Lang, useLanguage } from "@/lib/language";

export type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
};

/** Page props carry the tags in both languages; the static HTML gets the English ones. */
export type SeoByLang = Partial<Record<Lang, SeoProps>>;

export const Seo = (props: SeoByLang) => {
  const { lang } = useLanguage();
  const seo = props[lang] ?? props.en;
  return seo ? <SeoTags {...seo} /> : null;
};

const SeoTags = ({ title, description, keywords, canonical, image, noindex }: SeoProps) => (
  <Head>
    {title && <title>{title}</title>}
    <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    {canonical && <meta property="og:url" content={canonical} />}
    <meta property="og:type" content="website" />
    {image && <meta property="og:image" content={image} />}
    {image && <meta property="og:image:width" content="1200" />}
    {image && <meta property="og:image:height" content="630" />}
    {image && <meta property="og:image:type" content="image/jpeg" />}
    <meta name="twitter:card" content="summary_large_image" />
    {title && <meta name="twitter:title" content={title} />}
    {description && <meta name="twitter:description" content={description} />}
    {image && <meta name="twitter:image" content={image} />}
    {image && <meta property="og:image:alt" content="Claudia Napolitano" />}
    <meta property="og:locale" content={useLanguage().lang === "it" ? "it_IT" : "en_US"} />
    <meta property="og:site_name" content="Claudia Napolitano" />
    {canonical && <link rel="canonical" href={canonical} />}
  </Head>
);
