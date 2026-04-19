const scroller = document.querySelector(".snap-pages");
const panels = [...document.querySelectorAll(".panel")];

function showCurrentPanel() {
  if (!scroller) return;

  const viewportMiddle = scroller.scrollTop + window.innerHeight / 2;
  let current = panels[0];

  for (const panel of panels) {
    if (panel.offsetTop <= viewportMiddle) {
      current = panel;
    }
  }

  document.body.dataset.panel = current.id || "top";
}

scroller?.addEventListener("scroll", showCurrentPanel, { passive: true });
showCurrentPanel();
