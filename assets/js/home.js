// Homepage interactions: photo stack gallery, collapsible news,
// paper abstract/BibTeX panels and the teaser figure lightbox.
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Photo stack ------------------------------------------------------------ */

  function initPhotoStack(stack) {
    const cards = Array.from(stack.querySelectorAll(".stack-card"));
    const dots = Array.from(document.querySelectorAll(".stack-dot"));
    const n = cards.length;
    if (n < 2) return;

    let idx = Math.min(Math.max(parseInt(stack.dataset.start, 10) || 0, 0), n - 1);
    let busy = false;
    const SHUFFLE_MS = reduceMotion ? 0 : 300;

    function render() {
      cards.forEach((card, i) => {
        card.dataset.pos = String((i - idx + n) % n);
        card.removeAttribute("data-moving");
        card.setAttribute("aria-hidden", i === idx ? "false" : "true");
      });
      dots.forEach((dot, i) => dot.setAttribute("aria-current", i === idx ? "true" : "false"));
    }

    // "next" slides the top card out, then tucks it under the stack;
    // "prev" pulls the bottom card out, then lays it on top.
    function shuffle(dir) {
      if (busy) return;
      busy = true;
      const moving = dir > 0 ? idx : (idx - 1 + n) % n;
      cards[moving].dataset.moving = dir > 0 ? "out-next" : "out-prev";
      setTimeout(() => {
        idx = (idx + dir + n) % n;
        render();
        busy = false;
      }, SHUFFLE_MS);
    }

    stack.querySelector(".stack-prev").addEventListener("click", () => shuffle(-1));
    stack.querySelector(".stack-next").addEventListener("click", () => shuffle(1));
    cards.forEach((card) => card.addEventListener("click", () => shuffle(1)));
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        if (busy) return;
        idx = i;
        render();
      })
    );

    stack.tabIndex = 0;
    stack.setAttribute("role", "group");
    stack.setAttribute("aria-label", "Photo gallery");
    stack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") shuffle(1);
      if (e.key === "ArrowLeft") shuffle(-1);
    });

    let touchX = null;
    stack.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
    stack.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) shuffle(dx < 0 ? 1 : -1);
      touchX = null;
    });

    render();
  }

  /* News ------------------------------------------------------------------- */

  function initNews(toggle) {
    const list = document.getElementById(toggle.getAttribute("aria-controls"));
    const extras = Array.from(list.querySelectorAll(".news-extra"));
    const total = toggle.dataset.total;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      extras.forEach((li) => (li.hidden = !open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Show less" : "Show all " + total;
    });
  }

  /* Paper panels ----------------------------------------------------------- */

  function initCardToggle(btn) {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      const target = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") !== "true";
      // One panel per card at a time.
      card.querySelectorAll(".card-toggle").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).hidden = true;
      });
      btn.setAttribute("aria-expanded", String(open));
      target.hidden = !open;
    });
  }

  function initCopy(btn) {
    btn.addEventListener("click", async () => {
      const text = btn.parentElement.querySelector("code").innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch (e) {
        btn.textContent = "Press ⌘C";
        const range = document.createRange();
        range.selectNodeContents(btn.parentElement.querySelector("code"));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => (btn.textContent = "Copy"), 1600);
    });
  }

  /* Lightbox --------------------------------------------------------------- */

  function initLightbox(triggers) {
    if (!triggers.length) return;
    const dialog = document.createElement("dialog");
    dialog.className = "figure-lightbox";
    dialog.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close figure">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>' +
      '<img alt=""><p class="lightbox-caption"></p>';
    document.body.appendChild(dialog);
    const img = dialog.querySelector("img");
    const caption = dialog.querySelector(".lightbox-caption");

    triggers.forEach((btn) =>
      btn.addEventListener("click", () => {
        const thumb = btn.querySelector("img");
        img.src = thumb.currentSrc || thumb.src;
        img.alt = thumb.alt;
        caption.textContent = btn.dataset.lightboxCaption || "";
        dialog.showModal();
      })
    );
    dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    // Clicking the backdrop (the dialog box itself, not its content) closes it.
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".photo-stack.is-gallery").forEach(initPhotoStack);
    document.querySelectorAll(".news-toggle").forEach(initNews);
    document.querySelectorAll(".card-toggle").forEach(initCardToggle);
    document.querySelectorAll(".copy-bibtex").forEach(initCopy);
    initLightbox(Array.from(document.querySelectorAll("button.card-image")));
  });
})();
