# Teknodoz Finans — Finansal Okuryazarlık MVP

Türkçe, genç yetişkinlere yönelik oyunlaştırılmış finansal okuryazarlık uygulaması.

## Çalıştırma

```bash
npm install
npm run dev     # geliştirme
npm test        # birim testleri
npm run build   # tip kontrolü + üretim derlemesi
```

## Kapsam (Sprint 1–2, tamamlandı)

| Alan | Detay |
|---|---|
| İçerik | 4 modül, 8 ders, 24 quiz sorusu (`src/data/lessons.ts`) |
| Gamification | XP, seviye (100 XP), günlük seri, 7 rozet (`src/lib/progress.tsx`) |
| Simülatörler | Bütçe 50/30/20 + acil fon, enflasyon & bileşik getiri, kredi kartı borç kapatma (`src/lib/finance.ts`) |
| Depolama | `localStorage` (sürümlü anahtar) |

## Yol haritası

| Sprint | Görev |
|---|---|
| 3 | Supabase Auth + `supabase/schema.sql`; localStorage → DB senkronu (misafir ilerlemesini girişte birleştir) |
| 4 | Haftalık liderlik tablosu, arkadaş daveti (referral XP), push/e-posta seri hatırlatıcısı |
| 5 | Cloudflare Pages deploy, PWA/offline, içerik CMS'i (dersleri DB'ye taşı) |
| 6 | Öğrenme analitiği: ders terk oranı, yanlış cevap ısı haritası → içerik iyileştirme |

> İçerik eğitim amaçlıdır, yatırım tavsiyesi değildir. Oran/faiz değerleri simülatörde kullanıcı girdisidir; güncel resmî verilerle karşılaştırılmalıdır.
