// Header JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  // Check if we're on auth page
  const isAuthPage = window.location.pathname.includes('auth.html');
  
  // Apply auth-header class if on auth page
  if (isAuthPage) {
    header.classList.add('auth-header');
  }
  
  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Change menu icon
      mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    const isNavClick = event.target.closest('.nav-links') || event.target.closest('.mobile-menu-btn');
    
    if (!isNavClick && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
    }
  });
});