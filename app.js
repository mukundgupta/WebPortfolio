const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

const rightSideHidden = document.querySelectorAll('.hidden-r');
rightSideHidden.forEach((el) => observer.observe(el));

const fadeIn = document.querySelectorAll('.fade-in');
fadeIn.forEach((el) => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
  const menuButtonOuter = document.querySelector('.menu-btn-outer');
  const menu = document.getElementById('menu');
  const overlay = document.getElementById('overlay');

  menuButtonOuter.addEventListener('click', () => {
    menuButtonOuter.classList.toggle('activated');
    menu.classList.toggle('show');
    overlay.classList.toggle('show');
  });

  overlay.addEventListener('click', () => {
    menuButtonOuter.classList.remove('activated');
    menu.classList.remove('show');
    overlay.classList.remove('show');
  });
});