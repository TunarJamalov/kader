// script.js

// DOM elemanlarını seçelim
const startButton = document.getElementById('startButton');
const menuContainer = document.querySelector('.menu-container');
const gameContainer = document.getElementById('gameContainer');
const storyText = document.getElementById('storyText');
const choicesContainer = document.getElementById('choicesContainer');

// Oyunun tüm sahneleri (hikaye veri yapısı)
const scenes = {
    // Giriş sahnesi (Ana menüden sonraki ilk sahne)
    'intro': {
        text: "Güneş, küçük ve huzurlu Woodhollow Köyü'nün yemyeşil tepelerinin üzerinden yeni doğuyordu. Kuş sesleri ve fırıncı Amca Borin'in ekmek kokusu havayı dolduruyordu. Elara, 20'li yaşlarının başında, penceresinden dışarı bakarken içinde tuhaf bir sıkıntı hissediyordu. Köy hayatı güzeldi ama o hep daha fazlasını hayal etmişti: macera, keşif, bilinmeyene yolculuk...",
        choices: [
            { text: "Bugün ne yapmalıyım?", nextScene: 'morningDecision' }
        ]
    },
    
    // Sahne 1: Sabahın Kararı
    'morningDecision': {
        text: "Sabah kahvaltısının ardından, Elara kendini iki yol ayrımında buldu.",
        choices: [
            { text: "Köyde kalıp günlük işlerine devam etmek.", nextScene: 'villageLife' },
            { text: "Dilek Ağacı efsanesini araştırmaya karar vermek.", nextScene: 'forestCall' }
        ]
    },

    // Sahne 2A: Köy Hayatı (A seçeneği)
    'villageLife': {
        text: "Elara, fırında Amca Borin'e yardım etti. Gün sıradan, huzurlu ama heyecansız geçti. Akşam yatağına uzandığında, 'Acaba diğer yol nasıl olurdu?' diye düşünmeden edemedi. Bu, sıradan bir hayatın sonuydu.",
        choices: [
            { text: "Oyunu Baştan Başla", nextScene: 'intro' } // Geçici olarak ana menüye dön
        ]
    },

    // Sahne 2B: Ormanın Çağrısı (B seçeneği)
    'forestCall': {
        text: "Elara, sırt çantasına biraz yiyecek ve su doldurup gizlice Woodhollow Ormanı'na doğru yola çıktı. Orman giderek sıklaşıyor, ağaçlar gökyüzünü kapatıyordu. Eski bir haritada Dilek Ağacı'nın yerini gösteren kabataslak bir çizim bulmuştu. Patikayı takip ederken, garip bir ses duydu.",
        choices: [
            { text: "Sese doğru ilerlemek.", nextScene: 'helpHand' },
            { text: "Sesi görmezden gelip patikaya devam etmek.", nextScene: 'lostPath' }
        ]
    },

    // Sahne 3A: Yardım Eli
    'helpHand': {
        text: "Sese doğru ilerleyen Elara, küçük bir dere kenarında bacağı sıkışmış yaşlı bir gezginle karşılaştı. Gezginin yanındaki sepetten etrafa nadir bitkiler saçılmıştı.",
        choices: [
            { text: "Gezgine yardım etmek.", nextScene: 'travelerGratitude' },
            { text: "\"Zaten acelem var\" diyerek geçip gitmek.", nextScene: 'lostPath' } // Buradan da kayıp patikaya gidebilir
        ]
    },

    // Sahne 4A: Gezginin Minnettarlığı (Gezgin yardımı)
    'travelerGratitude': {
        text: "Elara, büyük çabalarla gezginin bacağını sıkıştığı yerden kurtardı. Yaşlı adam minnetle gülümsedi. 'Çok teşekkür ederim genç Elara. Ben bir bitki bilimciyim ve bu otlar benim hayatım. Bu iyiliğin karşılığında sana bir şey borçluyum.' Gezgin, Elara'ya parlayan, eski bir **pusula** verdi. 'Bu pusula, kaybolduğunda sana doğru yolu gösterir, ama sadece gerçekten önemli bir karar anında...' Elara, pusulayı alıp yoluna devam etti.",
        choices: [
            { text: "Yola devam et.", nextScene: 'dilekTreeAccess' } // Doğrudan Dilek Ağacı'na götürelim şimdilik
        ],
        effect: () => {
            // Buraya oyuncunun envanterine pusulayı ekleme mantığı gelebilir
            // Örneğin: playerInventory.push('pusula');
            console.log("Oyuncu pusulayı kazandı!");
        }
    },

    // Sahne 3B/4B: Kayıp Patika
    'lostPath': {
        text: "Elara, sese aldırış etmeden veya gezgini yalnız bırakarak patikasına devam etti. Ancak bir süre sonra patika iyice inceldi ve kayboldu. Etrafı saran ağaçlar artık hiç tanıdık gelmiyordu.",
        choices: [
            { text: "Rastgele bir yöne doğru ilerlemek.", nextScene: 'lostEnding' }, // Kötü son
            { text: "Geri dönmeye çalışmak.", nextScene: 'villageLife' } // Tekrar köy hayatına dönme (farklı bir son için)
            // Pusula seçeneği için if-else mantığı gerekecek, onu daha sonra ekleriz
        ]
    },

    // Dilek Ağacına Ulaşma (Yardımla veya zorlu yolla)
    'dilekTreeAccess': {
        text: "Uzun ve zorlu bir yolculuğun ardından, Elara sonunda o devasa ağacın karşısında durdu. Gökyüzüne uzanan dalları, yapraklarından yayılan hafif bir ışıltı ve gövdesindeki oyuklarda biriken dilek notları... Dilek Ağacı'ydı bu. Yaklaştığında, ağacın köklerinde parlayan bir taş gördü. Bu taş, dilekleri gerçekleştirmek için bir bedel istiyordu.",
        choices: [
            { text: "Bir dilek dilemek.", nextScene: 'wishOptions' },
            { text: "Dilek dilemeden geri dönmek.", nextScene: 'returnEnding' }
        ]
    },

    // Dilek Seçenekleri
    'wishOptions': {
        text: "Ne dilemek istersin?",
        choices: [
            { text: "Zenginlik dilemek.", nextScene: 'wealthEnding' },
            { text: "Güç dilemek.", nextScene: 'powerEnding' },
            { text: "Aşk dilemek.", nextScene: 'loveEnding' },
            { text: "Bilgi dilemek.", nextScene: 'knowledgeEnding' }
        ]
    },

    // Sonlar (Geçici sonlar, detaylandırılacak)
    'wealthEnding': {
        text: "Elara zengin bir tüccar oldu, ama paranın yalnızlığına çare olmadığını anladı. Köyünü ve eski hayatını özledi. Servet içinde, ama mutsuz bir yaşam sürdü. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    },
    'powerEnding': {
        text: "Elara olağanüstü güçlere sahip oldu. Bu gücü iyiye mi yoksa kötüye mi kullanacağı onun sonraki kararlarına bağlıydı. Bu hikaye burada son buldu, ancak Elara'nın kaderi senin elinde. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    },
    'loveEnding': {
        text: "Elara, kalbini ısıtan biriyle tanıştı, ancak bu ilişkinin önündeki engelleri aşmak zorunda kaldı. Büyük zorluklar karşısında dahi aşkına sadık kaldı. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    },
    'knowledgeEnding': {
        text: "Elara dünyanın tüm gizemlerini öğrendi, ancak bu bilginin ağırlığı omuzlarına bindi. Artık sıradan hayat ona anlamsız geliyordu. Yalnız bir bilge olarak hayatına devam etti. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    },
    'returnEnding': {
        text: "Elara köye geri döndü. Hayatı yine sıradandı, ama bu macera ona yeni bir bakış açısı kazandırdı. Belki de asıl macera, günlük hayatın içinde gizliydi. İç huzuru buldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    },
    'lostEnding': {
        text: "Elara ormanda kayboldu, patikayı bulamadı ve günler sonra bitkin düşerek hayatını kaybetti. Kaderi, basit bir yanlış kararla mühürlendi. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'intro' }]
    }
};

// Oyunun şu anki sahnesini tutan değişken
let currentScene = 'intro'; // Oyuncunun oyuna başladığı ilk sahne

// Sahneyi yükleyen fonksiyon
function loadScene(sceneName) {
    const scene = scenes[sceneName];
    if (!scene) {
        console.error("Sahne bulunamadı:", sceneName);
        return;
    }

    // Geçiş efekti için mevcut içeriği gizle
    storyText.style.opacity = 0;
    choicesContainer.style.opacity = 0;
    
    setTimeout(() => { // Kısa bir gecikme sonrası yeni içeriği yükle
        storyText.textContent = scene.text;
        choicesContainer.innerHTML = ''; // Önceki seçenekleri temizle

        scene.choices.forEach(choice => {
            const choiceCard = document.createElement('div');
            choiceCard.classList.add('choice-card'); // CSS sınıfını ekle
            choiceCard.textContent = choice.text;
            choiceCard.addEventListener('click', () => {
                // Seçimin bir etkisi varsa çalıştır
                if (scene.effect) {
                    scene.effect();
                }
                loadScene(choice.nextScene); // Yeni sahneyi yükle
            });
            choicesContainer.appendChild(choiceCard);
        });

        // Yeni içeriği görünür yap
        storyText.style.opacity = 1;
        choicesContainer.style.opacity = 1;

        currentScene = sceneName; // Güncel sahneyi kaydet
    }, 300); // 300ms gecikme (CSS geçiş süresiyle uyumlu)
}

// Başlat butonuna tıklanınca
startButton.addEventListener('click', () => {
    menuContainer.classList.add('hidden'); // Menüyü gizle
    gameContainer.classList.remove('hidden'); // Oyun kapsayıcısını görünür yap
    gameContainer.classList.add('visible'); // Görünürlük animasyonunu tetikle

    loadScene('intro'); // Oyunun ilk sahnesini yükle
});

// Sayfa yüklendiğinde (henüz oyun başlamadan)
document.addEventListener('DOMContentLoaded', () => {
    // Şimdilik herhangi bir başlangıç kodu yok, sadece buton dinleyici aktifleşiyor.
});