// src/data/lessons.ts
export interface Question {
  q: string;
  options: string[];
  answer: number; // options index
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  body: string[]; // paragraflar; "- " ile başlayanlar madde işareti
  quiz: Question[];
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  lessons: Lesson[];
}

export const MODULES: Module[] = [
  {
    id: "budget",
    title: "Para ve Bütçe",
    emoji: "💼",
    blurb: "Paranın nereye gittiğini bil, akışı sen yönet.",
    lessons: [
      {
        id: "budget-1",
        title: "Gelir, gider ve 50/30/20",
        minutes: 4,
        body: [
          "Bütçe, paraya ne yapacağını *harcamadan önce* söylemektir. Amaç kısıtlamak değil, bilinçli seçim yapmaktır.",
          "50/30/20 kuralı başlangıç için basit bir çerçeve sunar:",
          "- %50 İhtiyaçlar: kira, fatura, ulaşım, market, asgari borç ödemeleri",
          "- %30 İstekler: dışarıda yemek, abonelikler, hobi, tatil",
          "- %20 Tasarruf ve borç kapatma: acil durum fonu, yatırım, ekstra borç ödemesi",
          "Oranlar herkes için aynı olmak zorunda değil. İhtiyaçların %50'yi aşıyorsa sorun disiplinde değil yapıdadır: gelir artırma veya sabit gider düşürme seçeneklerine bak.",
          "Önce kendine öde: maaş yattığı gün tasarruf payını ayrı hesaba otomatik aktar, kalanı harca.",
        ],
        quiz: [
          {
            q: "50/30/20 kuralında %20'lik pay neye ayrılır?",
            options: ["İstekler", "Tasarruf ve borç kapatma", "Kira ve faturalar"],
            answer: 1,
            explain: "%50 ihtiyaç, %30 istek, %20 tasarruf/borç kapatma için ayrılır.",
          },
          {
            q: "'Önce kendine öde' ne demektir?",
            options: [
              "Önce kendi keyfin için harca",
              "Gelir gelince tasarruf payını önce ayır, kalanı harca",
              "Borçları hiç ödeme",
            ],
            answer: 1,
            explain: "Tasarruf, harcamadan arta kalan değil, öncelikli bir gider kalemi olmalıdır.",
          },
          {
            q: "Netflix aboneliği hangi kategoriye girer?",
            options: ["İhtiyaç", "İstek", "Tasarruf"],
            answer: 1,
            explain: "Yaşamsal olmayan, vazgeçilebilir harcamalar 'istek' kategorisindedir.",
          },
        ],
      },
      {
        id: "budget-2",
        title: "Acil durum fonu",
        minutes: 3,
        body: [
          "Acil durum fonu; iş kaybı, sağlık gideri, cihaz arızası gibi beklenmedik durumlar için ayrılan, kolay ulaşılabilir paradır.",
          "Hedef: aylık zorunlu giderlerinin 3–6 katı. Gelirin düzensizse (freelance, komisyon) 6 ay ve üzerini hedefle.",
          "- Yatırım değil sigortadır: getirisi değil erişilebilirliği önemlidir.",
          "- Vadesiz veya kolay bozulabilir ürünlerde tut; kripto/hisse gibi dalgalı varlıklarda tutma.",
          "- Küçük başla: ilk hedef 1 aylık gider. Her ay otomatik transfer et.",
          "Fon olmadan yatırım yapan biri, ilk acil durumda yatırımını zararına bozmak zorunda kalabilir.",
        ],
        quiz: [
          {
            q: "Acil durum fonu için tipik hedef nedir?",
            options: ["1 haftalık harcama", "3–6 aylık zorunlu gider", "Yıllık maaşın tamamı"],
            answer: 1,
            explain: "Genel kural 3–6 aylık zorunlu giderdir; düzensiz gelirde daha fazlası önerilir.",
          },
          {
            q: "Acil durum fonu nerede tutulmalı?",
            options: ["Dalgalı hisse senetlerinde", "Kolay erişilebilir, düşük riskli ürünlerde", "Nakit olarak yastık altında"],
            answer: 1,
            explain: "Önceliğin erişilebilirlik ve değer korumasıdır; yüksek getiri değil.",
          },
          {
            q: "Aylık zorunlu giderin 20.000 TL ise 6 aylık hedef kaç TL'dir?",
            options: ["60.000", "120.000", "240.000"],
            answer: 1,
            explain: "20.000 × 6 = 120.000 TL.",
          },
        ],
      },
    ],
  },
  {
    id: "inflation",
    title: "Enflasyon ve Tasarruf",
    emoji: "📉",
    blurb: "Paranın değeri sabit değil; alım gücünü koru.",
    lessons: [
      {
        id: "inflation-1",
        title: "Enflasyon ve alım gücü",
        minutes: 4,
        body: [
          "Enflasyon, mal ve hizmet fiyatlarının genel düzeyindeki sürekli artıştır. Aynı parayla zamanla daha az şey alırsın.",
          "Alım gücü = Paran ÷ Fiyat düzeyi. Fiyatlar %50 artarsa, 100 TL'nin alım gücü yaklaşık 67 TL'ye düşer (100 ÷ 1,5).",
          "- Nominal değer: cebindeki rakam",
          "- Reel değer: o rakamla gerçekte alabildiklerin",
          "Bu yüzden 'parayı hiç harcamamak' değer korumaz. Hesaplar için resmî ve bağımsız enflasyon verilerini takip et ve getirini onlarla kıyasla.",
        ],
        quiz: [
          {
            q: "Enflasyon yükselirken nominal tutar sabit kalırsa alım gücü ne olur?",
            options: ["Artar", "Değişmez", "Azalır"],
            answer: 2,
            explain: "Fiyatlar artarken aynı tutarla daha az mal ve hizmet alınır.",
          },
          {
            q: "Reel değer neyi ifade eder?",
            options: ["Cebindeki rakamı", "Paranın alım gücüyle ölçülen değerini", "Faiz oranını"],
            answer: 1,
            explain: "Reel değer, enflasyondan arındırılmış değerdir.",
          },
          {
            q: "Fiyatlar %100 artarsa 1.000 TL'nin alım gücü yaklaşık kaç TL olur?",
            options: ["500", "900", "0"],
            answer: 0,
            explain: "1.000 ÷ 2 = 500 TL.",
          },
        ],
      },
      {
        id: "inflation-2",
        title: "Reel getiri",
        minutes: 3,
        body: [
          "Reel getiri ≈ nominal getiri − enflasyon. Kesin formül: (1 + nominal) ÷ (1 + enflasyon) − 1.",
          "Örnek: %40 faiz kazandın, enflasyon %50 ise reel getirin yaklaşık −%6,7'dir. Hesabındaki rakam büyür ama alım gücün azalır.",
          "- Getiri karşılaştırırken her zaman vergi/stopaj ve enflasyonu hesaba kat.",
          "- 'Garantili yüksek getiri' vaatlerine şüpheyle yaklaş; yüksek getiri genellikle yüksek risk demektir.",
          "Simülatör sekmesinde farklı getiri ve enflasyon senaryolarını dene.",
        ],
        quiz: [
          {
            q: "Nominal getiri %30, enflasyon %45 ise reel getiri nasıldır?",
            options: ["Pozitif", "Sıfır", "Negatif"],
            answer: 2,
            explain: "Getiri enflasyonun altında kaldığı için alım gücü azalır.",
          },
          {
            q: "Reel getirinin kesin formülü hangisidir?",
            options: ["(1+nominal)/(1+enflasyon) − 1", "nominal × enflasyon", "nominal + enflasyon"],
            answer: 0,
            explain: "Yaklaşık olarak nominal − enflasyon, kesin olarak oran formülü kullanılır.",
          },
          {
            q: "'Garantili ve çok yüksek getiri' vaadi için en doğru yaklaşım?",
            options: ["Hemen katıl", "Şüpheyle yaklaş, kaynağı ve riski araştır", "Arkadaşlara da öner"],
            answer: 1,
            explain: "Yüksek getiri çoğunlukla yüksek risk veya dolandırıcılık işaretidir.",
          },
        ],
      },
    ],
  },
  {
    id: "debt",
    title: "Borç ve Kredi Kartı",
    emoji: "💳",
    blurb: "Borç bir araçtır; kontrol sende olduğunda.",
    lessons: [
      {
        id: "debt-1",
        title: "Faiz ve asgari ödeme tuzağı",
        minutes: 4,
        body: [
          "Kredi kartında yalnızca asgari tutarı ödediğinde kalan borca aylık faiz işler. Borç uzun süre kapanmaz ve toplam maliyet katlanır.",
          "- Mümkünse ekstre borcunun tamamını öde; o zaman faiz işlemez.",
          "- Tamamını ödeyemiyorsan asgarinin çok üzerinde sabit bir tutar belirle.",
          "- Nakit avans genellikle en pahalı borçlanma türüdür; mümkün olduğunca kaçın.",
          "- Birden çok borcun varsa 'çığ' (en yüksek faizliyi önce kapat) yöntemi toplam faizi en aza indirir.",
          "Simülatör sekmesinde kendi borcunun kaç ayda biteceğini ve toplam faizi hesapla.",
        ],
        quiz: [
          {
            q: "Faiz işlememesi için ne yapmalısın?",
            options: ["Asgari ödemeyi yapmak", "Ekstre borcunun tamamını ödemek", "Başka karta aktarmak"],
            answer: 1,
            explain: "Ekstre borcunun tamamı ödenirse akdi faiz işlemez.",
          },
          {
            q: "Birden çok borçta toplam faizi en aza indiren yöntem hangisidir?",
            options: ["Çığ (en yüksek faizliyi önce öde)", "En küçük borcu hep son öde", "Hepsine eşit asgari öde"],
            answer: 0,
            explain: "Çığ yöntemi en pahalı borcu önce kapatarak toplam faiz maliyetini düşürür.",
          },
          {
            q: "Aylık ödeme, borcun aylık faizinden küçük veya eşitse ne olur?",
            options: ["Borç yine de biter", "Borç asla azalmaz", "Faiz silinir"],
            answer: 1,
            explain: "Ödeme faizi karşılamadığı için anapara azalmaz, borç büyür.",
          },
        ],
      },
      {
        id: "debt-2",
        title: "Kredi notu ve sağlıklı borç",
        minutes: 3,
        body: [
          "Kredi notu, borçlarını zamanında ödeme geçmişinin sayısal özetidir. Finansmana erişimini ve faiz oranlarını etkiler.",
          "- Ödemeleri vadesinde yap; gecikme notu en çok düşüren davranıştır.",
          "- Kart limitinin büyük kısmını sürekli kullanma.",
          "- Kısa sürede çok sayıda kredi başvurusu yapma.",
          "Sağlıklı borç; gelir getiren veya değer koruyan, geri ödemesi gelirinle rahatça karşılanabilen borçtur. Pratik sınır: aylık borç ödemelerin net gelirinin kabaca %30–40'ını aşmasın.",
        ],
        quiz: [
          {
            q: "Kredi notunu en çok olumsuz etkileyen davranış?",
            options: ["Ödemeleri geciktirmek", "Kartı kullanmak", "Maaş hesabı açmak"],
            answer: 0,
            explain: "Ödeme gecikmeleri notu belirgin şekilde düşürür.",
          },
          {
            q: "Aylık net gelir 30.000 TL ise borç ödemeleri için makul üst sınır yaklaşık?",
            options: ["~10.000 TL", "~25.000 TL", "~30.000 TL"],
            answer: 0,
            explain: "%30–40 kabaca 9.000–12.000 TL'dir.",
          },
          {
            q: "Hangisi sağlıklı borç özelliğidir?",
            options: ["Geri ödemesi gelirle rahat karşılanır", "Tatil için nakit avansla çekilir", "Başka borcu kapatmak için sürekli yenilenir"],
            answer: 0,
            explain: "Sürdürülebilirlik, sağlıklı borcun temel şartıdır.",
          },
        ],
      },
    ],
  },
  {
    id: "invest",
    title: "Yatırım Temelleri",
    emoji: "📈",
    blurb: "Zaman, çeşitlendirme ve disiplin.",
    lessons: [
      {
        id: "invest-1",
        title: "Bileşik getiri ve zaman",
        minutes: 4,
        body: [
          "Bileşik getiri, kazancın da kazanç getirmesidir. Zaman, tutardan daha güçlü bir değişkendir.",
          "Örnek: yıllık %10 getiriyle 10.000 TL, 30 yılda yaklaşık 174.000 TL olur; ilk 10 yılda ise yaklaşık 26.000 TL.",
          "- Erken başla: 5 yıl erken başlamak çoğu zaman daha yüksek tutar yatırmaktan değerlidir.",
          "- Düzenli yatır: aylık otomatik katkı davranışsal hataları azaltır.",
          "- Masrafları izle: yıllık %1–2 komisyon uzun vadede getirinin büyük kısmını götürebilir.",
          "Bu içerik eğitim amaçlıdır, yatırım tavsiyesi değildir.",
        ],
        quiz: [
          {
            q: "Bileşik getirinin en önemli girdisi nedir?",
            options: ["Şans", "Zaman", "Haber takibi"],
            answer: 1,
            explain: "Kazanç yeniden yatırıldıkça etki zamanla üstel büyür.",
          },
          {
            q: "Düzenli aylık yatırımın başlıca avantajı?",
            options: ["Kesin kazanç sağlar", "Zamanlama hatasını ve duygusal kararları azaltır", "Vergiyi sıfırlar"],
            answer: 1,
            explain: "Otomatik ve düzenli katkı, 'doğru anı bulma' baskısını ortadan kaldırır.",
          },
          {
            q: "Yıllık komisyon/masraflar uzun vadede neden önemlidir?",
            options: ["Önemsizdir", "Bileşik etkiyle getiriyi ciddi azaltır", "Sadece kısa vadede etkilidir"],
            answer: 1,
            explain: "Masraflar da bileşik etkiyle büyür ve nihai tutarı düşürür.",
          },
        ],
      },
      {
        id: "invest-2",
        title: "Risk, getiri ve çeşitlendirme",
        minutes: 4,
        body: [
          "Risk ve beklenen getiri birlikte hareket eder: daha yüksek potansiyel getiri, daha yüksek dalgalanma demektir.",
          "Çeşitlendirme, tüm yumurtaları aynı sepete koymamaktır: farklı varlık sınıfları, sektörler ve ülkeler.",
          "- Vade: kısa vadeli ihtiyacın için riskli varlık kullanma.",
          "- Risk toleransı: %30 düşüşte uykunu kaybetmeyecek miktarı yatır.",
          "- Duygusal kararlar (FOMO, panik satışı) uzun vadeli performansın en büyük düşmanıdır.",
          "Yatırım yapmadan önce sırayla: acil durum fonu → pahalı borçların kapatılması → düzenli yatırım.",
        ],
        quiz: [
          {
            q: "Çeşitlendirmenin amacı nedir?",
            options: ["Getiriyi garanti etmek", "Tek bir varlığın riskine bağımlılığı azaltmak", "Vergi ödememek"],
            answer: 1,
            explain: "Çeşitlendirme riski dağıtır; getiriyi garanti etmez.",
          },
          {
            q: "Önerilen sıra hangisi?",
            options: [
              "Yatırım → acil fon → borç",
              "Acil fon → pahalı borç kapatma → düzenli yatırım",
              "Sadece borç al, yatırım yap",
            ],
            answer: 1,
            explain: "Önce güvenlik ağı ve pahalı borçlar, sonra yatırım gelir.",
          },
          {
            q: "6 ay sonra ihtiyaç duyacağın para için en uygun yaklaşım?",
            options: ["Yüksek riskli varlıklara yatır", "Düşük riskli, erişilebilir araçlarda tut", "Borçlanıp yatırım yap"],
            answer: 1,
            explain: "Kısa vadeli ihtiyaçta sermaye koruma önceliklidir.",
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export const findLesson = (id: string): Lesson | undefined => ALL_LESSONS.find((l) => l.id === id);
