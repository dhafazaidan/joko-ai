// // Header scroll effect
// const header = document.querySelector('header');
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 50) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
// });

// // Mobile menu toggle
// const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
// const navLinks = document.querySelector('.nav-links');

// mobileMenuBtn.addEventListener('click', () => {
//     navLinks.classList.toggle('active');
// });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.getAttribute('href') !== '#') {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Testimonial slider
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

function showSlide(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialSlides[index].classList.add('active');
    sliderDots[index].classList.add('active');
    currentSlide = index;
}

sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto rotate testimonials
setInterval(() => {
    let nextSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(nextSlide);
}, 5000);

// Interactive chat demo
const chatInput = document.getElementById('chat-input');
const sendBtn = document.querySelector('.send-btn');
const chatMessages = document.querySelector('.chat-messages');

function addMessage(text, isUser = false) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? 'A' : 'J'}</div>
        <div>
            <div class="message-content">
                ${text}
            </div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleUserMessage() {
    const text = chatInput.value.trim();
    if (text === '') return;
    
    // Add user message
    addMessage(text, true);
    chatInput.value = '';
    
    // Simulate AI thinking
    setTimeout(() => {
        let response;
        
        // Simple responses based on keywords
        if (text.toLowerCase().includes('halo') || text.toLowerCase().includes('hai') || text.toLowerCase().includes('hi')) {
            response = "Halo! Senang bisa berbicara dengan Anda. Ada yang bisa JOKO bantu hari ini?";
        } else if (text.toLowerCase().includes('siapa') && text.toLowerCase().includes('kamu')) {
            response = "Saya JOKO, asisten AI yang dirancang untuk menjadi teman diskusi Anda. Saya dapat membantu Anda berdiskusi tentang berbagai topik.";
        } else if (text.toLowerCase().includes('terima kasih') || text.toLowerCase().includes('makasih')) {
            response = "Sama-sama! Senang bisa membantu. Ada hal lain yang ingin didiskusikan?";
        } else if (text.toLowerCase().includes('ai') || text.toLowerCase().includes('artificial intelligence')) {
            response = "AI atau Artificial Intelligence adalah bidang yang sangat menarik. Teknologi ini berkembang pesat dan membuka banyak kemungkinan baru. Aspek mana dari AI yang ingin Anda bahas lebih dalam?";
        } else if (text.toLowerCase().includes('fitur')) {
            response = "JOKO memiliki banyak fitur menarik seperti kemampuan diskusi interaktif, pengetahuan yang luas, respons cepat, dan dapat diakses kapan saja. Fitur apa yang ingin Anda ketahui lebih lanjut?";
        } else {
            response = "Terima kasih atas pesan Anda. Sebagai asisten AI, saya siap berdiskusi lebih lanjut tentang topik ini. Bisa tolong berikan detail lebih spesifik yang ingin Anda ketahui?";
        }
        
        // Add AI response
        addMessage(response);
    }, 1000);
}

sendBtn.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});

// Interactive features - animation on scroll
const featureCards = document.querySelectorAll('.feature-card');

function checkVisibility() {
    featureCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
        
        if (isVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state
featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Check on scroll and initial load
window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// Particle background effect for hero section
function createParticleBackground() {
    const hero = document.querySelector('.hero');
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-background';
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.overflow = 'hidden';
    particleContainer.style.zIndex = '0';
    
    hero.insertBefore(particleContainer, hero.firstChild);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(41, 98, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = 'floating ' + (Math.random() * 5 + 5) + 's infinite ease-in-out';
        
        particleContainer.appendChild(particle);
    }
    
    // Add keyframes for floating animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floating {
            0%, 100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px);
            }
        }
    `;
    document.head.appendChild(style);
}

createParticleBackground();

