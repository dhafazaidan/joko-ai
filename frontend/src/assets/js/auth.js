// auth.js
export async function loginUser({ username, password }) {
  try {
    const res = await fetch("http://localhost/jokoai_backend/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // Include cookies untuk session
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // Session-based, tidak perlu simpan token di localStorage
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    return { success: false, message: "Login error: " + err.message };
  }
}

export async function registerUser({ username, password }) {
  try {
    const res = await fetch("http://localhost/jokoai_backend/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });


    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    return { success: false, message: "Registration error: " + err.message };
  }
}

export async function logoutUser() {
  try {
    const res = await fetch("http://localhost/jokoai_backend/api/logout", {
      method: "POST",
      credentials: 'include',
    });

    const data = await res.json();
    return { success: res.ok, message: data.message };
  } catch (err) {
    return { success: false, message: "Logout error: " + err.message };
  }
}

export async function checkAuthStatus() {
  try {
    const res = await fetch("http://localhost/jokoai_backend/api/check",{
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok && data.authenticated) {
      return { authenticated: true, user: data.user };
    } else {
      return { authenticated: false };
    }
  } catch (err) {
    return { authenticated: false };
  }
}

// ==============================
// UI & EVENT LOGIC
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('authContainer');
  const signupLink = document.getElementById('signupLink');
  const signinLink = document.getElementById('signinLink');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const toastContainer = document.getElementById('toastContainer');
  const container = document.querySelector('.container');
  const parallax = document.querySelector('.parallax');

  function switchToSignUp() {
    authContainer.classList.add('signup-active');
    setTimeout(() => {
      document.getElementById('name').focus();
    }, 700);
  }

  function switchToSignIn() {
    authContainer.classList.remove('signup-active');
    setTimeout(() => {
      document.getElementById('username').focus();
    }, 700);
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Handle Sign In
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const result = await loginUser({ username, password });
    if (result.success) {
      showToast('Login successful!');
      
      // Redirect setelah delay sedikit biar user lihat toast
      setTimeout(() => {
        window.location.href = "/home.html"; // Ganti sesuai path halaman dashboard kamu
      }, 1000); // 1 detik delay biar toast kelihatan
      
    } else {
      showToast(result.message || 'Login failed', 'error');
    }
  });


  // Handle Sign Up
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    
    const result = await registerUser({ username, password });
    if (result.success) {
      showToast('Registration successful!');
      switchToSignIn();
    } else {
      showToast(result.message || 'Registration failed', 'error');
    }
  });

  // Event listeners for toggling UI
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchToSignUp();
    addTransitionClass();
  });

  signinLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchToSignIn();
    addTransitionClass();
  });

  signUpBtn.addEventListener('click', () => {
    switchToSignUp();
    addTransitionClass();
  });

  signInBtn.addEventListener('click', () => {
    switchToSignIn();
    addTransitionClass();
  });

  // Wave effect
  window.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      parallax.style.transform = `translateX(${x * 5}px) translateY(${y * 5}px)`;
      container.style.boxShadow = `${20 - x * 10}px ${20 - y * 10}px 50px rgba(0, 0, 0, 0.15)`;
    }
  });

  // Smooth transition effect
  function addTransitionClass() {
    document.body.classList.add('page-transition');
    setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 700);
  }

  // Particle animation
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer) {
    const particleCount = 100;
    const particleColors = [
      'rgba(41, 98, 255, 0.3)',
      'rgba(118, 143, 255, 0.3)',
      'rgba(255, 255, 255, 0.1)'
    ];

    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }

    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      const colorIndex = Math.floor(Math.random() * particleColors.length);
      particle.style.backgroundColor = particleColors[colorIndex];

      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;

      particle.style.animation = `particleFade ${duration}s linear ${delay}s infinite`;

      particlesContainer.appendChild(particle);
    }
  }
});
