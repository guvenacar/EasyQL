console.log("He said: 'hello'");
```

**Pattern:**
 
[('"')][("'")]a[rp=2][rp=1]

[1]    → " yakala
[2]    → ' yakala
[rp=2] → ' tekrarla
[rp=1] → " tekrarla
```

---

### **Örnek 3: URL Parse**
```
https://user:pass@example.com
```

**Pattern:**
```
[protocol]'://'[user]':'[pass]'@'[domain]

Verify:
[rp=1]  → protocol tekrar
[rp=2]  → user tekrar
[rp=3]  → pass tekrar
[rp=4]  → domain tekrar
```

---

## 🎯 **KARAR: `[rp=N]` KULLANILMALI!**

**Evet, `rp=2`, `rp=3` ... gerekli!**

---

## 📊 **SYNTAX KARŞILAŞTIRMASI:**

### **Seçenek A: Sadece `[=N]`**
```
[tag]a[=1]        → Kısa ama karışabilir
[tag]a[=tag]      → İsimli alternatif
```

**Sorun:** `[site='.com']` ile karışabilir

---

### **Seçenek B: `[rp=N]` (Senin Önerin)**
```
[tag]a[rp=1]      → Açık ve net!
[tag][inner]a[rp=2][rp=1]  → Çoklu
```

**Avantaj:** Karışıklık YOK! ✅

---

### **Seçenek C: Her İkisi**
```
[tag]a[=1]        → Kısa (uzmanlar için)
[tag]a[rp=1]      → Açık (yeni başlayanlar için)
```

**En esnek!**

---

## 💡 **BENİM ÖNERİM:**

**Sadece `[rp=N]` kullanalım!**

**Neden?**
- ✅ Açık ve net: "repeat" belli
- ✅ Karışıklık yok: `[site='.com']` ile farklı
- ✅ Tutarlı: `rp=1`, `rp=2`, `rp=3` ...
- ✅ Okunabilir

---

## 📝 **TÜM PARAMETRE SİSTEMİ:**

### **1. Variable (Sabit Tanımlama)**
```
[name='value']

Örnek:
[site='test.com']
[base='https://api.com']
```

---

### **2. Capture (Yakalama)**
```
[name]
[name:pattern]

Örnek:
[user]
[quote:('"')]
[tag:l(1-10)]
```

---

### **3. Variable Kullanımı**
```
[name]

Örnek:
[site='test.com'][site]  → "test.com" kullan
```

---

### **4. Backreference (Tekrarlama)**
```
[rp=N]
[rp=name]

Örnek:
[tag]a[rp=1]              → 1. parametreyi tekrarla
[quote:('"')]a[rp=quote]  → quote parametresini tekrarla
```

---

## 🎯 **DETAYLI ÖRNEKLER:**

### **Örnek 1: HTML Tag**
```
Pattern: '<'[tag]'>'a'</'[rp=1]'>'

<div>content</div>        ✅
<span>text</span>         ✅
<div>content</span>       ❌ (tag'ler farklı)
```

---

### **Örnek 2: Nested HTML**
```
Pattern: '<'[outer]'><'[inner]'>'a'</'[rp=2]'></'[rp=1]'>'

<div><span>text</span></div>  ✅
<div><span>text</div></span>  ❌ (sıra yanlış)
```

---

### **Örnek 3: Quote Matching**
```
Pattern: [('"')]a[rp=1]

"hello"    ✅
'world'    ✅
"mixed'    ❌
```

---

### **Örnek 4: İsimli Backreference**
```
Pattern: [quote:('"')]a[rp=quote]

"test"    ✅
'test'    ✅
```

---

### **Örnek 5: Çoklu Parametreler**
```
Pattern: [protocol]'://'[user]':'[pass]'@'[domain]'/'[path]

Yakalama:
{
  protocol: "https",
  user: "admin",
  pass: "secret",
  domain: "example.com",
  path: "api/v1"
}

Tekrarlama:
[rp=1] → "https"
[rp=2] → "admin"
[rp=3] → "secret"
[rp=4] → "example.com"
[rp=5] → "api/v1"
```

---

## ✅ **FİNAL SYNTAX:**
```
[name='value']    → Variable tanımla
[name]            → Capture (otomatik index)
[name:pattern]    → Capture with pattern
[name]            → Variable kullan (daha önce tanımlanmışsa)
[rp=N]            → N. parametreyi tekrarla (backreference by index)
[rp=name]         → İsimli parametreyi tekrarla (backreference by name)
```

---

## 🎯 **KULLANIM KARŞILAŞTIRMASI:**

| Senaryo | Pattern | Açıklama |
|---------|---------|----------|
| **HTML** | `'<'[tag]'>'a'</'[rp=1]'>'` | Tag eşleştir |
| **Quote** | `[('"')]a[rp=1]` | Tırnak eşleştir |
| **Nested** | `[a][b]a[rp=2][rp=1]` | İç içe |
| **İsimli** | `[q:('"')]a[rp=q]` | İsimli repeat |

---

## ❓ **FİNAL ONAY:**

**Bu syntax'ı onaylıyor musun?**
```
[rp=1]      → 1. parametreyi tekrarla
[rp=2]      → 2. parametreyi tekrarla
[rp=tag]    → "tag" parametresini tekrarla