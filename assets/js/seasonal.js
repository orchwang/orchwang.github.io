// Seasonal avatar — in December the warlord dons a Santa hat.
// Progressive enhancement: runs client-side, so the seasonal swap follows the
// visitor's real date even though the site is statically built. Targets any
// <picture data-santa> (header crest + home hero) and swaps its source/img to
// the Santa orc. No-op outside December; reduced-motion irrelevant (no motion).
(function () {
  if (new Date().getMonth() !== 11) return; // 0-indexed: 11 = December
  var santa = '/assets/images/avatar/santa-orc.webp';
  function swap() {
    document.querySelectorAll('picture[data-santa]').forEach(function (pic) {
      var source = pic.querySelector('source');
      if (source) source.srcset = santa;
      var img = pic.querySelector('img');
      if (img) { img.srcset = santa; img.src = santa; }
    });
  }
  if (document.readyState !== 'loading') swap();
  else document.addEventListener('DOMContentLoaded', swap);
})();
