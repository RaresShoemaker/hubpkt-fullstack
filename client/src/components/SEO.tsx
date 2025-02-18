import React from 'react';
import {Helmet} from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  imgSrc?: string;
  url?:string;
}

const SEO:React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  url,
  imgSrc,
}) => {
  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="og:title" content={title} />
      <meta name="title" content={title} />
      <meta property="og:type" content="website" />
      <meta name="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imgSrc} />
    </Helmet>
  )
}

export default SEO;