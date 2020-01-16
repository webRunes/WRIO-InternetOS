export function getServiceUrl(service: string): string {
  let protocol = 'https:';
  const domain = process.env.DOMAIN;

  if (!domain) {
    throw new Error('Domain is not defined!');
  }

  if (domain === 'wrioos.local') {
    protocol = window.location.protocol;
  }
  if (process.env.NODE_ENV === 'development') {
    protocol = 'https:';
    if (service === 'core') {
      return 'http://core_d.wrioos.com:3033';
    }
    if (service === 'pinger') {
      return 'http://pinger_d.wrioos.com:3033';
    }

    if (service === 'webgold') {
      return 'http://webgold_d.wrioos.com:3033';
    }
  }
  return `${protocol}//${service}.${domain}`;
}

export function getDomain(): string {
  let domain = '';

  if (process.env.DOMAIN == undefined) {
    domain = 'wrioos.com';
  } else {
    domain = process.env.DOMAIN;
  }
  return domain;
}

export function getPingerIframe() {}

export function getCoreIframe() {}
