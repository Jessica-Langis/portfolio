/* ==================================================
   Home — keep the "found it" hotspot on the orange tree
   ================================================== */

(function () {
   // background.png size and the tree's box within it (image pixels)
   var IMG_W = 1907, IMG_H = 873;
   var TREE = { x: 908, y: 472, w: 84, h: 176 };
   var PAD = 10; // extra hit area around the tree, in screen pixels

   var stage = document.querySelector('.stage');
   var spot = document.querySelector('.tree-spot');
   if (!stage || !spot) return;

   // Mirror background-size: cover + background-position: center
   function place() {
      var W = stage.clientWidth, H = stage.clientHeight;
      var scale = Math.max(W / IMG_W, H / IMG_H);
      var ox = (W - IMG_W * scale) / 2;
      var oy = (H - IMG_H * scale) / 2;

      spot.style.left = (ox + TREE.x * scale - PAD) + 'px';
      spot.style.top = (oy + TREE.y * scale - PAD) + 'px';
      spot.style.width = (TREE.w * scale + PAD * 2) + 'px';
      spot.style.height = (TREE.h * scale + PAD * 2) + 'px';
   }

   var pending = false;
   window.addEventListener('resize', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; place(); });
   });

   // Tap (or click) toggles the reveal — also the hook for whatever comes next
   spot.addEventListener('click', function () {
      spot.classList.toggle('found');
   });

   place();
})();
