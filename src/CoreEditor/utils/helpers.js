export const getMention = (name, about, link) => ({
  '@type': 'Article',
  name,
  about,
  url: link,
});

export const getImageObject = (url: string, name: string, description: string) => ({
  '@type': 'ImageObject',
  contentUrl: url,
  description,
  name,
});

export const getSocialMediaPosting = (src: string, description: string, title: string) => ({
  '@type': 'SocialMediaPosting',
  sharedContent: {
    '@type': 'WebPage',
    headline: title,
    about: description,
    url: src,
  },
});

export const getTicket = (url: string, image: string, about: string, name: string) => ({
  '@type': 'Article',
  name,
  about,
  image,
  url,
});

export const getPart = (name: string) => ({
  '@type': 'Article',
  name,
  articleBody: [],
});
