// script.js

// DOM elemanlarını seçelim
const startButton = document.getElementById('startButton');
const menuContainer = document.querySelector('.menu-container');
const gameContainer = document.getElementById('gameContainer');
const storyText = document.getElementById('storyText');
const choicesContainer = document.getElementById('choicesContainer');
const heartsContainer = document.getElementById('heartsContainer'); // Yeni: Kalplerin kapsayıcısı

// Oyunun durumu (HP, envanter vb.)
let gameState = {
    currentHP: 4, // Maksimum can sayısını görseldeki gibi 4 yapalım
    maxHP: 4,
    inventory: [] // Belki ileride kullanırız
};

// Oyunun tüm sahneleri (hikaye veri yapısı)
const scenes = {
    'intro': {
        text: "Güneş, küçük ve huzurlu Woodhollow Köyü'nün yemyeşil tepelerinin üzerinden yeni doğuyordu. Kuş sesleri ve fırıncı Amca Borin'in ekmek kokusu havayı dolduruyordu. Elara, 20'li yaşlarının başında, penceresinden dışarı bakarken içinde tuhaf bir sıkıntı hissediyordu. Köy hayatı güzeldi ama o hep daha fazlasını hayal etmişti: macera, keşif, bilinmeyene yolculuk...",
        choices: [
            { text: "Bugün ne yapmalıyım?", nextScene: 'morningDecision' }
        ]
    },
    
    'morningDecision': {
        text: "Sabah kahvaltısının ardından, Elara kendini iki yol ayrımında buldu.",
        choices: [
            { text: "Köyde kalıp günlük işlerine devam etmek.", nextScene: 'villageLife' },
            { text: "Dilek Ağacı efsanesini araştırmaya karar vermek.", nextScene: 'forestCall' }
        ]
    },

    'villageLife': {
        text: "Elara, fırında Amca Borin'e yardım etti. Gün sıradan, huzurlu ama heyecansız geçti. Akşam yatağına uzandığında, 'Acaba diğer yol nasıl olurdu?' diye düşünmeden edemedi. Sıradan bir hayatın sonuydu. Belki de macera peşinde koşsaydı daha farklı olurdu...",
        choices: [
            { text: "Oyunu Baştan Başla", nextScene: 'restartGame' } // Yeni: Oyunu baştan başlatma sahnesi
        ]
    },

    'forestCall': {
        text: "Elara, sırt çantasına biraz yiyecek ve su doldurup gizlice Woodhollow Ormanı'na doğru yola çıktı. Orman giderek sıklaşıyor, ağaçlar gökyüzünü kapatıyordu. Eski bir haritada Dilek Ağacı'nın yerini gösteren kabataslak bir çizim bulmuştu. Patikayı takip ederken, garip bir ses duydu.",
        choices: [
            { text: "Sese doğru ilerlemek.", nextScene: 'helpHand' },
            { text: "Sesi görmezden gelip patikaya devam etmek.", nextScene: 'lostPath' }
        ]
    },

    'helpHand': {
        text: "Sese doğru ilerleyen Elara, küçük bir dere kenarında bacağı sıkışmış yaşlı bir gezginle karşılaştı. Gezginin yanındaki sepetten etrafa nadir bitkiler saçılmıştı.",
        choices: [
            { text: "Gezgine yardım etmek.", nextScene: 'travelerGratitude' },
            { text: "Zaten acelem var diyerek geçip gitmek.", nextScene: 'lostPath' , damage: 1, textImage: 'img/footsteps.png'} // Can azaltan seçim
        ]
    },

    'travelerGratitude': {
        text: "Elara, büyük çabalarla gezginin bacağını sıkıştığı yerden kurtardı. Yaşlı adam minnetle gülümsedi. 'Çok teşekkür ederim genç Elara. Ben bir bitki bilimciyim ve bu otlar benim hayatım. Bu iyiliğin karşılığında sana bir şey borçluyum.' Gezgin, Elara'ya parlayan, eski bir **pusula** verdi. 'Bu pusula, kaybolduğunda sana doğru yolu gösterir, ama sadece gerçekten önemli bir karar anında...' Elara, pusulayı alıp yoluna devam etti.",
        choices: [
            { text: "Yola devam et.", nextScene: 'dilekTreeAccess' }
        ],
        effect: () => {
            gameState.inventory.push('pusula');
            console.log("Oyuncu pusulayı kazandı! Envanter:", gameState.inventory);
        }
    },

    'lostPath': {
        text: "Elara, sese aldırış etmeden veya gezgini yalnız bırakarak patikasına devam etti. Ancak bir süre sonra patika iyice inceldi ve kayboldu. Etrafı saran ağaçlar artık hiç tanıdık gelmiyordu. Vahşi hayvan sesleri yankılanıyordu.",
        choices: [
            { text: "Rastgele bir yöne doğru ilerlemek.", nextScene: 'lostEnding', damage: 2, textImage: 'img/forest.png' }, // Can azaltan seçim
            { text: "Geri dönmeye çalışmak.", nextScene: 'returnToVillageRisk', damage: 1, textImage: 'img/path.png' } // Can azaltan seçim
        ]
        // Burada pusula kontrolü eklenebilir. Örneğin:
        // choices: [
        //    { text: "Pusulayı kullan.", nextScene: 'dilekTreeAccess', requires: 'pusula' }, // Pusula varsa bu seçenek görünür
        //    { text: "Rastgele bir yöne doğru ilerlemek.", nextScene: 'lostEnding', damage: 2 },
        //    { text: "Geri dönmeye çalışmak.", nextScene: 'returnToVillageRisk', damage: 1 }
        // ]
    },

    'returnToVillageRisk': {
        text: "Ormanda zorlu bir yolculuktan sonra, Elara yaralı bereli bir şekilde Woodhollow Köyü'ne geri döndü. Macerası kısa sürmüştü...",
        choices: [
            { text: "Oyunu Baştan Başla", nextScene: 'restartGame' }
        ]
    },

    'dilekTreeAccess': {
        text: "Uzun ve zorlu bir yolculuğun ardından, Elara sonunda o devasa ağacın karşısında durdu. Gökyüzüne uzanan dalları, yapraklarından yayılan hafif bir ışıltı ve gövdesindeki oyuklarda biriken dilek notları... Dilek Ağacı'ydı bu. Yaklaştığında, ağacın köklerinde parlayan bir taş gördü. Bu taş, dilekleri gerçekleştirmek için bir bedel istiyordu.",
        choices: [
            { text: "Bir dilek dilemek.", nextScene: 'wishOptions' },
            { text: "Dilek dilemeden geri dönmek.", nextScene: 'returnEnding' }
        ]
    },

    'wishOptions': {
        text: "Ne dilemek istersin?",
        choices: [
            { text: "Zenginlik dilemek.", nextScene: 'wealthEnding', textImage: 'img/gold_coin.png' },
            { text: "Güç dilemek.", nextScene: 'powerEnding', textImage: 'img/sword.png' },
            { text: "Aşk dilemek.", nextScene: 'loveEnding', textImage: 'img/heart_filled.png' },
            { text: "Bilgi dilemek.", nextScene: 'knowledgeEnding', textImage: 'img/book.png' }
        ]
    },

    // Sonlar (Geçici sonlar, detaylandırılacak)
    'wealthEnding': {
        text: "Elara zengin bir tüccar oldu, ama paranın yalnızlığına çare olmadığını anladı. Köyünü ve eski hayatını özledi. Servet içinde, ama mutsuz bir yaşam sürdü. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'powerEnding': {
        text: "Elara olağanüstü güçlere sahip oldu. Bu gücü iyiye mi yoksa kötüye mi kullanacağı onun sonraki kararlarına bağlıydı. Bu hikaye burada son buldu, ancak Elara'nın kaderi senin elinde. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'loveEnding': {
        text: "Elara, kalbini ısıtan biriyle tanıştı, ancak bu ilişkinin önündeki engelleri aşmak zorunda kaldı. Büyük zorluklar karşısında dahi aşkına sadık kaldı. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'knowledgeEnding': {
        text: "Elara dünyanın tüm gizemlerini öğrendi, ancak bu bilginin ağırlığı omuzlarına bindi. Artık sıradan hayat ona anlamsız geliyordu. Yalnız bir bilge olarak hayatına devam etti. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'returnEnding': {
        text: "Elara köye geri döndü. Hayatı yine sıradandı, ama bu macera ona yeni bir bakış açısı kazandırdı. Belki de asıl macera, günlük hayatın içinde gizliydi. İç huzuru buldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'lostEnding': {
        text: "Elara ormanda kayboldu, patikayı bulamadı ve günler sonra bitkin düşerek hayatını kaybetti. Kaderi, basit bir yanlış kararla mühürlendi. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'gameOver': {
        text: "Canın bitti! Macera burada sona erdi. Daha dikkatli kararlar vermeliydin...",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame' }]
    },
    'restartGame': {
        text: "Oyun baştan başlıyor...",
        choices: [], // Boş bırak, çünkü doğrudan ana menüye gidecek
        effect: () => {
            // Oyunu sıfırla ve ana menüyü göster
            gameState.currentHP = gameState.maxHP; // Canı sıfırla
            gameState.inventory = []; // Envanteri sıfırla
            updateHearts(); // Kalpleri güncelle
            gameContainer.classList.remove('visible');
            gameContainer.classList.add('hidden');
            menuContainer.classList.remove('hidden');
        }
    }
};

// Oyunun şu anki sahnesini tutan değişken
let currentScene = 'intro';

// Kalpleri güncelleyen fonksiyon
function updateHearts() {
    heartsContainer.innerHTML = ''; // Önceki kalpleri temizle
    for (let i = 0; i < gameState.maxHP; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-icon');
        if (i < gameState.currentHP) {
            heart.classList.add('heart-full');
        } else {
            heart.classList.add('heart-empty');
        }
        heartsContainer.appendChild(heart);
    }
}

// Sahneyi yükleyen fonksiyon
function loadScene(sceneName) {
    const scene = scenes[sceneName];
    if (!scene) {
        console.error("Sahne bulunamadı:", sceneName);
        return;
    }

    // Oyun bittiyse ve 'gameOver' sahnesinde değilsek, 'gameOver'a yönlendir
    if (gameState.currentHP <= 0 && sceneName !== 'gameOver') {
        loadScene('gameOver');
        return;
    }

    // Eğer yeniden başlatma sahnesiyse, özel efekti çalıştır
    if (sceneName === 'restartGame') {
        if (scene.effect) {
            scene.effect();
        }
        return; // Yeniden başlatma sahnesi sadece efekti çalıştırır, HTML güncellemez
    }

    // Geçiş efekti için mevcut içeriği gizle
    storyText.style.opacity = 0;
    choicesContainer.style.opacity = 0;
    
    setTimeout(() => { // Kısa bir gecikme sonrası yeni içeriği yükle
        storyText.textContent = scene.text;
        choicesContainer.innerHTML = ''; // Önceki seçenekleri temizle

        scene.choices.forEach(choice => {
            // Eğer bir seçim için özel bir gereksinim varsa (örn: pusula)
            // ve oyuncuda yoksa, bu seçeneği gösterme veya etkisizleştirme
            // if (choice.requires && !gameState.inventory.includes(choice.requires)) {
            //     // Bu seçeneği atla veya farklı bir şekilde göster (örneğin soluk)
            //     return;
            // }

            const choiceCard = document.createElement('div');
            choiceCard.classList.add('choice-card');
            
            // Seçenek görseli varsa ekle
            if (choice.textImage) {
                const img = document.createElement('img');
                img.src = choice.textImage;
                img.alt = choice.text;
                img.classList.add('card-image');
                choiceCard.appendChild(img);
            }

            const choiceText = document.createElement('p'); // Metni p etiketi içine al
            choiceText.textContent = choice.text;
            choiceCard.appendChild(choiceText);


            choiceCard.addEventListener('click', () => {
                // Seçimin bir zararı varsa HP'yi azalt
                if (choice.damage) {
                    gameState.currentHP -= choice.damage;
                    updateHearts(); // Kalpleri güncelle
                    if (gameState.currentHP <= 0) {
                        loadScene('gameOver'); // Can bittiyse oyun sonu sahnesine git
                        return; // Daha fazla işlem yapma
                    }
                }

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
    }, 300);
}

// Başlat butonuna tıklanınca
startButton.addEventListener('click', () => {
    menuContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('visible');

    // Oyun başladığında kalpleri ve ilk sahneyi yükle
    gameState.currentHP = gameState.maxHP; // Oyuna tam can ile başla
    updateHearts();
    loadScene('intro');
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Oyun başladığında kalpleri göstermeden önce bir kez güncelle
    // (eğer oyun direkt açılıyorsa boş kalpler göstermemek için)
    // Şu an için sadece start butonuna basılınca tetikleniyor.
});