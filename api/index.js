        // 2. ULUSAL KANALLAR LİSTESİ (Sabit ve Garantili Resmi Kaynaklar)
        if (req.query.getChannels) {
            const kanallar = [
                { name: "TRT 1", pageUrl: "https://tv.trt.com.tr/trt1", streamUrl: "https://tv-trt1.live.trt.com.tr/master.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/TRT_1_logo_2021.svg" },
                { name: "ATV", pageUrl: "https://www.atv.com.tr/canli-yayin", streamUrl: "https://trkvz-live.ercdn.net/atvhd/atvhd.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Atv_logo_2020.svg" },
                { name: "Kanal D", pageUrl: "https://www.kanald.com.tr/canli-yayin", streamUrl: "https://demiroren-live.daioncdn.net/kanald/kanald_720p.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Kanal_D_logo_2018.svg" },
                { name: "NOW TV", pageUrl: "https://www.nowtv.com.tr/canli-yayin", streamUrl: "https://live.fermedya.com/nowtv/nowtv_720p.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/NOW_logo_2024.svg" },
                { name: "TV8", pageUrl: "https://www.tv8.com.tr/canli-yayin", streamUrl: "https://tv8-live.tv8.com.tr/tv8_720p.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/TV8_logo_2013.svg" },
                { name: "Show TV", pageUrl: "https://www.showtv.com.tr/canli-yayin", streamUrl: "https://ciner-live.daioncdn.net/showtv/showtv.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Show_TV_logo_2022.svg" },
                { name: "Star TV", pageUrl: "https://www.startv.com.tr/canli-yayin", streamUrl: "https://dogus-live.daioncdn.net/startv/startv.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Star_TV_logo_2019.svg" }
            ];

            return res.status(200).json({
                basarili: true,
                toplam: kanallar.length,
                kanallar: kanallar
            });
        }
