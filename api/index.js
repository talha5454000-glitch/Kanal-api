const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Halka açık güncel Türkiye kanalları IPTV JSON kaynağı
        const response = await axios.get('https://iptv-org.github.io/iptv/countries/tr.json');
        const channels = response.data;

        // Sadece aradığımız temel ulusal kanalları filtreleyelim
        const targetNames = ['TRT 1', 'ATV', 'Kanal D', 'NOW', 'TV8', 'Show TV', 'Star TV'];
        
        let bulununKanallar = [];

        channels.forEach(ch => {
            // İsim eşleşmesine ve yayının çalışır durumda olmasına bakıyoruz
            if (targetNames.some(name => ch.name.toLowerCase().includes(name.toLowerCase()))) {
                if (ch.url && ch.url.endsWith('.m3u8')) {
                    bulununKanallar.push({
                        name: ch.name,
                        time: "CANLI",
                        pageUrl: ch.url,
                        logo: ch.logo || "https://cdn-icons-png.flaticon.com/512/716/716422.png"
                    });
                }
            }
        });

        // Eğer listede mükerrer olanlar varsa temizleyelim
        const uniqueKanallar = Array.from(new Set(bulununKanallar.map(a => a.name)))
            .map(name => {
                return bulununKanallar.find(a => a.name === name);
            });

        return res.status(200).json({
            basarili: true,
            toplam: uniqueKanallar.length,
            kanallar: uniqueKanallar,
            maclar: uniqueKanallar
        });

    } catch (error) {
        return res.status(200).json({
            basarili: false,
            hata: error.message
        });
    }
};
