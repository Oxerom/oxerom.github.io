/* Linkteki firma anahtarını (?k=) okuyup sayfaya firmanın adını ve ilçesini yazar (Emre, 26.10.2026).
   adlar.json'u panel yazar: {"anahtar": {"f": "Firma adı", "s": "İlçe"}}. Anahtar listede yoksa
   ondan ad çıkarılır (Türkçe harfler kaybolur ama sayfa yine firmanın adını gösterir).
   Galeri sayfası anahtarı 4 örnek linkine de ekler. */
(function () {
  var q = new URLSearchParams(location.search), k = (q.get("k") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);
  if (!k) return;
  var galeri = !!document.querySelector(".liste");
  var kok = galeri ? "" : "../";

  function tahmin(a) {
    return a.split("-").filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
  }
  function koy(f, s) {
    f = (f || "").slice(0, 60); s = (s || "").slice(0, 30);
    if (!f) return;
    if (galeri) galeriYaz(f); else demoYaz(f, s);
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
    if (adim) adim.textContent = "Seçtiğiniz tasarımı telefonunuz, çalıştığınız semtler ve Google yorumlarınızla tamamlarız. Bu adım da ücretsiz.";
    var not = document.querySelector("footer p");
    if (not) not.textContent = "Tasarımlardaki telefon numarası, yorumlar ve hizmet listesi şimdilik örnektir.";

    // Küçük resimler: adı silinmiş kapak (kapak-N-bos.jpg, 400x805 ekranda çekildi) + firmanın adı üstüne.
    // Konumlar o çekimden ölçüldü: logo yazısı x48 y50(orta), başlık x22 y311, genişlik 400.
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Archivo:wght@900&display=swap";
    document.head.appendChild(font);
    var stil = document.createElement("style");
    stil.textContent =
      ".telefon{position:relative;container-type:inline-size}" +
      ".telefon .kad{position:absolute;color:#fff;font-family:Archivo,Manrope,sans-serif;font-weight:900;text-transform:uppercase;pointer-events:none}" +
      ".telefon .kad.logo-ad{left:12%;top:6.2%;transform:translateY(-50%);max-width:40%;font-size:" + (f.length > 26 ? 3.4 : f.length > 16 ? 4 : 5) + "cqw;line-height:1.1;letter-spacing:.01em}" +
      ".telefon .kad.baslik{left:5.5%;top:38.7%;max-width:89%;font-size:" + (f.length > 26 ? 7.5 : f.length > 14 ? 9 : 10) + "cqw;line-height:1.04;letter-spacing:-.015em;text-wrap:balance}";
    document.head.appendChild(stil);
    document.querySelectorAll(".telefon").forEach(function (a) {
      var img = a.querySelector("img");
      if (!img || !/kapak-\d\.jpg$/.test(img.getAttribute("src"))) return;
      img.src = img.getAttribute("src").replace(".jpg", "-bos.jpg");
      ["logo-ad", "baslik"].forEach(function (c) {
        var d = document.createElement("span");
        d.className = "kad " + c;
        d.textContent = f;
        a.appendChild(d);
      });
    });
  }

  function demoYaz(f, s) {
    var esler = [["Örnek Kombi Servisi", f], ["Örnek Teknik", f]];
    if (s) esler.push(["Keçiören / Ankara · Keçiören, Etlik, Ovacık, Bağlum, Pursaklar", s + " / Ankara"], ["Keçiören", s]);
    var yuru = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), d, liste = [];
    while ((d = yuru.nextNode())) liste.push(d);
    liste.forEach(function (n) {
      if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) return;
      var t = n.nodeValue, y = t;
      esler.forEach(function (e) { y = y.split(e[0]).join(e[1]); });
      if (y !== t) n.nodeValue = y;
    });
    document.title = f + (s ? " · " + s : "");
    var demo = document.querySelector(".demo");
    if (demo) demo.textContent = "Bu tasarım " + f + " için hazırlandı. Telefon, yorumlar ve form şimdilik örnek.";
    if (s) {
      var yer = encodeURIComponent(s + ", Ankara");
      document.querySelectorAll("iframe[src*='google.com/maps'], a[href*='google.com/maps']").forEach(function (e) {
        var at = e.tagName === "IFRAME" ? "src" : "href";
        e.setAttribute(at, e.getAttribute(at).replace(/Ke%C3%A7i%C3%B6ren%2C%20Ankara/g, yer));
      });
    }
    var h1 = document.querySelector(".hero h1");
    if (h1 && f.length > 14) h1.style.fontSize = f.length > 26 ? "clamp(30px,5.2vw,64px)" : "clamp(36px,6.4vw,84px)";
    if (h1) h1.style.maxWidth = "22ch";
    var geri = document.querySelectorAll("a[href='../'], a[href='../index.html']");
    geri.forEach(function (a) { a.href = "../?k=" + encodeURIComponent(k); });
    if (window.dispatchEvent) window.dispatchEvent(new Event("resize"));   // üstteki şerit yüksekliği yeniden ölçülsün
  }

  fetch(kok + "adlar.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (m) { var x = m[k]; if (x) koy(x.f, x.s); else koy(tahmin(k), ""); });
})();
