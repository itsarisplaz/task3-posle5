const products = [
  ['Daily Antistress Candle', 'белый чай / бергамот / хлопок', '250 мл', '001', 'assets/catalog-001.png'],
  ['Hotter Than Your Ex', 'чёрный перец / янтарь / кожа', '250 мл', '002', 'assets/catalog-002.png'],
  ['Coffee Table Candle', 'кофе / молоко / сухое дерево', '250 мл', '003', 'assets/catalog-003.png'],
  ['I Love Sudoku And Candles', 'вишня / тёмный шоколад / специи', '250 мл', '004', 'assets/catalog-004.png'],
  ['Candle For Creative Process', 'бумага / белый мускус / чёрный чай', '250 мл', '005', 'assets/catalog-005.png'],
  ['Autumn in New York', 'амбра / кашемир / мокрые листья', '250 мл', '006', 'assets/catalog-006.png']
];

const modal = document.querySelector('.product-modal');
const modalVolumeChoice = document.querySelector('#modal-volume-choice');
let activeTrigger = null;
const productGrid = document.querySelector('.product-grid');
if (productGrid && !productGrid.querySelector('.product-card')) {
  productGrid.innerHTML = '<p class="empty-state">Сейчас в архиве нет доступных ароматов.</p>';
}
const volumeDetails = {
  '160 мл': { price: '1 290 ₽', burn: 'до 25 часов' },
  '200 мл': { price: '1 590 ₽', burn: 'до 35 часов' },
  '250 мл': { price: '1 890 ₽', burn: 'до 45 часов' }
};
const updateModalVolume = (volume) => {
  const details = volumeDetails[volume] || volumeDetails['250 мл'];
  document.querySelector('#modal-volume').textContent = volume;
  document.querySelector('#modal-price').textContent = details.price;
  document.querySelector('#modal-burn').textContent = details.burn;
};
const openProduct = (card) => {
    activeTrigger = card;
    const product = products[Number(card.dataset.product)];
    document.querySelector('#modal-title').textContent = product[0];
    document.querySelector('#modal-notes').textContent = product[1];
    modalVolumeChoice.value = product[2];
    updateModalVolume(product[2]);
    document.querySelector('#modal-index').textContent = `АРХИВ / ${product[3]}`;
    const modalImage = document.querySelector('#modal-image');
    modalImage.src = product[4];
    modalImage.alt = `Свеча ${product[0]}`;
    modal.showModal();
};
document.querySelectorAll('.product-card').forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openProduct(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProduct(card);
    }
  });
});

document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal.addEventListener('toggle', () => {
  document.body.classList.toggle('modal-open', modal.open);
});
modal.addEventListener('close', () => {
  activeTrigger?.focus();
  activeTrigger = null;
});
modalVolumeChoice.addEventListener('change', (event) => {
  updateModalVolume(event.target.value);
});
document.querySelector('.modal-order').addEventListener('click', () => {
  modal.close();
  document.querySelector('#contact').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  document.querySelector('[name=candle]').value = document.querySelector('#modal-title').textContent;
  document.querySelector('[name=volume]').value = modalVolumeChoice.value;
});

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    status.textContent = 'Проверьте имя, email, свечу, объём и согласие на обработку данных.';
    status.style.color = 'var(--wine)';
    form.reportValidity();
    return;
  }
  status.textContent = 'Заявка принята в демонстрационный архив. Спасибо.';
  status.style.color = 'var(--green)';
  form.reset();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" fill="%23ece8e2"/%3E%3Cpath d="M340 290h120M400 230v120" stroke="%236b0b0c" stroke-width="10"/%3E%3Ctext x="400" y="410" text-anchor="middle" fill="%236b0b0c" font-family="sans-serif" font-size="24"%3Eизображение недоступно%3C/text%3E%3C/svg%3E';
document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.dataset.fallback) return;
    image.dataset.fallback = 'true';
    image.src = fallbackImage;
    image.alt = 'Изображение временно недоступно';
    image.classList.add('image-error');
  });
});

const collabSection = document.querySelector('.collab-section');
const collabCards = [...document.querySelectorAll('.collab-card')];
const marqueeDivider = document.querySelector('.marquee-divider');
const introSection = document.querySelector('#story');
if (marqueeDivider && introSection) introSection.after(marqueeDivider);
const marqueeTrack = document.querySelector('.marquee-divider-track');
if (marqueeTrack) {
  const segment = marqueeTrack.innerHTML;
  marqueeTrack.innerHTML = Array.from({ length: 4 }, () => `<span class="marquee-set">${segment}</span>`).join('');
}
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
let collabFrame;
const updateCollab = () => {
  if (!collabSection || window.innerWidth <= 900 || reducedMotion) return;
  const rect = collabSection.getBoundingClientRect();
  const range = Math.max(collabSection.offsetHeight - window.innerHeight, 1);
  const progress = clamp(-rect.top / range, 0, 1);
  const cardHeight = Math.min(collabSection.querySelector('.collab-cards').clientHeight * .6875, 330);
  const gap = 30;
  const distance = (cardHeight + gap) * (collabCards.length - 1);
  collabCards.forEach((card, index) => {
    const y = index * (cardHeight + gap) - progress * distance;
    card.style.transform = `translate3d(0, ${y}px, 0)`;
    card.style.zIndex = String(index + 1);
  });
};
const requestCollabUpdate = () => {
  if (collabFrame) return;
  collabFrame = requestAnimationFrame(() => { collabFrame = null; updateCollab(); });
};
window.addEventListener('scroll', requestCollabUpdate, { passive: true });
window.addEventListener('resize', requestCollabUpdate);
updateCollab();
