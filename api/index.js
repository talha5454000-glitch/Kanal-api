module.exports = async (req, res) => {
    // CORS Başlıkları (Mobil uygulama ve web erişimi için izin)
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

    try {
        // 1. YAYIN LİNKİ ÇÖZME İSTEĞİ
        if (req.query && req.query.getStream && req.query.url) {
            const streamUrl = req.query.url;
            return res.status(200).json({ 
                basarili: true, 
                streamUrl: streamUrl, 
                type: 'm3u8' 
            });
        }

        // 2. ULUSAL KANALLAR LİSTESİ (Varsayılan ve Doğrudan Çıktı)
        const kanallar = [
            { 
                name: "TRT 1", 
                time: "CANLI", 
                pageUrl: "https://tv-trt1.live.trt.com.tr/master.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/TRT_1_logo_2021.svg" 
            },
            { 
                name: "ATV", 
                time: "CANLI", 
                pageUrl: "https://trkvz-live.ercdn.net/atvhd/atvhd.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Atv_logo_2020.svg" 
            },
            { 
                name: "Kanal D", 
                time: "CANLI", 
                pageUrl: "https://demiroren-live.daioncdn.net/kanald/kanald_720p.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Kanal_D_logo_2018.svg" 
            },
            { 
                name: "NOW TV", 
                time: "CANLI", 
                pageUrl: "https://live.fermedya.com/nowtv/nowtv_720p.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/NOW_logo_2024.svg" 
            },
            { 
                name: "TV8", 
                time: "CANLI", 
                pageUrl: "https://tv8-live.tv8.com.tr/tv8_720p.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/TV8_logo_2013.svg" 
            },
            { 
                name: "Show TV", 
                time: "CANLI", 
                pageUrl: "https://ciner-live.daioncdn.net/showtv/showtv.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Show_TV_logo_2022.svg" 
            },
            { 
                name: "Star TV", 
                time: "CANLI", 
                pageUrl: "https://dogus-live.daioncdn.net/startv/startv.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Star_TV_logo_2019.svg" 
            }
        ];

        return res.status(200).json({
            basarili: true,
            toplam: kanallar.length,
            kanallar: kanallar,
            maclar: kanallar // Eski maç listesi yapısını kullanan yerler hata almasın diye kanalları maç listesi olarak da döndürür
        });

    } catch (error) {
        return res.status(200).json({
            basarili: false,
            hata: error.message
        });
    }
};
