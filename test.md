# 📋 **TYD REGEX v3 - TEST LİSTESİ**

---

## ✅ **1. TEMEL KARAKTER SINIFLARI**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 1.1 | `l3` | `abc` | ✅ `abc` |
| 1.2 | `l3` | `ABC` | ❌ No match |
| 1.3 | `L3` | `ABC` | ✅ `ABC` |
| 1.4 | `L3` | `abc` | ❌ No match |
| 1.5 | `r3` | `123` | ✅ `123` |
| 1.6 | `r3` | `abc` | ❌ No match |
| 1.7 | `h3` | `AbC` | ✅ `AbC` (harf: büyük/küçük karışık) |
| 1.8 | `x2` | `@#` | ✅ `@#` (sembol) |
| 1.9 | `v2` | `ae` | ✅ `ae` (sesli) |
| 1.10 | `s2` | `bc` | ✅ `bc` (sessiz) |

---

## ✅ **2. SEQUENCE (SIRALAMA)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 2.1 | `l3r2` | `abc12` | ✅ `abc12` |
| 2.2 | `l3r2` | `ab123` | ❌ No match (ab = 2 harf, 3 değil) |
| 2.3 | `L2l3r2` | `ABabc12` | ✅ `ABabc12` |
| 2.4 | `vsv` | `aba` | ✅ `aba` (sesli-sessiz-sesli) |
| 2.5 | `svs` | `bab` | ✅ `bab` (sessiz-sesli-sessiz) |
| 2.6 | `r2x1r2` | `12@34` | ✅ `12@34` |

---

## ✅ **3. ARALIK DESTEĞI**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 3.1 | `l(2-4)` | `abc` | ✅ `abc` (3 harf, 2-4 arası) |
| 3.2 | `l(2-4)` | `ab` | ✅ `ab` (2 harf, minimum) |
| 3.3 | `l(2-4)` | `abcd` | ✅ `abcd` (4 harf, maksimum) |
| 3.4 | `l(2-4)` | `abcde` | ✅ `abcd` (greedy: 4 alır) |
| 3.5 | `l(2-4)` | `a` | ❌ No match (1 harf, minimum 2) |
| 3.6 | `r(3-5)` | `1234` | ✅ `1234` (4 rakam) |
| 3.7 | `r(3-5)` | `12` | ❌ No match (2 rakam, minimum 3) |

---

## ✅ **4. LITERAL (SABİT METİN)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 4.1 | `'hello'` | `hello` | ✅ `hello` |
| 4.2 | `'hello'` | `Hello` | ❌ No match (case-sensitive) |
| 4.3 | `'hello'l3` | `helloabc` | ✅ `helloabc` |
| 4.4 | `l3'@'l3` | `abc@xyz` | ✅ `abc@xyz` |
| 4.5 | `r3'.'r3` | `123.456` | ✅ `123.456` |
| 4.6 | `'test'r2` | `test99` | ✅ `test99` |

---

## ✅ **5. ALTERNATION (VEYA)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 5.1 | `l3(r\|v)` | `abc1` | ✅ `abc1` (r = rakam) |
| 5.2 | `l3(r\|v)` | `abca` | ✅ `abca` (v = sesli) |
| 5.3 | `l3(r\|v)` | `abcb` | ❌ No match (b = sessiz) |
| 5.4 | `(L\|l)3` | `ABC` | ✅ `ABC` |
| 5.5 | `(L\|l)3` | `abc` | ✅ `abc` |
| 5.6 | `r2(x\|r)r2` | `12@34` | ✅ `12@34` (x = sembol) |
| 5.7 | `r2(x\|r)r2` | `12534` | ✅ `12534` (r = rakam) |

---

## ✅ **6. KARMAŞIK DESENLER**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 6.1 | `L2l(3-5)r2` | `ABabc12` | ✅ `ABabc12` |
| 6.2 | `L2l(3-5)r2` | `ABabcde12` | ✅ `ABabcde12` |
| 6.3 | `vsvsv` | `ababa` | ✅ `ababa` |
| 6.4 | `'http'l(3-6)'.com'` | `httptest.com` | ✅ `httptest.com` |
| 6.5 | `r3'@'l3'.'(l\|r)3` | `123@abc.xyz` | ✅ `123@abc.xyz` |
| 6.6 | `L(1-2)l(5-8)r(2-3)` | `Abcdefg12` | ✅ `Abcdefg12` (şifre pattern) |

---

## ✅ **7. GERÇEK DÜNYA ÖRNEKLERİ**

### **7.1 Telefon Numarası (TR)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 7.1.1 | `'0'r3r3r2r2` | `05551234567` | ✅ `05551234567` |
| 7.1.2 | `'0'r3r3r2r2` | `0555123456` | ❌ No match (eksik rakam) |

### **7.2 Basit Email**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 7.2.1 | `l(3-10)'@'l(3-10)'.com'` | `test@example.com` | ✅ `test@example.com` |
| 7.2.2 | `l(3-10)'@'l(3-10)'.com'` | `ab@ex.com` | ❌ No match (ab = 2, min 3) |

### **7.3 Hex Renk Kodu**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 7.3.1 | `'#'h6` | `#ff5733` | ✅ `#ff5733` |
| 7.3.2 | `'#'h6` | `#FF5733` | ✅ `#FF5733` |
| 7.3.3 | `'#'h6` | `#zz5733` | ❌ No match (z = harf değil) |

### **7.4 Tarih (DD.MM.YYYY)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 7.4.1 | `r2'.'r2'.'r4` | `29.10.2025` | ✅ `29.10.2025` |
| 7.4.2 | `r2'.'r2'.'r4` | `9.10.2025` | ❌ No match (eksik sıfır) |

### **7.5 Şifre (En Az 1 Büyük, 5 Küçük, 2 Rakam)**

| Test | Sorgu | Metin | Beklenen Sonuç |
|------|-------|-------|----------------|
| 7.5.1 | `L(1-2)l(5-8)r(2-3)` | `Abcdefg123` | ✅ `Abcdefg123` |
| 7.5.2 | `L(1-2)l(5-8)r(2-3)` | `abcdefg123` | ❌ No match (büyük harf yok) |

---

## ⏳ **8. HENÜZ DESTEKLENMEYENLER**

### **8.1 Scope (w:, l:, d:)**

| Test | Sorgu | Metin | Beklenen Sonuç | Durum |
|------|-------|-------|----------------|-------|
| 8.1.1 | `w:l3r2` | `hello abc12 world` | ✅ `abc12` | ⏳ Test et |
| 8.1.2 | `l:l3` | `abc\nxyz` | ✅ `abc` | ⏳ Test et |

### **8.2 Unlimited (a)**

| Test | Sorgu | Metin | Beklenen Sonuç | Durum |
|------|-------|-------|----------------|-------|
| 8.2.1 | `a'end'` | `start...end` | ✅ `start...end` | ⏳ Eklenecek |
| 8.2.2 | `'start'a'end'` | `startmiddleend` | ✅ `startmiddleend` | ⏳ Eklenecek |

### **8.3 Negatif ((-'text'))**

| Test | Sorgu | Metin | Beklenen Sonuç | Durum |
|------|-------|-------|----------------|-------|
| 8.3.1 | `(-'cat')a` | `dog` | ✅ `dog` | ⏳ Eklenecek |
| 8.3.2 | `(-'cat')a` | `cat` | ❌ No match | ⏳ Eklenecek |

---

## 📊 **TEST SONUÇLARI TABLOSU**

Test ederken bu tabloyu doldur:

| Kategori | Toplam Test | ✅ Başarılı | ❌ Başarısız | % Başarı |
|----------|-------------|-------------|--------------|----------|
| 1. Karakter Sınıfları | 10 | ? | ? | ?% |
| 2. Sequence | 6 | ? | ? | ?% |
| 3. Aralık | 7 | ? | ? | ?% |
| 4. Literal | 6 | ? | ? | ?% |
| 5. Alternation | 7 | ? | ? | ?% |
| 6. Karmaşık | 6 | ? | ? | ?% |
| 7. Gerçek Dünya | 10 | ? | ? | ?% |
| **TOPLAM** | **52** | **?** | **?** | **?%** |

---

## 🎯 **NASIL TEST EDİLİR?**

1. **Her testi UI'ya gir**
2. **"Match" butonuna tıkla**
3. **Sonucu kontrol et:**
   - ✅ = Beklenen sonuç eşleşti
   - ❌ = Hata veya beklenmeyen sonuç
4. **Tabloyu güncelle**

---

## 🚀 **HIZLI BAŞLANGIÇ**

**İlk 5 test:**
```
1. Sorgu: l3      Metin: abc       → ✅ abc
2. Sorgu: l3r2    Metin: abc12     → ✅ abc12
3. Sorgu: l(2-4)  Metin: abc       → ✅ abc
4. Sorgu: 'hello' Metin: hello     → ✅ hello
5. Sorgu: vsv     Metin: aba       → ✅ aba
```

**Bu 5'i test et, sonuçları söyle!** 😊

İyi testler! 🎉