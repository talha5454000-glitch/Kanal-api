const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const TARGET_DOMAIN = 'https://izle.livetvuk.com/';
    const HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${TARGET_DOMAIN}/`,
        'Origin': TARGET_DOMAIN,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    function extractStreamUrl(htmlContent) {
        const streamPatterns = [
            /(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i,
            /file:\s*["'](https?:\/\/[^\s"'<>]+\.m3u8[^"']*)["']/i,
            /source\s*:\s*["'](https?:\/\/[^\s"'<>]+\.m3u8[^"']*)["']/i
        ];

        for (let pattern of streamPatterns) {
            let match = htmlContent.match(pattern);
            if (match) return match[1] || match[0];
        }
        return null;
    }

    try {
        // 1. Yayın linkini detay sayfasından çözme
        if (req.query.getStream && req.query.url) {
            const pageUrl = req.query.url;
            const matchPage = await axios.get(pageUrl, { headers: HEADERS });
            const html = matchPage.data;

            let streamUrl = extractStreamUrl(html);
            if (streamUrl) {
                return res.status(200).json({ basarili: true, streamUrl: streamUrl, type: 'm3u8' });
            }

            const $page = cheerio.load(html);
            let iframeSrc = $page('iframe').attr('src');
            if (!iframeSrc) {
                const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
                if (iframeMatch) iframeSrc = iframeMatch[1];
            }

            if (iframeSrc) {
                if (iframeSrc.startsWith('//')) iframeSrc = 'https:' + iframeSrc;
                else if (iframeSrc.startsWith('/')) iframeSrc = TARGET_DOMAIN + iframeSrc;

                try {
                    const iframePage = await axios.get(iframeSrc, { headers: { ...HEADERS, 'Referer': pageUrl } });
                    let innerStreamUrl = extractStreamUrl(iframePage.data);
                    if (innerStreamUrl) {
                        return res.status(200).json({ basarili: true, streamUrl: innerStreamUrl, type: 'm3u8' });
                    }
                } catch (e) {}

                return res.status(200).json({ basarili: true, streamUrl: iframeSrc, type: 'iframe' });
            }

            return res.status(200).json({ basarili: false, message: 'Yayın adresi bulunamadı.' });
        }

        // 2. Ana listedeki kanalları ve logolarını çekme
        const { data } = await axios.get(TARGET_DOMAIN, { headers: HEADERS });
        const $ = cheerio.load(data);
        const channels = [];

        // Sitedeki kanal / maç kartı yapısına göre seçici
        $('a[href*="/mac-izle/"], .channel-item, .card').each((i, element) => {
            const title = $(element).text().trim().replace(/\s+/g, ' ');
            const pageUrl = $(element).attr('href');
            const logo = $(element).find('img').attr('src') || '';

            if (title && pageUrl) {
                channels.push({
                    name: title,
                    logo: logo.startsWith('http') ? logo : (logo ? `${TARGET_DOMAIN}${logo}` : ''),
                    pageUrl: pageUrl.startsWith('http') ? pageUrl : `${TARGET_DOMAIN}${pageUrl}`
                });
            }
        });

        res.status(200).json({ basarili: true, toplam: channels.length, channels: channels });

    } catch (error) {
        res.status(500).json({ basarili: false, hata: error.message });
    }
};
