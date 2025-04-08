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

const fadeIn = document.querySelectorAll('.fade-in');
fadeIn.forEach((el) => observer.observe(el));


document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
  
    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };
  
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });
  
    move();
  });

// Hide #mainHeading on scroll
window.addEventListener('scroll', () => {
  const mainHeading = document.getElementById('mainHeading');
  const scrollPosition = window.scrollY;

  // Adjust the opacity based on scroll position
  if (scrollPosition > 200) {
    mainHeading.style.opacity = '0'; // Hide the heading
    mainHeading.style.transition = 'opacity 0.7s ease'; // Smooth transition
  } else {
    mainHeading.style.opacity = '1'; // Show the heading
  }


  const hello = document.querySelector('.fade-about');
  const about = document.querySelector('.about-text');
  const scroll = document.querySelector('#scroll');
    // Adjust the opacity based on scroll position
    if (scrollPosition > 190) {
      hello.style.opacity = '1'; // Hide the heading
      hello.style.transition = 'opacity 0.7s ease'; // Smooth transition

      about.style.opacity = '1'; // Hide the heading
      about.style.transition = 'opacity 0.7s ease'; // Smooth transition
      
      scroll.style.opacity = '0'; // Hide scroll call
      scroll.style.transition = 'opacity 0.7s ease';
    } else {
      hello.style.opacity = '0'; // Hide

      about.style.opacity = '0'; 

      scroll.style.opacity = '1'; //show scroll call
    }


});





