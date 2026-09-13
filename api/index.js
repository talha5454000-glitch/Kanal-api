// GitHub projeniz için tam çalışan ve logolu/linkli kanal çekme ve listeleme yapısı
async function fetchAndParsePlaylist() {
    const container = document.getElementById('channelsSelectList');
    container.innerHTML = "<p style='text-align:center; color:#71717a; font-size:13px; padding:10px;'>Kanallar yükleniyor...</p>";
    
    try {
        // Dilerseniz buradaki listeyi kendi kaynaklarınızla dilediğiniz gibi genişletebilirsiniz.
        // Her kanalın kendi adı, gerçek .m3u8 stream linki ve logo adresi burada tanımlanır.
        let channels = [
            { 
                name: "Bein Sports 1 HD", 
                streamUrl: "https://hls.livetvuk.com/bein1/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/tr/3/36/BeIN_Sports_1_logo.png" 
            },
            { 
                name: "Bein Sports 2 HD", 
                streamUrl: "https://hls.livetvuk.com/bein2/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/tr/3/36/BeIN_Sports_1_logo.png" 
            },
            { 
                name: "Bein Sports 3 HD", 
                streamUrl: "https://hls.livetvuk.com/bein3/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/tr/3/36/BeIN_Sports_1_logo.png" 
            },
            { 
                name: "S Sport 1 HD", 
                streamUrl: "https://hls.livetvuk.com/ssport1/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/S_Sport_logo.png" 
            },
            { 
                name: "S Sport 2 HD", 
                streamUrl: "https://hls.livetvuk.com/ssport2/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/S_Sport_logo.png" 
            },
            { 
                name: "Exxen Spor HD", 
                streamUrl: "https://hls.livetvuk.com/exxenspor/index.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Exxen_logo.svg" 
            },
            { 
                name: "TRT Spor HD", 
                streamUrl: "https://tv-trtspor.medya.trt.com.tr/master.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/TRT_Spor_logo_2019.png" 
            },
            { 
                name: "TV8 HD", 
                streamUrl: "https://tv8-live.daioncdn.net/tv8/tv8.m3u8", 
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/TV8_Logo_2013.png" 
            }
        ];

        fetchedChannelsCache = channels;
        renderChannelSelectionList(fetchedChannelsCache);

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p style='text-align:center; color:#ff2a2a; font-size:13px; padding:10px;'>Kanallar yüklenemedi.</p>";
    }
}

function renderChannelSelectionList(channels) {
    const container = document.getElementById('channelsSelectList');
    container.innerHTML = "";
    
    if (channels.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#71717a; font-size:13px; padding:10px;'>Kanal bulunamadı.</p>";
        return;
    }

    channels.forEach((ch, index) => {
        const item = document.createElement('div');
        item.className = 'channel-option-item';
        // Logoların düzgün görünmesi için görsel alanı eklendi
        item.innerHTML = `
            <img src="${ch.logo}" style="width:32px; height:32px; object-fit:contain; background:#27272d; border-radius:8px; padding:3px;" onerror="this.style.display='none'">
            <div class="channel-option-name">${ch.name}</div>
        `;
        item.addEventListener('click', () => {
            document.querySelectorAll('.channel-option-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            // Video player için gerekli streamUrl ve kanal bilgileri buraya aktarılır
            selectedChannelData = { id: index, name: ch.name, streamUrl: ch.streamUrl, logo: ch.logo };
        });
        container.appendChild(item);
    });
}
