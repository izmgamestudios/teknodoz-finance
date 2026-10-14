<img src="public/logo.svg" alt="teknodoz" height="48" />

# teknodoz-finance (beta)

Açık kaynak, **local-first** kişisel finans takibi: gelir, gider, maaş, fatura, yatırım. Web ve mobil uyumlu (PWA manifest).

> **Beta / erken erişim:** Veritabanı ve sunucu yoktur. Tüm veri tarayıcının `localStorage` alanında tutulur (çerezler ~4 KB ile sınırlıdır ve her istekle sunucuya gider, bu yüzden kullanılmaz). Tarayıcı verisini temizlemek her şeyi siler; düzenli dışa aktarın.

## Özellikler
- Gelir/gider işlemleri, kategori özeti, aylık toplamlar (tutarlar kuruş cinsinden tam sayı)
- Maaş / fatura gibi tekrarlayan işlemler ve yaklaşan vade hatırlatıcısı
- İçe/dışa aktarım: **CSV, JSON, XLSX** (Zod doğrulama, 5 MB sınırı, CSV formül enjeksiyonu koruması)
- Günlük bütçe serisi (gamification), yedekleme hatırlatıcısı
- Beta bilgilendirme kapısı (yalnızca UX; erişim kontrolü değildir)

## Geliştirme
```bash
npm install
npm run dev        # http://localhost:5173
npm test
npm start          # build + statik sunum (port 4173)
```

## İçe aktarma biçimi (CSV/XLSX)
`date,type,category,amount,description` — `type`: `gelir|gider|income|expense`, tarih `YYYY-MM-DD` veya `GG.AA.YYYY`.

## Bilinen sınırlar
- Cihazlar arası senkron yok (JSON/CSV/XLSX ile taşıyın).
- Veriler şifrelenmez; paylaşılan cihazlarda kullanmayın.
- Service worker (offline) henüz yok.

## Lisans
MIT
