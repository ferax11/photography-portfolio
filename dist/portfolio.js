const siteConfig = {
  whatsappNumber: "50379051536",
  whatsappMessage: "Hola Fernando, quiero cotizar una sesión fotográfica.",
  quoteFormUrl: "https://tally.so/r/eqMNNl",
  email: "luisalfaro0110@gmail.com",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/ferax_sv/", external: true },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61587152510380", external: true },
    {
      label: "Correo",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=luisalfaro0110@gmail.com&su=Cotizaci%C3%B3n%20fotogr%C3%A1fica",
      external: true,
    },
  ],
};

const grid = document.querySelector("#portfolioGrid");
const filters = document.querySelector("#categoryFilters");
const imageSizeControl = document.querySelector("#imageSizeControl");
const loadMoreButton = document.querySelector("#loadMoreButton");
const galleryCount = document.querySelector("#galleryCount");
const aboutGallery = document.querySelector("#aboutGallery");
const categoryList = document.querySelector("#categoryList");
const menuButton = document.querySelector("#menuButton");
const mainMenu = document.querySelector("#mainMenu");
const socialLinks = document.querySelector("#socialLinks");
const socialFooterLinks = document.querySelector("#socialFooterLinks");
const whatsappLink = document.querySelector("#whatsappLink");
const quoteFormLink = document.querySelector("#quoteFormLink");
const quoteTopLink = document.querySelector("#quoteTopLink");
const quoteStripLink = document.querySelector("#quoteStripLink");
const homeWhatsappLink = document.querySelector("#homeWhatsappLink");
const heroQuoteLink = document.querySelector("#heroQuoteLink");
const portfolioIntro = document.querySelector("#portfolioIntro");
const serviceSliders = document.querySelectorAll(".service-image[data-gallery]");

const PAGE_SIZE = 12;
const IMAGE_SIZE_KEY = "portfolioImageSize";
const params = new URLSearchParams(window.location.search);
const categories = ["Todo", ...Object.keys(categoryFolders)];
let activeCategory = params.get("category") || "Todo";
if (!categories.includes(activeCategory)) activeCategory = "Todo";
let visibleCount = PAGE_SIZE;
let isAutoLoading = false;
const mixedItemsByCategory = new Map();

const categoryLabels = {
  Todo: "Todo",
  Gastronomica: "Gastronomía",
  Bebidas: "Bebidas",
  Producto: "Producto",
  Retrato: "Retrato",
  Inmobiliaria: "Inmobiliaria",
};

const categoryDescriptions = {
  Gastronomica: "Fotografía de alimentos, bebidas y experiencia de consumo.",
  Bebidas: "Fotografía de cócteles, bebidas y producto gastronómico.",
  Producto: "Imágenes para catálogo, campañas, redes sociales y marca.",
  Retrato: "Retratos limpios con dirección, carácter y presencia.",
  Inmobiliaria: "Espacios, interiores y arquitectura listos para vender o reservar.",
};

const categoryDetails = {
  Todo: {
    label: "Portafolio",
    title: "Aquí puedes ver un poco de mi trabajo de fotografía.",
    text: "Una selección para escanear rápido mi forma de trabajar: color, composición, detalle y dirección visual para marcas, comida, producto, retrato e interiores.",
    image: "dist/assets/portfolio/sobre-mi/fernando-alfaro/dsc07383.jpg",
    meta: "Fotografía comercial / El Salvador",
  },
  Gastronomica: {
    label: "Gastronomía",
    title: "Imágenes que hacen que el producto se antoje.",
    text: "Fotografía para comida y bebida: textura, frescura, manos, detalle y composición. Ideal para restaurantes, menús, redes sociales, campañas y marcas gastronómicas.",
    image: "dist/assets/portfolio/gastronomia/kreef-variado/dsc00598.jpg",
    meta: "Dominos Pizza / Olor de mar / Kreef",
  },
  Bebidas: {
    label: "Bebidas",
    title: "Bebidas frescas, antojables y con personalidad.",
    text: "Fotografía para cócteles, bebidas preparadas y marcas gastronómicas que necesitan mostrar color, textura, hielo, frescura y detalle.",
    image: "dist/assets/portfolio/bebidas/bebidas/DSC03080.JPG",
    meta: "Bebidas / Cócteles / Producto líquido",
  },
  Producto: {
    label: "Producto",
    title: "Detalle, color y precisión para marcas.",
    text: "Fotos de producto para presentar piezas con limpieza visual: catálogos, campañas, lanzamientos, redes sociales y contenido comercial con una estética cuidada.",
    image: "dist/assets/portfolio/producto/Varias/DSC05100-Mejorado-NR 2.jpg",
    meta: "Producto variado / E-commerce / Brilla Gifts",
  },
  Retrato: {
    label: "Retrato",
    title: "Retratos que transmiten presencia y confianza.",
    text: "Dirección sencilla, luz limpia y composición cuidada para retratos profesionales, editoriales o personales. La idea es que la persona se vea natural, clara y segura.",
    image: "dist/assets/portfolio/retrato/retratos/retratos-996.jpg",
    meta: "Retrato profesional / Marca personal",
  },
  Inmobiliaria: {
    label: "Inmobiliaria",
    title: "Espacios claros para vender, rentar o reservar.",
    text: "Fotografía para apartamentos, Airbnb, arquitectura e interiores. Muestro la amplitud, distribución, luz y detalles que hacen que un lugar se entienda mejor.",
    image: "dist/assets/portfolio/inmobiliaria/urbanica/dsc01890-mejorado-nr.jpg",
    meta: "Urbanica / Airbnb / Interiores",
  },
};

const portfolioIntroHighlights = [
  {
    image: "dist/assets/portfolio/gastronomia/kreef-variado/dsc00598.jpg",
    label: "Gastronomía",
    category: "Gastronomica",
  },
  {
    image: "dist/assets/portfolio/producto/Varias/DSC05100-Mejorado-NR 2.jpg",
    label: "Producto",
    category: "Producto",
  },
  {
    image: "dist/assets/portfolio/bebidas/bebidas/DSC03080.JPG",
    label: "Bebidas",
    category: "Bebidas",
  },
  {
    image: "dist/assets/portfolio/inmobiliaria/urbanica/dsc01890-mejorado-nr.jpg",
    label: "Interiores",
    category: "Inmobiliaria",
  },
];

function categoryLabel(category) {
  return categoryLabels[category] || category;
}

function optimizedPath(filePath) {
  if (filePath.includes("dist/assets/images/")) {
    return filePath
      .replace("dist/assets/images/", "dist/assets/optimized/images/")
      .replace(/\.[^.]+$/, ".jpg");
  }

  return filePath;
}

function socialAnchor(social) {
  const target = social.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a href="${social.url}"${target} aria-label="${social.label} de Fernando Alfaro">${social.label}</a>`;
}

function renderPortfolioIntro() {
  if (!portfolioIntro) return;

  const details = categoryDetails[activeCategory] || categoryDetails.Todo;
  portfolioIntro.className = activeCategory === "Todo" ? "portfolio-intro portfolio-intro-featured" : "portfolio-intro";

  if (activeCategory === "Todo") {
    portfolioIntro.innerHTML = `
      <div class="portfolio-intro-copy">
        <p class="small-label">${details.label}</p>
        <h1>${details.title}</h1>
        <p>${details.text}</p>
        <div class="portfolio-intro-actions">
          <a class="outline-button" href="#portfolioGrid">Ver galería</a>
          <a class="text-link" href="contacto.html">Cotizar proyecto</a>
        </div>
        <span>${details.meta}</span>
      </div>
      <div class="portfolio-intro-collage" aria-label="Muestra de fotografía de Fernando Alfaro">
        ${portfolioIntroHighlights
          .map(
            (item, index) => `
              <a href="portfolio.html?category=${encodeURIComponent(item.category)}" data-intro-category="${item.category}" class="portfolio-intro-tile tile-${index + 1}">
                <img src="${optimizedPath(item.image)}" alt="${item.label} de Fernando Alfaro" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />
                <span>${item.label}</span>
              </a>
            `
          )
          .join("")}
      </div>
    `;

    return;
  }

  portfolioIntro.innerHTML = `
    <figure class="portfolio-intro-image">
      <img src="${optimizedPath(details.image)}" alt="${details.label} de Fernando Alfaro" decoding="async" />
    </figure>
    <div class="portfolio-intro-copy">
      <p class="small-label">${details.label}</p>
      <h1>${details.title}</h1>
      <p>${details.text}</p>
      <span>${details.meta}</span>
    </div>
  `;
}

function getAllItems() {
  const items = Object.entries(categoryFolders).flatMap(([category, images]) =>
    images.map((image) => ({
      category,
      image,
      place: categoryLabel(category),
      title: categoryLabel(category),
    }))
  );
  return items.map((item, index) => ({ ...item, sortKey: (index * 37) % (items.length + 1) }));
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function getProjectKey(item) {
  const parts = item.image.split("/");
  return parts.length > 2 ? parts[parts.length - 2] : item.category;
}

function mixItemsByProject(items) {
  const groups = items.reduce((projectGroups, item) => {
    const projectKey = getProjectKey(item);
    if (!projectGroups.has(projectKey)) projectGroups.set(projectKey, []);
    projectGroups.get(projectKey).push(item);
    return projectGroups;
  }, new Map());

  const shuffledGroups = shuffleItems([...groups.values()]).map((group) => shuffleItems(group));
  const mixed = [];
  let hasItems = true;

  while (hasItems) {
    hasItems = false;
    shuffleItems(shuffledGroups).forEach((group) => {
      const nextItem = group.shift();
      if (nextItem) {
        mixed.push(nextItem);
        hasItems = true;
      }
    });
  }

  return mixed;
}

function getFilteredItems() {
  const filtered = getAllItems().filter((item) => {
    return activeCategory === "Todo" || item.category === activeCategory;
  });
  if (activeCategory === "Todo") {
    return filtered.sort((a, b) => a.sortKey - b.sortKey);
  }
  if (!mixedItemsByCategory.has(activeCategory)) {
    mixedItemsByCategory.set(activeCategory, mixItemsByProject(filtered));
  }
  return mixedItemsByCategory.get(activeCategory);
}

function updateUrl() {
  const next = new URLSearchParams();
  if (activeCategory !== "Todo") next.set("category", activeCategory);
  const query = next.toString();
  window.history.replaceState({}, "", query ? `portfolio.html?${query}` : "portfolio.html");
}

function syncFilterState({ scrollActive = false } = {}) {
  filters?.querySelectorAll(".filter-button").forEach((item) => {
    const isActive = item.dataset.category === activeCategory;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", isActive.toString());
    if (isActive && scrollActive) item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
}

function scrollToGallery() {
  const portfolioSection = document.querySelector(".portfolio-section");
  if (!portfolioSection) return;

  const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
  const targetTop = portfolioSection.getBoundingClientRect().top + window.scrollY - headerOffset - 14;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
}

function replaySoftRefresh(element) {
  if (!element) return;
  element.classList.remove("is-soft-refresh");
  void element.offsetWidth;
  element.classList.add("is-soft-refresh");
  window.setTimeout(() => element.classList.remove("is-soft-refresh"), 340);
}

function refreshPortfolioView({ shouldScroll = false } = {}) {
  renderPortfolioIntro();
  renderPortfolio();
  syncFilterState({ scrollActive: shouldScroll });
  replaySoftRefresh(portfolioIntro);
  replaySoftRefresh(grid);
  if (shouldScroll) window.setTimeout(scrollToGallery, 80);
}

function setActiveCategory(category, options = {}) {
  if (!categories.includes(category)) return;
  const isSameCategory = activeCategory === category;
  activeCategory = category;
  visibleCount = PAGE_SIZE;
  updateUrl();

  if (isSameCategory) {
    syncFilterState({ scrollActive: options.shouldScroll });
    if (options.shouldScroll) scrollToGallery();
    return;
  }

  refreshPortfolioView(options);
}

function renderPortfolio() {
  if (!grid) return;

  const items = getFilteredItems();
  const visibleItems = items.slice(0, visibleCount);

  grid.innerHTML = visibleItems
    .map((item, index) => `
      <a class="portfolio-card" href="${optimizedPath(item.image)}" data-fancybox="portfolio" data-caption="${categoryLabel(item.category)}">
        <img src="${optimizedPath(item.image)}" alt="${categoryLabel(item.category)} de Fernando Alfaro" loading="lazy" decoding="async" />
      </a>
    `)
    .join("");

  if (galleryCount) {
    galleryCount.textContent = `Mostrando ${visibleItems.length} de ${items.length} fotos`;
  }

  if (loadMoreButton) {
    loadMoreButton.hidden = visibleItems.length >= items.length;
  }

  if (window.Fancybox) Fancybox.bind("[data-fancybox='portfolio']", {});
}

function setupImageSizeControl() {
  if (!imageSizeControl) return;

  const savedSize = window.localStorage?.getItem(IMAGE_SIZE_KEY);
  const initialSize = savedSize || imageSizeControl.value;
  imageSizeControl.value = initialSize;
  document.documentElement.style.setProperty("--portfolio-image-size", `${initialSize}px`);

  imageSizeControl.addEventListener("input", () => {
    document.documentElement.style.setProperty("--portfolio-image-size", `${imageSizeControl.value}px`);
    window.localStorage?.setItem(IMAGE_SIZE_KEY, imageSizeControl.value);
  });
}

function renderFilters() {
  if (!filters) return;

  filters.innerHTML = categories
    .map((category) => `<button class="filter-button" type="button" data-category="${category}" aria-pressed="false">${categoryLabel(category)}</button>`)
    .join("");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    setActiveCategory(button.dataset.category);
  });

  syncFilterState();
}

function setupLoadMore() {
  loadMoreButton?.addEventListener("click", () => {
    loadNextPage();
  });
}

function loadNextPage() {
  if (!grid || isAutoLoading) return;

  const items = getFilteredItems();
  if (visibleCount >= items.length) return;

  isAutoLoading = true;
  loadMoreButton?.classList.add("is-loading");
  visibleCount += PAGE_SIZE;

  window.setTimeout(() => {
    renderPortfolio();
    loadMoreButton?.classList.remove("is-loading");
    isAutoLoading = false;
  }, 120);
}

function setupPortfolioIntroLinks() {
  portfolioIntro?.addEventListener("click", (event) => {
    const categoryLink = event.target.closest("[data-intro-category]");
    if (categoryLink) {
      event.preventDefault();
      setActiveCategory(categoryLink.dataset.introCategory, { shouldScroll: true });
      return;
    }

    const galleryLink = event.target.closest('a[href="#portfolioGrid"]');
    if (!galleryLink) return;

    event.preventDefault();
    scrollToGallery();
  });
}

function setupCategoryLinks() {
  document.querySelectorAll("[data-filter-link]").forEach((link) => {
    link.addEventListener("click", () => {
      window.location.href = `portfolio.html?category=${encodeURIComponent(link.dataset.filterLink)}`;
    });
  });
}

function renderCategoryList() {
  if (!categoryList) return;

  categoryList.innerHTML = Object.keys(categoryFolders)
    .map((category) => {
      return `
        <a class="category-card" href="portfolio.html?category=${encodeURIComponent(category)}">
          <i></i>
          <h2>${categoryLabel(category)}</h2>
          <strong>${categoryFolders[category].length} fotos</strong>
          <p>${categoryDescriptions[category]}</p>
        </a>
      `;
    })
    .join("");
}

function renderAboutGallery() {
  if (!aboutGallery) return;

  aboutGallery.innerHTML = aboutImages
    .map((image, index) => `
      <a href="${image}" data-fancybox="about" data-caption="Sobre mí ${index + 1}">
        <img src="${optimizedPath(image)}" alt="Fernando Alfaro trabajando ${index + 1}" loading="lazy" decoding="async" />
      </a>
    `)
    .join("");

  if (window.Fancybox) Fancybox.bind("[data-fancybox='about']", {});
}

function setupMenu() {
  menuButton?.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen.toString());
  });
}

function setupContactLinks() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  if (whatsappLink) whatsappLink.href = whatsappUrl;
  if (homeWhatsappLink) homeWhatsappLink.href = whatsappUrl;
  if (quoteFormLink) quoteFormLink.href = siteConfig.quoteFormUrl;
  if (quoteTopLink) quoteTopLink.href = siteConfig.quoteFormUrl;
  if (quoteStripLink) quoteStripLink.href = siteConfig.quoteFormUrl;
  if (heroQuoteLink) heroQuoteLink.href = siteConfig.quoteFormUrl;

  if (socialLinks) {
    socialLinks.innerHTML = siteConfig.socials.map(socialAnchor).join("");
  }

  if (socialFooterLinks) {
    socialFooterLinks.innerHTML = [
      ...siteConfig.socials,
      { label: "WhatsApp", url: whatsappUrl, external: true },
    ].map(socialAnchor).join("");
  }
}

function setupServiceSliders() {
  serviceSliders.forEach((slider, sliderIndex) => {
    const image = slider.querySelector("img");
    const gallery = slider.dataset.gallery?.split("|").filter(Boolean) || [];
    if (!image || gallery.length < 2) return;

    let activeIndex = Math.max(0, gallery.indexOf(image.getAttribute("src")));
    let intervalId;

    const showImage = (direction) => {
      activeIndex = (activeIndex + direction + gallery.length) % gallery.length;
      image.style.opacity = "0";
      window.setTimeout(() => {
        image.src = gallery[activeIndex];
        image.style.opacity = "1";
      }, 140);
    };

    const restartAutoplay = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => showImage(1), 10000);
    };

    slider.querySelector(".previous")?.addEventListener("click", () => {
      showImage(-1);
      restartAutoplay();
    });

    slider.querySelector(".next")?.addEventListener("click", () => {
      showImage(1);
      restartAutoplay();
    });

    image.style.transition = "opacity 220ms ease, transform 700ms var(--ease)";
    restartAutoplay();
  });
}

renderFilters();
renderPortfolioIntro();
renderPortfolio();
renderCategoryList();
renderAboutGallery();
setupImageSizeControl();
setupLoadMore();
setupPortfolioIntroLinks();
setupCategoryLinks();
setupMenu();
setupContactLinks();
setupServiceSliders();
