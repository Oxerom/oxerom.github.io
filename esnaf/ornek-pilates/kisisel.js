/* Pilates galerisi (04.11.2026): linkteki firma anahtarını (?k=) okuyup sayfaya stüdyonun adını ve ilçesini yazar.
   Kombi galerisinin kisisel.js'inin pilates kopyası. Ad listesi ORTAK: ../ornek/adlar.json (panel yazar,
   {"anahtar": {"f": "Firma adı", "s": "İlçe", "c": "Şehir"}}). Şehir yoksa Ankara sayılır. Anahtar listede yoksa
   ondan ad çıkarılır. Galeri sayfası anahtarı 4 örnek linkine de ekler. */
(function () {
  var q = new URLSearchParams(location.search), k = (q.get("k") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);
  if (!k) return;
  var galeri = !!document.querySelector(".liste");
  var adlar = galeri ? "../ornek/adlar.json" : "../../ornek/adlar.json";

  function tahmin(a) {
    return a.split("-").filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
  }
  function koy(f, s, c) {
    f = (f || "").slice(0, 60); s = (s || "").slice(0, 30); c = (c || "").slice(0, 30);
    if (!f) return;
    if (galeri) galeriYaz(f); else demoYaz(f, s, c);
  }

  function galeriYaz(f) {
    document.title = f + " için site tasarımları";
    var u = document.querySelector(".ust-yazi"), h = document.querySelector(".giris h1"), p = document.querySelector(".giris p:not(.ust-yazi)");
    if (u) u.textContent = f + " için";
    if (h) h.textContent = "4 site tasarımı, hangisini beğendiniz?";
    if (p) p.textContent = "Dördünde de sayfanın içi aynı, açılıştaki görüntü değişiyor. Birine dokunun, tasarım açılır. Beğendiğinizin numarasını bize mesajla yazmanız yeterli.";
    document.querySelectorAll(".liste a").forEach(function (a) {
      a.href = a.getAttribute("href").replace(/\/?$/, "/") + "?k=" + encodeURIComponent(k);
    });
    var adim = document.querySelector(".adimlar li:nth-child(2)");
    if (adim) adim.textContent = "Seçtiğiniz tasarımı telefonunuz, saatleriniz, dersleriniz ve Google yorumlarınızla tamamlarız. Bu adım da ücretsiz.";
    var not = document.querySelector("footer p");
    if (not) not.textContent = "Tasarımlardaki telefon numarası, saatler, yorumlar ve ders listesi şimdilik örnektir.";

    // Küçük resimler: adı silinmiş kapak (kapak-N-bos.jpg, 400x805 ekranda çekildi, pilates-galeri.py --kapak)
    // + stüdyonun adı üstüne. Ölçüler o çekimden: logo x22 orta-y39.5 (21px); başlık x22, alt kenarı
    // 1-3'te y242.5, 4'te (çizim) y434.5 (44px). Başlık alttan sabit: uzun ad yukarı doğru taşar
    // (üstündeki küçük satır -bos kapakta zaten silik).
    var stil = document.createElement("style");
    stil.textContent =
      ".telefon{position:relative;container-type:inline-size}" +
      ".telefon .kad{position:absolute;color:#fff;font-family:'Bricolage Grotesque',Manrope,sans-serif;font-weight:800;pointer-events:none}" +
      ".telefon .kad.logo-ad{left:5.5%;top:4.9%;transform:translateY(-50%);max-width:52%;font-size:" + (f.length > 26 ? 3.6 : f.length > 16 ? 4.4 : 5.25) + "cqw;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      ".telefon .kad.baslik{left:5.5%;bottom:69.9%;max-width:86%;font-size:" + (f.length > 26 ? 7 : f.length > 14 ? 8.5 : 11) + "cqw;line-height:1.05;letter-spacing:-.03em;text-wrap:balance;text-shadow:0 1px 2px rgba(0,0,0,.5),0 4px 18px rgba(0,0,0,.35)}" +
      ".telefon.cizimkapak .kad.baslik{bottom:46%}";
    document.head.appendChild(stil);
    document.querySelectorAll(".telefon").forEach(function (a) {
      var img = a.querySelector("img");
      var m = img && /kapak-(\d)\.jpg$/.exec(img.getAttribute("src"));
      if (!m) return;
      if (m[1] === "4") a.classList.add("cizimkapak");
      img.src = img.getAttribute("src").replace(".jpg", "-bos.jpg");
      ["logo-ad", "baslik"].forEach(function (c) {
        var d = document.createElement("span");
        d.className = "kad " + c;
        d.textContent = f;
        a.appendChild(d);
      });
    });
  }

  function demoYaz(f, s, c) {
    c = c || "Ankara";
    var yerAd = s || (c !== "Ankara" ? c : "");          // ilçe yoksa şehrin adı yazılır
    var esler = [];
    // yer adları stüdyo adından ÖNCE: "Çukurambar Pilates" gibi bir ad ilçeyle değişmesin
    if (yerAd) esler.push(
      ["Çukurambar, Çankaya / Ankara", s ? s + " / " + c : c],
      ["Çankaya, Ankara", c],
      [", Çankaya", s ? ", " + c : ""],
      ["ÇUKURAMBAR", yerAd.toLocaleUpperCase("tr")],
      ["Çukurambar", yerAd]);
    esler.push(["Örnek Pilates Stüdyosu", f], ["Örnek Pilates", f]);
    var yuru = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), d, liste = [];
    while ((d = yuru.nextNode())) liste.push(d);
    liste.forEach(function (n) {
      if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) return;
      var t = n.nodeValue, y = t;
      esler.forEach(function (e) { y = y.split(e[0]).join(e[1]); });
      if (y !== t) n.nodeValue = y;
    });
    document.title = f + (yerAd ? " · " + yerAd : "");
    var demo = document.querySelector(".demo");
    if (demo) demo.textContent = "Bu tasarım " + f + " için hazırlandı. Telefon, saatler, yorumlar ve form şimdilik örnek.";
    if (yerAd) {
      var yer = encodeURIComponent(s ? s + ", " + c : c);
      document.querySelectorAll("iframe[src*='google.com/maps'], a[href*='google.com/maps']").forEach(function (e) {
        var at = e.tagName === "IFRAME" ? "src" : "href";
        e.setAttribute(at, e.getAttribute(at).replace(/%C3%87ukurambar%2C%20%C3%87ankaya%2C%20Ankara/g, yer));
      });
    }
    var h1 = document.querySelector(".hero h1");
    if (h1 && f.length > 14) h1.style.fontSize = f.length > 26 ? "clamp(30px,4.8vw,60px)" : "clamp(36px,5.8vw,78px)";
    if (h1) h1.style.maxWidth = "20ch";
    document.querySelectorAll("a[href='../'], a[href='../index.html']").forEach(function (a) { a.href = "../?k=" + encodeURIComponent(k); });
    if (window.dispatchEvent) window.dispatchEvent(new Event("resize"));   // üstteki şerit yüksekliği yeniden ölçülsün
  }

  fetch(adlar, { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (m) { var x = m[k]; if (x) koy(x.f, x.s, x.c); else koy(tahmin(k), "", ""); });
})();
