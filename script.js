// script.js

// DOM elemanlarını seçelim
const startButton = document.getElementById('startButton');
const menuContainer = document.querySelector('.menu-container');
const gameContainer = document.getElementById('gameContainer');
const storyText = document.getElementById('storyText');
const choicesContainer = document.getElementById('choicesContainer');
const heartsContainer = document.getElementById('heartsContainer'); // Kalplerin kapsayıcısı

// Oyunun durumu (HP, envanter vb.)
let gameState = {
    currentHP: 4, // Maksimum can sayısını görseldeki gibi 4 yapalım
    maxHP: 4,
    inventory: [] // Belki ileride kullanırız (örn: pusula)
};

// Oyunun tüm sahneleri (hikaye veri yapısı)
const scenes = {
    // Giriş sahnesi (Ana menüden sonraki ilk sahne)
    'intro': {
        text: "Güneş, küçük ve huzurlu Woodhollow Köyü'nün yemyeşil tepelerinin üzerinden yeni doğuyordu. Kuş sesleri ve fırıncı Amca Borin'in ekmek kokusu havayı dolduruyordu. Elara, 20'li yaşlarının başında, penceresinden dışarı bakarken içinde tuhaf bir sıkıntı hissediyordu. Köy hayatı güzeldi ama o hep daha fazlasını hayal etmişti: macera, keşif, bilinmeyene yolculuk...",
        choices: [
            { 
                text: "Bugün ne yapmalıyım?", 
                nextScene: 'morningDecision',
                textImage: 'img/what_to_do.png' // Örnek kart görseli yolu
            }
        ]
    },
    
    // Sahne 1: Sabahın Kararı
    'morningDecision': {
        text: "Sabah kahvaltısının ardından, Elara kendini iki yol ayrımında buldu.",
        choices: [
            { 
                text: "Köyde kalıp günlük işlerine devam etmek.", 
                nextScene: 'villageLife',
                textImage: 'img/village_card.png' // Kendi kart görseliniz
            },
            { 
                text: "Dilek Ağacı efsanesini araştırmaya karar vermek.", 
                nextScene: 'forestCall',
                textImage: 'img/forest_card.png' // Kendi kart görseliniz
            }
        ]
    },

    // Sahne 2A: Köy Hayatı (A seçeneği)
    'villageLife': {
        text: "Elara, fırında Amca Borin'e yardım etti. Gün sıradan, huzurlu ama heyecansız geçti. Akşam yatağına uzandığında, 'Acaba diğer yol nasıl olurdu?' diye düşünmeden edemedi. Sıradan bir hayatın sonuydu. Belki de macera peşinde koşsaydı daha farklı olurdu...",
        choices: [
            { 
                text: "Oyunu Baştan Başla", 
                nextScene: 'restartGame',
                textImage: 'img/restart_game.png' // Kendi kart görseliniz
            } 
        ]
    },

    // Sahne 2B: Ormanın Çağrısı (B seçeneği)
    'forestCall': {
        text: "Elara, sırt çantasına biraz yiyecek ve su doldurup gizlice Woodhollow Ormanı'na doğru yola çıktı. Orman giderek sıklaşıyor, ağaçlar gökyüzünü kapatıyordu. Eski bir haritada Dilek Ağacı'nın yerini gösteren kabataslak bir çizim bulmuştu. Patikayı takip ederken, garip bir ses duydu.",
        choices: [
            { 
                text: "Sese doğru ilerlemek.", 
                nextScene: 'helpHand',
                textImage: 'img/sound_card.png' // Kendi kart görseliniz
            },
            { 
                text: "Sesi görmezden gelip patikaya devam etmek.", 
                nextScene: 'lostPath',
                textImage: 'img/ignore_sound_card.png' // Kendi kart görseliniz
            }
        ]
    },

    // Sahne 3A: Yardım Eli
    'helpHand': {
        text: "Sese doğru ilerleyen Elara, küçük bir dere kenarında bacağı sıkışmış yaşlı bir gezginle karşılaştı. Gezginin yanındaki sepetten etrafa nadir bitkiler saçılmıştı.",
        choices: [
            { 
                text: "Gezgine yardım etmek.", 
                nextScene: 'travelerGratitude',
                textImage: 'img/help_hand.png' // Kendi kart görseliniz
            },
            { 
                text: "Zaten acelem var diyerek geçip gitmek.", 
                nextScene: 'lostPath', 
                damage: 1, // Bu seçim 1 can azaltır
                textImage: 'img/ignore_traveler.png' // Kendi kart görseliniz
            } 
        ]
    },

    // Sahne 4A: Gezginin Minnettarlığı (Gezgin yardımı)
    'travelerGratitude': {
        text: "Elara, büyük çabalarla gezginin bacağını sıkıştığı yerden kurtardı. Yaşlı adam minnetle gülümsedi. 'Çok teşekkür ederim genç Elara. Ben bir bitki bilimciyim ve bu otlar benim hayatım. Bu iyiliğin karşılığında sana bir şey borçluyum.' Gezgin, Elara'ya parlayan, eski bir **pusula** verdi. 'Bu pusula, kaybolduğunda sana doğru yolu gösterir, ama sadece gerçekten önemli bir karar anında...' Elara, pusulayı alıp yoluna devam etti.",
        choices: [
            { 
                text: "Yola devam et.", 
                nextScene: 'dilekTreeAccess',
                textImage: 'img/continue_path.png' // Kendi kart görseliniz
            }
        ],
        effect: () => {
            gameState.inventory.push('pusula');
            console.log("Oyuncu pusulayı kazandı! Envanter:", gameState.inventory);
        }
    },

    // Sahne 3B/4B: Kayıp Patika
    'lostPath': {
        text: "Elara, sese aldırış etmeden veya gezgini yalnız bırakarak patikasına devam etti. Ancak bir süre sonra patika iyice inceldi ve kayboldu. Etrafı saran ağaçlar artık hiç tanıdık gelmiyordu. Vahşi hayvan sesleri yankılanıyordu.",
        choices: [
            { 
                text: "Rastgele bir yöne doğru ilerlemek.", 
                nextScene: 'lostEnding', 
                damage: 2, // Bu seçim 2 can azaltır
                textImage: 'img/lost_forest.png' // Kendi kart görseliniz
            }, 
            { 
                text: "Geri dönmeye çalışmak.", 
                nextScene: 'returnToVillageRisk', 
                damage: 1, // Bu seçim 1 can azaltır
                textImage: 'img/return_path.png' // Kendi kart görseliniz
            }
            // Pusula kontrolü için örnek (şu an pasif):
            // { 
            //     text: "Pusulayı kullan.", 
            //     nextScene: 'dilekTreeAccess', 
            //     textImage: 'img/compass_use.png', // Kendi kart görseliniz
            //     requires: 'pusula' // Oyuncunun envanterinde "pusula" olması gerekir
            // } 
        ]
    },

    'returnToVillageRisk': {
        text: "Ormanda zorlu bir yolculuktan sonra, Elara yaralı bereli bir şekilde Woodhollow Köyü'ne geri döndü. Macerası kısa sürmüştü...",
        choices: [
            { 
                text: "Oyunu Baştan Başla", 
                nextScene: 'restartGame',
                textImage: 'img/restart_game.png' // Kendi kart görseliniz
            }
        ]
    },

    // Dilek Ağacına Ulaşma (Yardımla veya zorlu yolla)
    'dilekTreeAccess': {
        text: "Uzun ve zorlu bir yolculuğun ardından, Elara sonunda o devasa ağacın karşısında durdu. Gökyüzüne uzanan dalları, yapraklarından yayılan hafif bir ışıltı ve gövdesindeki oyuklarda biriken dilek notları... Dilek Ağacı'ydı bu. Yaklaştığında, ağacın köklerinde parlayan bir taş gördü. Bu taş, dilekleri gerçekleştirmek için bir bedel istiyordu.",
        choices: [
            { 
                text: "Bir dilek dilemek.", 
                nextScene: 'wishOptions',
                textImage: 'img/wish_tree.png' // Kendi kart görseliniz
            },
            { 
                text: "Dilek dilemeden geri dönmek.", 
                nextScene: 'returnEnding',
                textImage: 'img/turn_back.png' // Kendi kart görseliniz
            }
        ]
    },

    // Dilek Seçenekleri
    'wishOptions': {
        text: "Ne dilemek istersin?",
        choices: [
            { 
                text: "Zenginlik dilemek.", 
                nextScene: 'wealthEnding', 
                textImage: 'img/gold_coin.png' // Kendi kart görseliniz
            },
            { 
                text: "Güç dilemek.", 
                nextScene: 'powerEnding', 
                textImage: 'img/sword.png' // Kendi kart görseliniz
            },
            { 
                text: "Aşk dilemek.", 
                nextScene: 'loveEnding', 
                textImage: 'img/heart_filled_wish.png' // Kendi kart görseliniz (farklı ikon)
            },
            { 
                text: "Bilgi dilemek.", 
                nextScene: 'knowledgeEnding', 
                textImage: 'img/book.png' // Kendi kart görseliniz
            }
        ]
    },

    // Sonlar
    'wealthEnding': {
        text: "Elara zengin bir tüccar oldu, ama paranın yalnızlığına çare olmadığını anladı. Köyünü ve eski hayatını özledi. Servet içinde, ama mutsuz bir yaşam sürdü. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'powerEnding': {
        text: "Elara olağanüstü güçlere sahip oldu. Bu gücü iyiye mi yoksa kötüye mi kullanacağı onun sonraki kararlarına bağlıydı. Bu hikaye burada son buldu, ancak Elara'nın kaderi senin elinde. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'loveEnding': {
        text: "Elara, kalbini ısıtan biriyle tanıştı, ancak bu ilişkinin önündeki engelleri aşmak zorunda kaldı. Büyük zorluklar karşısında dahi aşkına sadık kaldı. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'knowledgeEnding': {
        text: "Elara dünyanın tüm gizemlerini öğrendi, ancak bu bilginin ağırlığı omuzlarına bindi. Artık sıradan hayat ona anlamsız geliyordu. Yalnız bir bilge olarak hayatına devam etti. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'returnEnding': {
        text: "Elara köye geri döndü. Hayatı yine sıradandı, ama bu macera ona yeni bir bakış açısı kazandırdı. Belki de asıl macera, günlük hayatın içinde gizliydi. İç huzuru buldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'lostEnding': {
        text: "Elara ormanda kayboldu, patikayı bulamadı ve günler sonra bitkin düşerek hayatını kaybetti. Kaderi, basit bir yanlış kararla mühürlendi. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'gameOver': {
        text: "Canın bitti! Macera burada sona erdi. Daha dikkatli kararlar vermeliydin...",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/game_over_restart.png' }]
    },
    'restartGame': {
        text: "Oyun baştan başlıyor...", // Bu metin görünmez, sadece effect çalışır
        choices: [], 
        effect: () => {
            // Oyunu sıfırla ve ana menüyü göster
            gameState.currentHP = gameState.maxHP; // Canı sıfırla
            gameState.inventory = []; // Envanteri sıfırla
            updateHearts(); // Kalpleri güncelle (ana menüye dönmeden önce)
            gameContainer.classList.remove('visible'); // Oyun ekranını gizle
            gameContainer.classList.add('hidden');
            menuContainer.classList.remove('hidden'); // Ana menüyü göster
        }
    }
};

// Oyunun şu anki sahnesini tutan değişken
let currentScene = 'intro'; // Oyuncunun oyuna başladığı ilk sahne

// Kalpleri güncelleyen fonksiyon
function updateHearts() {
    heartsContainer.innerHTML = ''; // Önceki kalpleri temizle
    for (let i = 0; i < gameState.maxHP; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-icon');
        if (i < gameState.currentHP) {
            heart.classList.add('heart-full'); // Can varsa dolu kalp
        } else {
            heart.classList.add('heart-empty'); // Can yoksa boş kalp
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

    // Eğer yeniden başlatma sahnesiyse, özel efekti çalıştır ve çık
    if (sceneName === 'restartGame') {
        if (scene.effect) {
            scene.effect();
        }
        return; 
    }

    // Geçiş efekti için mevcut içeriği gizle
    storyText.style.opacity = 0;
    choicesContainer.style.opacity = 0;
    
    // Kısa bir gecikme sonrası yeni içeriği yükle
    setTimeout(() => { 
        storyText.textContent = scene.text;
        choicesContainer.innerHTML = ''; // Önceki seçenekleri temizle

        // Seçenekleri oluştur ve ekle
        scene.choices.forEach(choice => {
            // Eğer bir seçim için özel bir gereksinim varsa (örn: pusula)
            // ve oyuncuda yoksa, bu seçeneği gösterme.
            // Bu kısmı, pusula mekaniğini aktif etmek istediğinde kullanabilirsin.
            // if (choice.requires && !gameState.inventory.includes(choice.requires)) {
            //     return; // Bu seçeneği atla
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

                // Seçimin bir etkisi varsa çalıştır (örn: pusula kazanma)
                if (scene.effect) {
                    scene.effect();
                }

                // Yeni sahneyi yükle
                loadScene(choice.nextScene); 
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

    // Oyun başladığında kalpleri ve ilk sahneyi yükle
    gameState.currentHP = gameState.maxHP; // Oyuna tam can ile başla
    gameState.inventory = []; // Envanteri sıfırla (eğer varsa)
    updateHearts(); // Kalpleri başlangıçta doldur
    loadScene('intro'); // Oyunun ilk sahnesini yükle
});

// Sayfa yüklendiğinde (henüz oyun başlamadan)
document.addEventListener('DOMContentLoaded', () => {
    // Burada oyunun ana menüsü göründüğünde, kalplerin veya oyun öğelerinin 
    // doğrudan görünmemesi sağlanır. Zaten başlangıçta gameContainer 'hidden' sınıfına sahip.
});