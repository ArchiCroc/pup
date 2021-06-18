import UrlPattern from 'url-pattern';
import { URL } from 'url';

export default (url: string | URL) => {
  let isBlacklisted = false;
  const cleanUrl: string = url instanceof URL ? url.pathname : url;

  ['/documents(/:id)'].forEach((blacklistedPattern) => {
    const pattern = new UrlPattern(blacklistedPattern);
    isBlacklisted = !!pattern.match(cleanUrl);
  });
  return isBlacklisted;
};
