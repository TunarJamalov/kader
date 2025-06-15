// script.js (Sadece loadScene fonksiyonu güncellenmiş hali)

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
    inventory: [] // Oyuncunun sahip olduğu eşyalar (örn: 'pusula')
};

const scenes = {
    // Giriş sahnesi
    'intro': {
        text: "Güneş, küçük ve huzurlu Woodhollow Köyü'nün yemyeşil tepelerinin üzerinden yeni doğuyordu. Kuş sesleri ve fırıncı Amca Borin'in ekmek kokusu havayı dolduruyordu. Elara, 20'li yaşlarının başında, penceresinden dışarı bakarken içinde tuhaf bir sıkıntı hissediyordu. Köy hayatı güzeldi ama o hep daha fazlasını hayal etmişti: macera, keşif, bilinmeyene yolculuk...\n\nDün gece duyduğu yaşlıların fısıltıları zihninde yankılanıyordu: 'Woodhollow Ormanı'nın derinliklerinde, efsanelere göre, 'Son Dilek Ağacı' varmış. Dilekleri gerçekleştirdiği söylenen, ama aynı zamanda büyük bedelleri de olan bir ağaç...'",
        choices: [
            { 
                text: "Bugün ne yapmalıyım?", 
                nextScene: 'morningDecision',
                textImage: 'img/what_to_do.png' 
            }
        ]
    },
    
    // Sahne 1: Sabahın Kararı
    'morningDecision': {
        text: "Sabah kahvaltısının ardından, Elara kendini iki yol ayrımında buldu. İçindeki huzursuzluk, onu sıradan bir güne mi devam edeceğine, yoksa bilinmeyene mi adım atacağına dair zorlu bir karara itiyordu. Köyün tanıdık yüzleri bir yanda, ormanın gizemli çağrısı diğer yanda...",
        choices: [
            { 
                text: "Köyde kalıp günlük işlerine devam etmek. (Güvenli Yol)", 
                nextScene: 'villageLife',
                textImage: 'img/village_card.png' 
            },
            { 
                text: "Dilek Ağacı efsanesini araştırmaya karar vermek. (Macera)", 
                nextScene: 'preparingForJourney',
                textImage: 'img/forest_card.png' 
            }
        ]
    },

    // Sahne 2A: Köy Hayatı
    'villageLife': {
        text: "Elara, fırında Amca Borin'e yardım etti. Hamur yoğurdu, sıcak ekmeklerin kokusuyla burnu doldu. Ardından annesine odun taşıdı, komşularla sohbet etti. Gün sıradan, huzurlu ama heyecansız geçti. Akşam yatağına uzandığında, dışarıdaki rüzgarın fısıltılarını dinlerken, 'Acaba diğer yol nasıl olurdu?' diye düşünmeden edemedi. Bilinmeyene duyduğu özlem, kalbinde küçük bir sızı bıraktı. Yarına dair umudu ve biraz da pişmanlığı vardı. Sıradan bir hayatın sonuydu.",
        choices: [
            { 
                text: "Oyunu Baştan Başla", 
                nextScene: 'restartGame',
                textImage: 'img/restart_game.png' 
            } 
        ]
    },

    // Sahne 2B: Maceraya Hazırlık
    'preparingForJourney': {
        text: "Dilek Ağacı fikri Elara'nın zihnini ele geçirmişti. Maceraya atılmadan önce iyi hazırlanmalıydı. Evdeki erzaklarına baktı. Yolda işine yarayacak birkaç şey alabilirdi.",
        choices: [
            { 
                text: "Sadece biraz kuru ekmek ve su al. (Hafif ve Hızlı)", 
                nextScene: 'forestCall_light', 
                textImage: 'img/bread_water.png' 
            },
            { 
                text: "Dayanıklı bir ip, keskin bir bıçak ve daha fazla erzak topla. (Tedbirli)", 
                nextScene: 'forestCall_heavy', 
                textImage: 'img/supplies.png' 
            }
        ]
    },

    // Sahne 3B-Hafif: Ormanın Çağrısı (Hafif Erzak)
    'forestCall_light': {
        text: "Elara, sırt çantasına sadece biraz yiyecek ve su doldurup gizlice Woodhollow Ormanı'na doğru yola çıktı. Hafif adımlarla ilerlerken, orman giderek sıklaşıyor, ağaçlar gökyüzünü kapatıyordu. Eski bir haritada Dilek Ağacı'nın yerini gösteren kabataslak bir çizim bulmuştu. Patikayı takip ederken, garip bir hışırtı sesi duydu. Yüksek bir yerden geliyor gibiydi. İçinde hem merak hem de hafif bir korku vardı.",
        choices: [
            { 
                text: "Sese doğru ilerlemek.", 
                nextScene: 'mysteriousSound', 
                textImage: 'img/sound_card.png' 
            },
            { 
                text: "Sesi görmezden gelip patikaya devam etmek.", 
                nextScene: 'lostPath', 
                textImage: 'img/ignore_sound_card.png' 
            }
        ]
    },

    // Sahne 3B-Tedbirli: Ormanın Çağrısı (Tedbirli Erzak)
    'forestCall_heavy': {
        text: "Elara, sırt çantasına dayanıklı bir ip, keskin bir bıçak ve bolca erzak doldurup gizlice Woodhollow Ormanı'na doğru yola çıktı. Ağırlığı hissetse de içi rahattı. Orman giderek sıklaşıyor, ağaçlar gökyüzünü kapatıyordu. Eski bir haritada Dilek Ağacı'nın yerini gösteren kabataslak bir çizim bulmuştu. Patikayı takip ederken, garip bir hışırtı sesi duydu. Yüksek bir yerden geliyor gibiydi. Tedbirli oluşu, ona fazladan güven veriyordu ama yine de temkinliydi.",
        choices: [
            { 
                text: "Sese doğru ilerlemek.", 
                nextScene: 'mysteriousSound', 
                textImage: 'img/sound_card.png' 
            },
            { 
                text: "Sesi görmezden gelip patikaya devam etmek.", 
                nextScene: 'lostPath_prepared', 
                textImage: 'img/ignore_sound_card.png' 
            } 
        ]
    },

    // Sahne 4B-YENİ: Gizemli Ses
    'mysteriousSound': {
        text: "Elara sese doğru temkinli adımlarla ilerledi. Gür yaprakların arasından geçince küçük bir dere kenarında bacağı sıkışmış yaşlı bir gezginle karşılaştı. Gezginin yanındaki sepetten etrafa nadir bitkiler saçılmıştı. Yaşlı adamın acı içinde kıvrandığını görmek, Elara'nın kalbini burktu. Ancak, bir şüphe de içinde filizlendi. Bu tuzağa benzer bir durum muydu?",
        choices: [
            { 
                text: "Gezgine yardım etmek.", 
                nextScene: 'travelerGratitude', 
                textImage: 'img/help_hand.png' 
            },
            { 
                text: "Durumu uzaktan gözlemle ve şüphelerini kontrol et.", 
                nextScene: 'observeTraveler', 
                textImage: 'img/observe_traveler.png' 
            },
            { 
                text: "Zaten acelem var diyerek geçip gitmek.", 
                nextScene: 'lostPath', 
                damage: 1, 
                textImage: 'img/ignore_traveler.png' 
            }
        ]
    },

    // Sahne 5A-YENİ: Gezgini Gözlemleme
    'observeTraveler': {
        text: "Elara, gezgine hemen yaklaşmak yerine bir ağacın arkasına saklanıp durumu uzaktan gözlemlemeye karar verdi. Birkaç dakika sonra, yaşlı adamın gerçekten çaresiz olduğunu, sahtekarlık yapmadığını anladı. Vicdanı rahatlamıştı, ama aynı zamanda biraz zaman kaybetmişti.",
        choices: [
            { 
                text: "Artık gezgine yardım et.", 
                nextScene: 'travelerGratitude_delayed', 
                textImage: 'img/help_hand.png' 
            },
            { 
                text: "Geç kalmadan yoluma devam edeyim.", 
                nextScene: 'lostPath', 
                damage: 1, 
                textImage: 'img/ignore_traveler.png' 
            }
        ]
    },

    // Sahne 6A-YENİ: Gezginin Minnettarlığı (Gecikmeli)
    'travelerGratitude_delayed': {
        text: "Elara, gezgine yaklaşıp bacağını kurtardı. Yaşlı adam minnetle gülümsedi. 'Çok teşekkür ederim genç Elara. Bir an için tereddüt ettiğini hissettim ama yardım etme isteğin galip geldi. Ben bir bitki bilimciyim ve bu otlar benim hayatım. Bu iyiliğin karşılığında sana bir şey borçluyum.' Gezgin, Elara'ya parlayan, eski bir **pusula** verdi. 'Bu pusula, kaybolduğunda sana doğru yolu gösterir, ama sadece gerçekten önemli bir karar anında... Ve bu, verdiğin her kararı daha da önemseyeceğin anlamına gelir.' Elara, pusulayı alıp yoluna devam etti. Pusulanın hafif nabzı avucunda hissediliyordu.",
        choices: [
            { 
                text: "Yola devam et.", 
                nextScene: 'dilekTreeAccess', 
                textImage: 'img/continue_path.png' 
            }
        ],
        effect: () => { gameState.inventory.push('pusula'); console.log("Oyuncu pusulayı kazandı! Envanter:", gameState.inventory); }
    },
    
    // Sahne 5B-Normal: Kayıp Patika (Normal)
    'lostPath': {
        text: "Elara, sese aldırış etmeden veya gezgini yalnız bırakarak patikasına devam etti. Ancak bir süre sonra patika iyice inceldi ve kayboldu. Etrafı saran ağaçlar artık hiç tanıdık gelmiyordu. Vahşi hayvan sesleri yankılanıyordu. Gittikçe endişeleniyordu, adımları hızlandı.",
        choices: [
            { 
                text: "Rastgele bir yöne doğru ilerlemek. (Kaybolma Riski)", 
                nextScene: 'lostEnding', 
                damage: 2, 
                textImage: 'img/lost_forest.png' 
            }, 
            { 
                text: "Geri dönmeye çalışmak. (Yorucu)", 
                nextScene: 'returnToVillageRisk', 
                damage: 1, 
                textImage: 'img/return_path.png' 
            },
            { 
                text: "Pusulayı kullan.", 
                nextScene: 'dilekTreeAccess', 
                textImage: 'img/compass_use.png', 
                requires: 'pusula' // Oyuncunun envanterinde "pusula" olmalı
            }
        ]
    },

    // Sahne 5B-Hazırlıklı: Kayıp Patika (Hazırlıklı)
    'lostPath_prepared': {
        text: "Elara, tedbirli oluşunun rahatlığıyla patikaya devam etti. Ancak bir süre sonra patika iyice inceldi ve kayboldu. Etrafı saran ağaçlar artık hiç tanıdık gelmiyordu. Vahşi hayvan sesleri yankılanıyordu. Sakinliğini koruyarak çantasındaki eşyaları düşündü. Paniğe kapılmadan bir çözüm yolu aramaya başladı.",
        choices: [
            { 
                text: "Keskin bıçağı kullanarak kendine bir yol açmak.", 
                nextScene: 'clearPath', 
                textImage: 'img/use_knife.png' 
            },
            { 
                text: "Ağaca tırmanıp yolu gözlemlemeye çalışmak. (Riskli)", 
                nextScene: 'climbTreeAttempt', 
                damage: 1, 
                textImage: 'img/climb_tree.png' 
            },
            { 
                text: "Pusulayı kullan.", 
                nextScene: 'dilekTreeAccess', 
                textImage: 'img/compass_use.png', 
                requires: 'pusula' 
            }
        ]
    },

    // Sahne 6B-1: Yol Açmak
    'clearPath': {
        text: "Elara, keskin bıçağını kullanarak ormanın sık çalılıkları arasında kendine bir yol açtı. Kolay değildi ama kararlılığı sayesinde ilerleyebildi. Bir süre sonra uzakta, ağaçların arasından hafif bir ışıltı gördü. Dilek Ağacı olmalıydı.",
        choices: [
            { 
                text: "Işıltıya doğru ilerle.", 
                nextScene: 'dilekTreeAccess', 
                textImage: 'img/follow_light.png' 
            }
        ]
    },

    // Sahne 6B-2: Ağaca Tırmanma Girişimi
    'climbTreeAttempt': {
        text: "Elara, en yakın ağaca tırmanmaya çalıştı. Dallar kaygandı ve tırmanmak düşündüğünden zordu. Bir dala uzanırken ayağı kaydı ve aşağı yuvarlandı, hafifçe sırtını ve bacağını vurdu. Canı acımıştı ve morali bozulmuştu. Ne yazık ki, yukarıdan da net bir yol göremedi. Yorgunluk hissi tüm vücudunu sarmıştı.",
        choices: [
            { 
                text: "Vazgeç ve rastgele bir yöne ilerle.", 
                nextScene: 'lostEnding', 
                damage: 1, 
                textImage: 'img/give_up.png' 
            }, 
            { 
                text: "Geri dönmeye çalış.", 
                nextScene: 'returnToVillageRisk', 
                damage: 0, 
                textImage: 'img/return_path.png' 
            }
        ]
    },

    'returnToVillageRisk': {
        text: "Ormanda zorlu bir yolculuktan sonra, Elara yaralı bereli ve bitkin bir şekilde Woodhollow Köyü'ne geri döndü. Macerası kısa sürmüştü ve kalbinde büyük bir hayal kırıklığı vardı. Pişmanlık ve yorgunluk, ruhunu kaplamıştı. Belki de bu hayat, onun için değildi...",
        choices: [
            { 
                text: "Oyunu Baştan Başla", 
                nextScene: 'restartGame',
                textImage: 'img/restart_game.png' 
            }
        ]
    },

    // Sahne 8: Dilek Ağacı'na Ulaşma
    'dilekTreeAccess': {
        text: "Uzun ve zorlu bir yolculuğun ardından, Elara sonunda o devasa ağacın karşısında durdu. Gökyüzüne uzanan dalları, yapraklarından yayılan hafif bir ışıltı ve gövdesindeki oyuklarda biriken dilek notları... Dilek Ağacı'ydı bu. Havada büyülü bir enerji hissediliyordu. Yaklaştığında, ağacın köklerinde parlayan bir taş gördü. Bu taş, dilekleri gerçekleştirmek için bir bedel istiyordu. Taşın yüzeyindeki antik yazılar, zihnine fısıldar gibiydi: 'Her dileğin bir yankısı vardır...'",
        choices: [
            { 
                text: "Bir dilek dilemek.", 
                nextScene: 'wishOptions', 
                textImage: 'img/wish_tree.png' 
            },
            { 
                text: "Dilek dilemeden geri dönmek.", 
                nextScene: 'returnEnding', 
                textImage: 'img/turn_back.png' 
            }
        ]
    },

    // Sahne 9: Dilek Seçenekleri
    'wishOptions': {
        text: "Ne dilemek istersin? Taşın ışıltısı parmak uçlarında geziniyor, her bir dileğin fısıltısını ruhunda hissediyordu. Hangi yol, Elara'nın kalbindeki boşluğu dolduracaktı?",
        choices: [
            { 
                text: "Zenginlik dilemek.", 
                nextScene: 'wealthEnding', 
                textImage: 'img/gold_coin.png' 
            },
            { 
                text: "Güç dilemek.", 
                nextScene: 'powerEnding', 
                textImage: 'img/sword.png' 
            },
            { 
                text: "Aşk dilemek.", 
                nextScene: 'loveEnding', 
                textImage: 'img/heart_filled_wish.png' 
            },
            { 
                text: "Bilgi dilemek.", 
                nextScene: 'knowledgeEnding', 
                textImage: 'img/book.png' 
            }
        ]
    },

    // Sonlar
    'wealthEnding': {
        text: "Elara zengin bir tüccar oldu, şehirler gezdi, saraylarda yaşadı. Her dileği yerine geldi, ama bu servetle birlikte gelen yalnızlık ve boşluk ruhunu kemirdi. Köyünü, basit ama gerçek ilişkilerini özledi. Elde ettiği her şey, kaybettiği sıcaklığın yerini dolduramadı. Servet içinde, ama mutsuz bir yaşam sürdü. Dileğin bedeli, kalbine ağır geldi. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'powerEnding': {
        text: "Elara olağanüstü güçlere sahip oldu. Ormanın en derin sırlarını çözebiliyor, yaban hayvanlarını kontrol edebiliyor, hatta fırtınaları dindirebiliyordu. Ancak bu güç, ona büyük bir yalnızlık getirdi. Artık kimse onunla eşit değildi, kimse onu tam olarak anlayamıyordu. Gücüyle Woodhollow'u koruyan bir efsane mi olacak, yoksa gücünün kölesi mi? Bu hikaye burada son buldu, ancak Elara'nın kaderi senin elinde. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'loveEnding': {
        text: "Elara, kalbini ısıtan biriyle tanıştı. Dileği gerçek olmuştu, ama bu ilişkinin önündeki engeller, sıradan bir hayatın zorluklarından çok daha fazlasıydı. Aşkları sınandı, imkansızlıklarla yüzleştiler. İki kalbi birleştirmek için büyük fedakarlıklar yapması, kendi dileğinden bile vazgeçmesi gerekti. Büyük zorluklar karşısında dahi aşkına sadık kaldı ve gerçek mutluluğu buldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'knowledgeEnding': {
        text: "Elara dünyanın tüm gizemlerini öğrendi. Unutulmuş lisanları konuşabiliyor, yıldızların hareketlerini yorumlayabiliyor, evrenin sırlarına vakıf olabiliyordu. Ancak bu bilginin ağırlığı omuzlarına bindi. Öğrendiği her sır, onu insanlardan biraz daha uzaklaştırdı. Artık sıradan hayat ona anlamsız geliyordu, insanlar basit ve küçük görünüyordu. Yalnız bir bilge olarak hayatına devam etti, dünyayı sessizce izleyerek. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'returnEnding': {
        text: "Elara, Dilek Ağacı'nın yanından dilek dilemeden geri döndü. Belki de bir dileğin bedeli, elde edeceği faydadan daha ağır olacaktı. Köye döndüğünde hayatı yine sıradandı, ama bu macera ona yeni bir bakış açısı kazandırdı. Hayatın küçük anlarında gizli güzellikleri, komşularının gülümsemesini, Amca Borin'in sıcak ekmek kokusunu yeniden fark etti. Beklentisizce iç huzuru buldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'lostEnding': {
        text: "Elara ormanda kayboldu, patikayı bulamadı ve günler sonra bitkin düşerek hayatını kaybetti. Susuzluk, açlık ve vahşi doğanın acımasızlığı onu tüketti. Kaderi, basit bir yanlış kararla mühürlendi. Cesedi asla bulunamadı, sadece ormanın fısıltıları arasında hüzünlü bir hikaye olarak kaldı. Woodhollow'da onu hatırlayan tek şey, ormana açılan patikanın sessiz girişiydi. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/restart_game.png' }]
    },
    'gameOver': {
        text: "Canın bitti! Macera burada sona erdi. Daha dikkatli kararlar vermeliydin... Woodhollow'da seni hatırlayan tek şey, ormanın unutulmuş bir köşesindeki sessiz bir anıydı. Pişmanlık, son hissin oldu. Oyun Sonu.",
        choices: [{ text: "Oyunu Baştan Başla", nextScene: 'restartGame', textImage: 'img/game_over_restart.png' }]
    },
    'restartGame': {
        text: "Oyun baştan başlıyor...", // Bu metin görünmez, sadece effect çalışır
        choices: [], 
        effect: () => {
            gameState.currentHP = gameState.maxHP; // Canı sıfırla
            gameState.inventory = []; // Envanteri sıfırla
            updateHearts(); // Kalpleri güncelle
            gameContainer.classList.remove('visible'); // Oyun ekranını gizle
            gameContainer.classList.add('hidden');
            menuContainer.classList.remove('hidden'); // Ana menüyü göster
        }
    }
};


// Oyunun şu anki sahnesini tutan değişken
let currentScene = 'intro';

// Kalpleri güncelleyen fonksiyon
function updateHearts() {
    heartsContainer.innerHTML = '';
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

    if (gameState.currentHP <= 0 && sceneName !== 'gameOver') {
        loadScene('gameOver');
        return;
    }

    if (sceneName === 'restartGame') {
        if (scene.effect) {
            scene.effect();
        }
        return; 
    }

    storyText.style.opacity = 0;
    choicesContainer.style.opacity = 0;
    
    setTimeout(() => { 
        storyText.textContent = scene.text;
        choicesContainer.innerHTML = '';

        scene.choices.forEach(choice => {
            if (choice.requires && !gameState.inventory.includes(choice.requires)) {
                return; 
            }

            const choiceCard = document.createElement('div');
            choiceCard.classList.add('choice-card');
            
            // Metin üstte
            const choiceText = document.createElement('p');
            choiceText.textContent = choice.text;
            choiceCard.appendChild(choiceText);

            // Görsel altta, kartın kalanını kaplayacak
            if (choice.textImage) {
                const img = document.createElement('img');
                img.src = choice.textImage;
                img.alt = choice.text;
                img.classList.add('card-image');
                choiceCard.appendChild(img);
            }

            choiceCard.addEventListener('click', () => {
                if (choice.damage !== undefined) {
                    gameState.currentHP -= choice.damage;
                    updateHearts();
                    if (gameState.currentHP <= 0) {
                        loadScene('gameOver');
                        return;
                    }
                }

                if (scene.effect) {
                    scene.effect();
                }

                loadScene(choice.nextScene); 
            });
            choicesContainer.appendChild(choiceCard);
        });

        storyText.style.opacity = 1;
        choicesContainer.style.opacity = 1;

        currentScene = sceneName;
    }, 300);
}

// Başlat butonuna tıklanınca
startButton.addEventListener('click', () => {
    menuContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('visible');

    gameState.currentHP = gameState.maxHP;
    gameState.inventory = []; 
    updateHearts();
    loadScene('intro');
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Burada herhangi bir ek işlem yok, gameContainer başlangıçta gizli.
});