/* =========================
   CONFIGURAÇÕES (edite aqui)
   ========================= */
// Troque pelo WhatsApp de vocês no formato: 55 + DDD + número (sem espaços)
const WHATS_NUMBER = "5551994450883"; // exemplo do seu histórico
const WHATS_DEFAULT_MSG = "Olá! Vim pelo site demonstrativo e quero um orçamento. 😊";

/* =========================
   HELPERS
   ========================= */
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }

function openWhats(message) {
  const text = encodeURIComponent(message);
  const url = `https://wa.me/${WHATS_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener");
}

function showToast(text) {
  const toast = qs("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* =========================
   MENU MOBILE
   ========================= */
const navToggle = qs("#navToggle");
const navList = qs("#navList");

navToggle?.addEventListener("click", () => {
  navList.classList.toggle("open");
});

qsa('.nav__list a').forEach(a => {
  a.addEventListener("click", () => navList.classList.remove("open"));
});

/* =========================
   FECHAR TOPBAR
   ========================= */
qs("#closeTopbar")?.addEventListener("click", () => {
  qs(".topbar").style.display = "none";
  // ajusta o header para não ficar "pulando" (opcional)
  qs(".header").style.top = "0px";
});

/* =========================
   TEMA CLARO/ESCURO
   ========================= */
const themeBtn = qs("#themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  showToast("Tema alterado ✅");
});

/* =========================
   MODAL
   ========================= */
const modal = qs("#modal");
const openShowcase = qs("#openShowcase");
const closeModal = qs("#closeModal");
const closeModal2 = qs("#closeModal2");
const modalOverlay = qs("#modalOverlay");

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function hideModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

openShowcase?.addEventListener("click", openModal);
closeModal?.addEventListener("click", hideModal);
closeModal2?.addEventListener("click", hideModal);
modalOverlay?.addEventListener("click", hideModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideModal();
});

/* =========================
   ANO AUTOMÁTICO NO FOOTER
   ========================= */
qs("#year").textContent = new Date().getFullYear();

/* =========================
   REVEAL AO ROLAR (animação)
   ========================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) ent.target.classList.add("show");
  });
}, { threshold: 0.12 });

qsa(".reveal").forEach(el => observer.observe(el));

/* =========================
   CONTADORES (números subindo)
   ========================= */
function animateCounters() {
  qsa("[data-count]").forEach(el => {
    const finalVal = Number(el.getAttribute("data-count"));
    let current = 0;
    const step = Math.max(1, Math.floor(finalVal / 40));

    const timer = setInterval(() => {
      current += step;
      if (current >= finalVal) {
        current = finalVal;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  });
}
// dispara depois de 700ms pra ficar “bonitinho”
setTimeout(animateCounters, 700);

/* =========================
   BUSCA & FILTRO (cards demo)
   ========================= */
const searchInput = qs("#searchInput");
const categorySelect = qs("#categorySelect");
const demoCards = qsa(".demoCard");

function applyFilters() {
  const term = (searchInput.value || "").toLowerCase().trim();
  const cat = categorySelect.value;

  demoCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const cardCat = card.getAttribute("data-category");

    const matchesText = term === "" || text.includes(term);
    const matchesCat = cat === "all" || cardCat === cat;

    card.style.display = (matchesText && matchesCat) ? "block" : "none";
  });
}

searchInput?.addEventListener("input", applyFilters);
categorySelect?.addEventListener("change", applyFilters);

/* =========================
   DEPOIMENTOS (carrossel)
   ========================= */
const testimonials = [
  { text: "“Atendimento rápido e site ficou lindo no celular!”", name: "Cliente A", role: "Negócio Local" },
  { text: "“O botão do WhatsApp aumentou os pedidos no mesmo dia.”", name: "Cliente B", role: "Prestador de Serviço" },
  { text: "“Ficou moderno, rápido e fácil de entender.”", name: "Cliente C", role: "Empreendedor" },
  { text: "“Gostei que explicam tudo certinho, sem complicar.”", name: "Cliente D", role: "Autônomo" },
];

let tIndex = 0;
const tText = qs("#tText");
const tName = qs("#tName");
const tRole = qs("#tRole");

function renderTestimonial() {
  const t = testimonials[tIndex];
  tText.textContent = t.text;
  tName.innerHTML = `<b>${t.name}</b>`;
  tRole.textContent = t.role;
}

qs("#prevT")?.addEventListener("click", () => {
  tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonial();
});

qs("#nextT")?.addEventListener("click", () => {
  tIndex = (tIndex + 1) % testimonials.length;
  renderTestimonial();
});

/* =========================
   COPIAR TEXTO
   ========================= */
qs("#copyBtn")?.addEventListener("click", async () => {
  const value = qs("#copyTarget").value;
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copiado ✅");
  } catch (err) {
    showToast("Não consegui copiar 😕 (seu navegador bloqueou)");
  }
});

/* =========================
   FORMULÁRIO -> WHATSAPP
   ========================= */
const contactForm = qs("#contactForm");
const clearForm = qs("#clearForm");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = qs("#name").value.trim();
  const phone = qs("#phone").value.trim();
  const need = qs("#need").value.trim();
  const message = qs("#message").value.trim();

  // validação simples (serve pra evitar lead vazio)
  if (!name || !phone || !need || !message) {
    showToast("Preencha tudo antes de enviar 👀");
    return;
  }

  const finalMessage =
`Olá! Vim pelo site demonstrativo.
• Nome: ${name}
• Whats: ${phone}
• Preciso de: ${need}
• Mensagem: ${message}`;

  openWhats(finalMessage);
  showToast("Abrindo WhatsApp… ✅");
});

clearForm?.addEventListener("click", () => {
  contactForm.reset();
  showToast("Formulário limpo ✅");
});

/* =========================
   BOTÕES WHATS (rápidos + flutuante)
   ========================= */
function setWhatsLinks() {
  const msg = encodeURIComponent(WHATS_DEFAULT_MSG);
  const url = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
  qs("#whatsBtn").href = url;
  qs("#floatWhats").href = url;
}
setWhatsLinks();

/* =========================
   BOTÃO DE TOAST
   ========================= */
qs("#toastBtn")?.addEventListener("click", () => {
  showToast("Exemplo de aviso: promoção, cupom, novidade…");
});

