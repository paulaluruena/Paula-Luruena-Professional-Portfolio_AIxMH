document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = '+';
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  menuButton.querySelector('span').textContent = open ? '−' : '+';
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
const experiences = [...document.querySelectorAll('.experience-item')];
const expandButton = document.querySelector('.expand-all');
function updateExpandButton() {
  expandButton.textContent = experiences.every(item => item.open) ? 'Collapse all experiences' : 'Expand all experiences';
}
expandButton.hidden = false;
expandButton.addEventListener('click', () => {
  const shouldOpen = !experiences.every(item => item.open);
  experiences.forEach(item => { item.open = shouldOpen; });
  updateExpandButton();
});
experiences.forEach(item => item.addEventListener('toggle', updateExpandButton));
function revealLinkedExperience() {
  const item = experiences.find(item => `#${item.id}` === window.location.hash);
  if (item) item.open = true;
}
window.addEventListener('hashchange', revealLinkedExperience);
revealLinkedExperience();
const progress = document.querySelector('.reading-progress');
const sectionLinks = [...navigation.querySelectorAll('a')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
let scrollQueued = false;
function updateReadingPosition() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
  let active = -1;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= 180) active = index;
  });
  sectionLinks.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
function queueReadingPosition() {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateReadingPosition); }
}
window.addEventListener('scroll', queueReadingPosition, { passive: true });
window.addEventListener('resize', queueReadingPosition);
experiences.forEach(item => item.addEventListener('toggle', queueReadingPosition));
window.addEventListener('load', queueReadingPosition);
updateReadingPosition();
document.getElementById('year').textContent = new Date().getFullYear();
