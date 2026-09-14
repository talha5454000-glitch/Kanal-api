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

    const TARGET_DOMAIN = 'https://www.ecanlitvizle.live/canlitv';
    const HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${TARGET_DOMAIN}/`,
        'Origin': TARGET_DOMAIN
    };

    try {
        const { data } = await axios.get(TARGET_DOMAIN, { headers: HEADERS });
        const $ = cheerio.load(data);
        const links = [];
        const allClasses = new Set();

        // Sitedeki tüm bağlantıları ve sınıfları toplayıp görelim ki doğru yeri bulalım
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim().replace(/\s+/g, ' ');
            const className = $(el).attr('class');
            if (href) links.push({ text, href, className });
        });

        // Eğer ?debug=true parametresiyle çağrılırsa sitedeki tüm linkleri döker
        if (req.query.debug === 'true') {
            return res.status(200).json({ basarili: true, toplamLink: links.length, links: links.slice(0, 50) });
        }

        const channels = [];

        // Genellikle bu tür sitelerde maçlar veya kanallar 'a' etiketleri içinde listelenir.
        // Tüm linkleri tarayıp içinde maç/kanal barındıranları çekelim:
        $('a').each((i, element) => {
            const title = $(element).text().trim().replace(/\s+/g, ' ');
            const pageUrl = $(element).attr('href');
            const logo = $(element).find('img').attr('src') || '';

            // İçinde saat veya takım adı geçen ya da belirli bir uzunluğa sahip linkleri yakala
            if (title && pageUrl && pageUrl.length > 3 && !pageUrl.startsWith('#')) {
                channels.push({
                    name: title,
                    logo: logo.startsWith('http') ? logo : (logo ? `${TARGET_DOMAIN}${logo}` : ''),
                    pageUrl: pageUrl.startsWith('http') ? pageUrl : `${TARGET_DOMAIN}${pageUrl}`
                });
            }
        });

        // Benzersiz isimleri filtrele
        const uniqueChannels = Array.from(new Set(channels.map(c => c.name)))
            .map(name => channels.find(c => c.name === name));

        res.status(200).json({
            basarili: true,
            toplam: uniqueChannels.length,
            channels: uniqueChannels.slice(0, 30) // İlk 30 tanesini test için verelim
        });

    } catch (error) {
        res.status(500).json({ basarili: false, hata: error.message });
    }
};
