// Plate viewer. Native <dialog>, no dependencies.
(function () {
  var dlg = document.getElementById('lightbox');
  if (!dlg) return;
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var plates = Array.prototype.slice.call(document.querySelectorAll('.plate'));
  var at = 0;

  function show(i) {
    at = (i + plates.length) % plates.length;
    var p = plates[at];
    img.src = p.dataset.full;
    img.alt = p.dataset.title;
    cap.textContent = p.dataset.title;
  }

  plates.forEach(function (p, i) {
    p.addEventListener('click', function () {
      show(i);
      if (!dlg.open) dlg.showModal();
    });
  });

  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });

  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) dlg.close();          // click the backdrop
  });

  dlg.addEventListener('close', function () {
    if (plates[at]) plates[at].focus();
  });

  document.addEventListener('keydown', function (e) {
    if (!dlg.open) return;
    if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
  });
})();

// Video facade. Nothing is requested from YouTube until the reader asks for it.
(function () {
  document.querySelectorAll('.video[data-yt]').forEach(function (box) {
    var btn = box.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.yt + '?autoplay=1&rel=0';
      f.title = box.dataset.title || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.loading = 'lazy';
      box.replaceChild(f, btn);
      f.focus();
    });
  });
})();

// The Mechanical Choir. SING drops in at a random point in the recording,
// as it always has; the length is read from the file rather than assumed,
// because the mp3 and ogg renders are not the same length.
(function () {
  document.querySelectorAll('[data-choir]').forEach(function (box) {
    var audio = box.querySelector('audio');
    var sing = box.querySelector('[data-sing]');
    var hold = box.querySelector('[data-hold]');
    if (!audio || !sing || !hold) return;

    function dropIn() {
      var d = audio.duration;
      if (isFinite(d) && d > 2) audio.currentTime = Math.random() * (d - 2);
      audio.play();
    }

    sing.addEventListener('click', function () {
      if (isFinite(audio.duration) && audio.duration > 2) { dropIn(); return; }
      audio.addEventListener('loadedmetadata', dropIn, { once: true });
      audio.load();
    });

    hold.addEventListener('click', function () { audio.pause(); });
  });
})();
