diğer YZ'lerden benim için zorlu regex sorguları istedim. bu sorgular içinde yanıtlayamadıklarımız var mı?

Harika — regex becerilerini gerçekten test edecek türden karma ve düşünmeye zorlayan zor seviye senaryoları aşağıda listeledim. Her biri yalnızca açıklama; regex desenini senin üretmeni hedefliyor.
Zorlukları artan şekilde (1’den 5’e kadar) sıraladım:
🧩 Zorluk 1 — Orta seviye (temel kombinasyon)
1. Başında sesli harf olan ve içinde en az 2 rakam geçen kelimeleri bul.
2. Sonu nokta veya ünlemle biten ama içinde hiç boşluk olmayan cümleleri seç.
3. İlk karakteri harf, son karakteri rakam olan metin parçalarını bul.
4. Ardışık 3 aynı karakteri içeren tüm kelimeleri tespit et.
5. Tırnak içine alınmış, ancak içinde başka tırnak bulunmayan metinleri yakala.
🧩 Zorluk 2 — Karma kombinasyon ve sayma
1. İçinde tam 4 sesli harf geçen kelimeleri bul.
2. Aynı kelimenin iki kez tekrarlandığı (ör. `test test`) durumları tespit et.
3. E-posta benzeri ama geçersiz adresleri bul (ör. `abc@@mail.com`, `@example.com`).
4. Üç farklı rakam türü (örn. 1, 2, 3) geçen dizileri bul.
5. “ab” ile başlayıp, “ba” ile biten, ortasında hiç “aba” geçmeyen metinleri bul.
🧩 Zorluk 3 — Yapısal kontrol (lookaround gerektirir)
1. “http” ile başlayan ancak “https” olmayan URL’leri bul.
2. Ardından nokta gelmeyen kısaltmaları yakala (örn. `Dr` ama `Dr.` değil).
3. Öncesinde boşluk olmayan noktalama işaretlerini bul.
4. Sonu rakamla biten ama öncesi harf olmayan kelimeleri tespit et.
5. Bir kelimenin önünde ve arkasında aynı karakter olan kelimeleri bul (ör. `_test_`, `#data#`).
🧩 Zorluk 4 — Geri referans (backreference / grup kontrolü)
1. Tersinden de aynı okunan (palindrom) kelimeleri yakala (ör. `ada`, `level`).
2. Aynı karakterle başlayan ve biten kelimeleri bul.
3. Bir kelimenin hemen ardından aynısı tekrar ediyorsa sadece ilkini yakala.
4. Tırnak içinde geçen, içindeki tırnak türüyle biten metinleri seç (ör. `"abc"` ve `'def'` geçerli).
5. İki tarih formatı aynıysa (örn. 12/10/2025 - 12/10/2025) bu çifti bul.
🧩 Zorluk 5 — İleri düzey (atomik grup, lookahead, koşul kombinasyonu)
1. İç içe parantezleri doğru kapatan metinleri tespit et (ör. `(a(b)c)` geçerli, `(a(b)` değil).
2. İçinde “cat” geçen ama “catalog” geçmeyen kelimeleri bul.
3. Aynı satırda hem “error” hem “warning” geçen ama “debug” içermeyen satırları seç.
4. Bir HTML etiketinin açılışı ve kapanışı aynıysa eşleşen çiftleri bul (ör. `...` ama `...` değil).
5. Bir cümlede tekrarlanan kelimeleri (case-insensitive) tespit et.
6. Greedy davranışı kırarak, sadece ilk “...” bloğunu yakalayacak desen oluştur.
7. Aynı sayıda açılış ve kapanış parantezi içeren metinleri bul.
8. Bir sayıdan sonra gelen metin sadece harfse o eşleşmeyi seç.
9. Aynı karakter üç kez tekrar etmeyen dizeleri bul.
10. Tüm şartlar: Başında sesli harf, ortasında en az bir sayı, sonunda sessiz harf bulunan kelimeleri bul.
İstersen bunları:
* 🔹 “vaka setleri” gibi gruplandırayım (ör. sadece sesli–sessiz kuralları, sadece yapı/etiket kuralları),
* 🔹 veya rastgele karışık şekilde test bankası (20 soru) biçiminde vereyim (sadece açıklamalar, puanlama sistemiyle).
Hangisini istersin: 👉 “Kategorilere ayrılmış uzun liste” mi, yoksa 👉 “karışık test paketi (örnek veriyle birlikte)” mi?

-----

Elbette, Regex bilginizi test etmek ve sınırlarını zorlamak için farklı konseptleri (lookaround, backreference, quantifiers vb.) birleştiren zorlu sorgu örnekleri hazırladım:
1. Bir metin içinde, art arda gelen (örn: "çok çok", "zor zor") mükerrer kelimeleri bulun.
2. Bir cümlenin başında veya sonunda olmayan, ancak bir rakamdan hemen önce gelen "TL" veya "USD" ifadelerini bulun.
3. Açılış etiketi (``) ile kapanış etiketinin (``) adının aynı olduğu (örn: `kalın` gibi), basit, iç içe geçmemiş HTML etiketlerini bulun.
4. İçinde en az bir rakam (`0-9`) ve en az bir özel karakter (`!@#$%^&*` vb.) bulunan, ancak 'a' harfi içermeyen 8 ila 16 karakter uzunluğundaki şifreleri bulun.
5. Bir metin içindeki çift tırnak (`"..."`) veya tek tırnak (`'...'`) ile yapılmış alıntıları bulun, ancak açılış tırnağı ile kapanış tırnağının türünün (ikisi de çift veya ikisi de tek tırnak) aynı olmasını sağlayın.
6. Bir `q` harfi içeren, ancak bu `q` harfinden hemen sonra bir `u` harfi gelmeyen tüm kelimeleri bulun.
7. Sadece sayılardan oluşan (harf veya sembol içermeyen) satırların tamamını bulun.
8. İçinde "hata" kelimesi geçen, ancak aynı satırda "uyarı" kelimesi geçmeyen satırları bulun.
9. Sonu `.` (nokta) ile biten cümlelerdeki ilk kelimeyi bulun.
10. Bir e-posta adresindeki `@` işaretinden önceki kullanıcı adını ve `@` işaretinden sonraki alan adını (domain) ayrı ayrı gruplayarak bulun.
11. Bir metin içinde, `(` ile açılıp `)` ile kapanan, ancak içinde başka bir parantez bulunmayan (iç içe geçmemiş) parantez içi ifadeleri bulun.
12. Sadece büyük harflerle yazılmış ve en az 4 harften oluşan kelimeleri bulun, ancak bu kelimeler cümlenin başında yer almasın.

---

1. Orta Seviye:
* En az bir büyük harf, bir küçük harf ve bir rakam içeren string'leri bul.
* Arka arkaya iki kez tekrarlanan kelimeleri bul (örneğin: "merhaba merhaba").
* IPv4 adres formatına uygun string'leri bul (örn: 192.168.1.1).
* HTML etiketi içermeyen satırları bul.
* Tırnak işaretleri içindeki metinleri bul (hem tek hem çift tırnak).
2. İleri Seviye:
* Kredi kartı numarası formatında olan ama son rakamı çift olanları bul.
* En az 8 karakter uzunluğunda, en az bir harf, bir rakam ve bir özel karakter içeren şifreleri bul.
* Palindrom olabilecek 3-5 harfli kelimeleri bul (regex ile sınırlı).
* Belirli bir HTML etiketi içindeki attribute'ları bul (örn: ``).
* Basit bir matematik işlemi formatını kontrol eden regex (örn: 45+67, 100/25).
3. Uzman Seviyesi:
* Geçerli bir e-posta adresi formatını doğrula (basit değil, RFC standartlarına yakın).
* JSON formatındaki belirli bir key'e ait value'leri bul.
* XML'deki sadece belirli bir seviyedeki tag'leri bul.
* URL'den query parametrelerini (key-value çiftleri) ayır.
* Belli bir desendeki tarih formatlarını bul (gg.aa.yyyy veya gg-aa-yyyy).
4. Çok Zor Seviye:
* Asal sayıları string olarak tespit et (saf regex ile).
* Balanced parentheses (dengeli parantez) kontrolü yap.
* Basit bir SQL injection pattern'i tespit et.
* CSS'deki hex color kodlarını bul (#fff, #FFFFFF, #a1b2c3).
* Markdown formatındaki linkleri text bul.
Hangi seviyeden başlamak istediğini söyle, istediğin kadar örnek hazırlayabilirim! 😊