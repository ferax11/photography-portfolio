document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  body.classList.remove("opacity-0");
  body.classList.add("opacity-100");

  const photos = document.querySelectorAll("img");
  const revealItems = document.querySelectorAll(
    ".editorial-about, .home-process, .faq-section, .social-footer, .contact-panel, .contact-form-section, .about-section, .portfolio-toolbar"
  );

  revealItems.forEach((item) => item.classList.add("reveal-item"));

  if (!("IntersectionObserver" in window)) {
    photos.forEach((photo) => {
      photo.classList.remove("opacity-0");
      photo.classList.add("opacity-100");
    });
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("opacity-100");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px 120px",
      threshold: 0.12,
    }
  );

  photos.forEach((photo) => imageObserver.observe(photo));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px 80px",
      threshold: 0.08,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
});
