import Head from "next/head";

export type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
};

export const Seo = ({ title, description, keywords, canonical, image, noindex }: SeoProps) => (
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
    {image && <meta property="og:image:alt" content="Claudia Napolitano" />}
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Claudia Napolitano" />
    {canonical && <link rel="canonical" href={canonical} />}
  </Head>
);
