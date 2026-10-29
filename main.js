// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const menuOverlay = document.querySelector('.menu-overlay');
const body = document.body;

function toggleMenu() {
  const isExpanded = burger.getAttribute('aria-expanded') === 'true';
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', !isExpanded);
  menuOverlay.hidden = isExpanded;
  
  if (!isExpanded) {
    body.classList.add('menu-open');
  } else {
    body.classList.remove('menu-open');
  }
}

burger.addEventListener('click', toggleMenu);

// Close menu on overlay click
menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    toggleMenu();
  }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menuOverlay.hidden) {
    toggleMenu();
  }
});

// Close menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    if (!menuOverlay.hidden) {
      toggleMenu();
    }
  });
});

// Close menu on resize > 720px
window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && !menuOverlay.hidden) {
    toggleMenu();
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Number Counting Animation
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateValue(element, start, end, duration, decimals, suffix) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = start + (end - start) * eased;
    
    element.textContent = current.toFixed(decimals) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end.toFixed(decimals) + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

// Intersection Observer for stats
const observerOptions = {
  threshold: 0.25,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statItem = entry.target;
      const countElement = statItem.querySelector('.count');
      const suffixElement = statItem.querySelector('.suffix');
      const target = parseFloat(statItem.dataset.target);
      const suffix = statItem.dataset.suffix;
      const decimals = parseInt(statItem.dataset.decimals);
      const index = Array.from(statItem.parentElement.children).indexOf(statItem);
      
      const delay = 480 + index * 90;
      const duration = 1500 + index * 80;
      
      setTimeout(() => {
        animateValue(countElement, 0, target, duration, decimals, '');
        suffixElement.textContent = suffix;
      }, delay);
      
      observer.unobserve(statItem);
    }
  });
}, observerOptions);

// Observe all stat items
document.querySelectorAll('.stat-item').forEach(stat => {
  observer.observe(stat);
});

// Prevent body scroll when menu is open
const style = document.createElement('style');
style.textContent = `
  body.menu-open {
    overflow: hidden;
  }
`;
document.head.appendChild(style);
