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
    // mainHeading.style.opacity = '0'; // Hide the heading
    
    // mainHeading.style.transition = 'opacity 0.7s ease'; // Smooth transition

    mainHeading.classList.remove('show'); // Remove fade-in class
  } else {
    mainHeading.style.opacity = '1'; // Show the heading
    mainHeading.classList.add('show'); // Remove fade-in class
  }


  const hello = document.querySelector('.fade-about');
  const about = document.querySelector('.about-text');
  const scroll = document.querySelector('#scroll');
  const about_section = document.querySelector('.about');
    // Adjust the opacity based on scroll position
    if (scrollPosition > 200) {
      hello.style.opacity = '1'; // Hide the heading
      hello.style.transition = 'opacity 0.7s ease'; // Smooth transition

      about.style.opacity = '1'; // Hide the heading
      about.style.transition = 'opacity 0.7s ease'; // Smooth transition
      
      scroll.style.opacity = '0'; // Hide scroll call
      scroll.style.transition = 'opacity 0.7s ease';

      about_section.style.pointerEvents = 'auto'; // Enable pointer events for the about section
    } else {
      hello.style.opacity = '0'; // Hide

      about.style.opacity = '0'; 

      scroll.style.opacity = '1'; //show scroll call

      about_section.style.pointerEvents = 'none'; // Disable pointer events for the about section
    }


});



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




document.addEventListener("DOMContentLoaded", () => {
  const videoItems = document.querySelectorAll(".video-item");
  const videoModal = document.getElementById("videoModal");
  const videoIframe = document.getElementById("videoIframe");
  const closeModal = document.getElementById("closeModal");

  // Function to open the modal and set the video URL
  videoItems.forEach((item) => {
    item.addEventListener("click", () => {
      const videoUrl = item.getAttribute("data-video-url"); // Get video URL from data attribute
      videoIframe.src = videoUrl + "?autoplay=1"; // Add autoplay parameter
      videoModal.classList.add("show"); // Show the modal
    });
  });

  // Function to close the modal
  closeModal.addEventListener("click", () => {
    videoModal.classList.remove("show"); // Hide the modal
    videoIframe.src = ""; // Stop the video
  });

  // Close the modal when clicking outside the content
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove("show");
      videoIframe.src = "";
    }
  });
});