# Borç & Kredi Takip - Finansal Kontrol Merkezi

Mobil öncelikli, bankacılık standartlarında borç, kredi kartı, KMH ve yapılandırma takip web uygulaması.

## Özellikler

1. **Parçalı / Kısmi Ödeme Motoru (Dinamik Takip):**
   - Borçlara yapılan kısmi ödemeler anında kalan ekstre borcunu ve kalan asgari tutarı düşürür.
   - Yapılan her ödeme kredi kartının kullanılabilir limitini artırır ve limit kullanım oranını (örneğin %96'dan %73'e) dinamik olarak iyileştirir.
   - Ödeme yap modalında canlı simülasyon önizlemesi mevcuttur.

2. **Konsolide Finansal Durum Kartı:**
   - Toplam borç, bu ay ödenecek tutar, önümüzdeki 7 gün, asgari ödeme toplamı ve gecikmiş borç sayısı tek ekranda.

3. **Öncelik Motoru ve "Bugün Ne Yapmalıyım?":**
   - 8 Ekim 2026 itibarıyla:
     - 5.000 TL limitli kartın 8 gün gecikmiş olması 🔴
     - Axess Business'ın 1.072 TL limit aşımı 🔴
     - Yapı Kredi Esnek Hesap KMH'ın %100 kullanımı 🔴
     - Yapı Kredi Worldcard'ın %96,3 kullanım oranı ve 30 Ekim vadesi 🟠
     otomatik olarak önceliklendirilir.

4. **30 / 60 / 90 Günlük Nakit Akışı ve Taksit Takvimi:**
   - Ekim, Kasım, Aralık 2026 dönemleri için taksit projeksiyonları ve toplam ödeme yükü.

5. **Kredi Notu Davranışsal Göstergeleri:**
   - Findeks / KKB puanını olumsuz etkileyen gecikmeler, limit doluluk oranları ve asgari disiplin göstergeleri.

6. **PWA Desteği:**
   - iPhone ve Android telefonlara uygulama gibi ana ekrana eklenebilir.

## Nasıl Çalıştırılır?

Klasör içindeki `START.bat` dosyasına çift tıklayabilir veya PowerShell/CMD üzerinden şu komutu çalıştırabilirsiniz:

```bash
cd C:\borc-takip
npm run dev
```

Ardından tarayıcınızda açın:
**http://localhost:3005**
  
