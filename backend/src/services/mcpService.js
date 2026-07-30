const axios = require('axios');
const cheerio = require('cheerio');

// Basic MCP-like connector service that fetches and extracts trusted content.
// NOTE: This is a simplified example for development/testing only.

const trustedSources = {
  mdn: {
    name: 'MDN Web Docs',
    search: (topic) => `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(topic)}`,
    allowedHost: 'developer.mozilla.org'
  },
  freecodecamp: {
    name: 'freeCodeCamp',
    search: (topic) => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(topic)}`,
    allowedHost: 'www.freecodecamp.org'
  }
};

async function fetchUrlText(url) {
  try {
    const resp = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'CourseGenerator/1.0 (+dev)' } });
    const $ = cheerio.load(resp.data);

    // Try common article selectors
    const selectors = ['article', '#content', '.post-content', '.entry-content', '.main-content'];
    for (const sel of selectors) {
      const el = $(sel);
      if (el && el.text().trim().length > 200) {
        return { url, text: el.text().trim().slice(0, 20000) };
      }
    }

    // Fallback: extract largest text block
    let bestText = '';
    $('p').each((i, p) => {
      const t = $(p).text().trim();
      if (t.length > bestText.length) bestText = t;
    });
    return { url, text: bestText.slice(0, 20000) };
  } catch (err) {
    return { url, error: String(err.message) };
  }
}

async function fetchFromMDN(topic) {
  const searchUrl = trustedSources.mdn.search(topic);
  try {
    const searchResp = await axios.get(searchUrl, { timeout: 8000, headers: { 'User-Agent': 'CourseGenerator/1.0 (+dev)' } });
    const $ = cheerio.load(searchResp.data);
    const firstLink = $('a.result-title').first().attr('href') || $('a').filter((i,el)=> $(el).attr('href') && $(el).attr('href').startsWith('/')).first().attr('href');
    if (!firstLink) return [{ url: searchUrl, error: 'No search result link found on MDN' }];
    const fullUrl = firstLink.startsWith('http') ? firstLink : `https://developer.mozilla.org${firstLink}`;
    return [await fetchUrlText(fullUrl)];
  } catch (err) {
    return [{ url: searchUrl, error: String(err.message) }];
  }
}

async function fetchFromFreeCodeCamp(topic) {
  const searchUrl = trustedSources.freecodecamp.search(topic);
  try {
    const searchResp = await axios.get(searchUrl, { timeout: 8000, headers: { 'User-Agent': 'CourseGenerator/1.0 (+dev)' } });
    const $ = cheerio.load(searchResp.data);
    const firstLink = $('a.card').first().attr('href') || $('a').filter((i,el)=> $(el).attr('href') && $(el).attr('href').includes('/news/')).first().attr('href');
    if (!firstLink) return [{ url: searchUrl, error: 'No search result link found on freeCodeCamp' }];
    const fullUrl = firstLink.startsWith('http') ? firstLink : `https://www.freecodecamp.org${firstLink}`;
    return [await fetchUrlText(fullUrl)];
  } catch (err) {
    return [{ url: searchUrl, error: String(err.message) }];
  }
}

async function fetchGenericUrl(url) {
  // Basic host allowlist check - only allow fetching from common trusted hosts by default
  try {
    const allowedHosts = ['developer.mozilla.org', 'www.freecodecamp.org', 'raw.githubusercontent.com', 'medium.com'];
    const u = new URL(url);
    if (!allowedHosts.includes(u.host)) {
      return { url, error: `Host not in allowlist: ${u.host}` };
    }
    return await fetchUrlText(url);
  } catch (err) {
    return { url, error: String(err.message) };
  }
}

exports.fetchContent = async ({ topic, sources = ['mdn','freecodecamp'], url }) => {
  const results = {};

  if (url) {
    results.generic = await fetchGenericUrl(url);
    return results;
  }

  const tasks = [];
  if (sources.includes('mdn')) tasks.push(fetchFromMDN(topic).then(r => results.mdn = r));
  if (sources.includes('freecodecamp')) tasks.push(fetchFromFreeCodeCamp(topic).then(r => results.freecodecamp = r));

  await Promise.all(tasks);
  return results;
};
