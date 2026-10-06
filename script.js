gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector(".hero");
const visual = document.querySelector(".visual-wrap");
const car = document.querySelector(".car");
const progress = document.querySelector("#progress");

// Intro animation: staggered reveal on page load.
const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

intro
  .to(".hero-title .title-line", {
    y: 0,
    opacity: 1,
    duration: 1.05,
    stagger: 0.12
  })
  .to(".reveal", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1
  }, "-=0.55");

// Statistics count up once after the hero loads.
document.querySelectorAll("[data-count]").forEach((element, index) => {
  const target = Number(element.dataset.count);

  gsap.to(element, {
    innerText: target,
    duration: 1.1,
    delay: 0.8 + index * 0.18,
    ease: "power2.out",
    snap: { innerText: 1 },
    onUpdate: () => {
      element.textContent = Math.round(Number(element.innerText));
    }
  });
});

// Core requirement: visual motion is tied to scroll progress.
// scrub creates interpolation, while transform properties keep the animation smooth.
const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: hero,
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2,
    onUpdate: self => {
      progress.style.transform = `scaleX(${self.progress})`;
    }
  }
});

scrollTimeline
  .to(visual, {
    xPercent: -15,
    yPercent: -12,
    scale: 0.72,
    rotate: -5,
    ease: "none",
    duration: 0.35
  })
  .to(visual, {
    xPercent: 19,
    yPercent: 5,
    scale: 0.52,
    rotate: 7,
    ease: "none",
    duration: 0.3
  })
  .to(visual, {
    xPercent: 0,
    yPercent: -18,
    scale: 0.42,
    rotate: 0,
    ease: "none",
    duration: 0.35
  });

// Small independent parallax for the grid; it is also scrubbed to scroll.
gsap.to(".hero-bg-grid", {
  yPercent: -18,
  ease: "none",
  scrollTrigger: {
    trigger: hero,
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  }
});

// Respect users who prefer reduced motion.
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.set(".reveal, .hero-title .title-line", { opacity: 1, y: 0 });
  gsap.set(visual, { clearProps: "all" });
}
