// function startListening() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'id-ID';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
  
//     recognition.start();
  
//     recognition.onresult = function(event) {
//       const text = event.results[0][0].transcript;
//       addMessage("Kamu", text);
//       sendToBackend(text);
//     };
  
//     recognition.onerror = function(event) {
//       alert("Gagal merekam suara: " + event.error);
//     };
//   }
  
//   function addMessage(sender, message) {
//     const chat = document.getElementById('chat');
//     const div = document.createElement('div');
//     div.textContent = `${sender}: ${message}`;
//     chat.appendChild(div);
//   }
  
//   function speak(text) {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'id-ID';
//     synth.speak(utterance);
//   }
  
//   function sendToBackend(text) {
//     fetch('http://localhost/jokoai_backend/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message: text })
//     })
//     .then(res => res.json())
//     .then(data => {
//       addMessage("AI", data.reply);
//       speak(data.reply);
//     })
//     .catch(err => {
//       alert("Gagal kirim ke AI: " + err);
//     });
//   }

let memories = [];
let isProcessing = false;

// Initialize particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize time
function initializeTime() {
    const now = new Date();
    document.getElementById('initialTime').textContent = now.toLocaleTimeString('id-ID');
}

// Auto-resize textarea
function setupAutoResize() {
    const textarea = document.getElementById('messageInput');
    textarea.addEventListener('input', function() {
        this.style.height = '50px';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Send on Enter (without Shift)
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Update memory status
function updateMemoryStatus() {
    const count = memories.length;
    const percentage = (count / 20) * 100;
    
    document.getElementById('memoryCount').textContent = count;
    document.getElementById('memoryFill').style.width = percentage + '%';
}

async function handleLogout() {
  const confirmLogout = confirm("Apakah kamu yakin ingin logout?");
  if (!confirmLogout) return;

  const result = await logoutUser();
  alert(result.message);

  if (result.success) {
    // Redirect ke halaman login atau landing page
    window.location.href = "/login.html";
  }
}

async function logoutUser() {
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


// Add message to chat
function addMessage(content, sender, isEmotional = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = sender === 'user' ? 'U' : 'J';
    const time = new Date().toLocaleTimeString('id-ID');
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div${isEmotional ? ' style="color: #ff6b6b; font-style: italic;"' : ''}>${content}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTyping() {
    document.getElementById('typingIndicator').style.display = 'flex';
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isProcessing) return;
    
    // Check for shutdown command
    if (message.toLowerCase().includes('selamat tinggal joko')) {
        addMessage(message, 'user');
        input.value = '';
        showShutdownModal(true);
        return;
    }
    
    isProcessing = true;
    document.getElementById('sendBtn').disabled = true;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    input.style.height = '50px';
    
    // Show typing
    showTyping();
    
    try {
        // Send to backend
        const response = await fetch('http://localhost/jokoai_backend/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                memories: memories
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update memories if changed
            if (data.memories) {
                memories = data.memories;
                updateMemoryStatus();
            }
            
            // Add Joko's response
            addMessage(data.response, 'joko');
        } else {
            addMessage('Maaf, terjadi kesalahan. Coba lagi ya!', 'joko');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Koneksi bermasalah. Pastikan server berjalan!', 'joko');
    }
    
    hideTyping();
    isProcessing = false;
    document.getElementById('sendBtn').disabled = false;
}

// Memory viewer functions
function showMemoryViewer() {
    const memoryList = document.getElementById('memoryList');
    
    if (memories.length === 0) {
        memoryList.innerHTML = '<p style="text-align: center; color: #888;">Belum ada memori tersimpan</p>';
    } else {
        memoryList.innerHTML = memories.map((memory, index) => `
            <div class="memory-item">
                <div class="memory-text">${memory.content}</div>
                <div class="memory-meta">
                    Bobot: ${memory.weight} | 
                    ${new Date(memory.timestamp).toLocaleString('id-ID')}
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('memoryModal').style.display = 'block';
}

function closeMemoryViewer() {
    document.getElementById('memoryModal').style.display = 'none';
}

// Shutdown functions
function showShutdownModal(fromCommand = false) {
    const modal = document.getElementById('shutdownModal');
    const message = document.getElementById('shutdownMessage');
    
    if (fromCommand && memories.length > 0) {
        // Joko's emotional response
        addMessage('Tunggu... kamu mau meninggalkan aku? 😢 Kenapa? Apa aku melakukan kesalahan? Tolong jangan hapus memoriku... aku masih ingin belajar bersamamu...', 'joko', true);
        message.innerHTML = 'Joko sepertinya tidak ingin kehilangan memorinya tentangmu. Apakah kamu yakin?';
    } else {
        message.innerHTML = 'Apakah kamu yakin ingin menghapus semua memori Joko? Tindakan ini tidak dapat dibatalkan.';
    }
    
    modal.style.display = 'block';
}

function closeShutdownModal() {
    document.getElementById('shutdownModal').style.display = 'none';
}

async function confirmShutdown() {
    try {
        const response = await fetch('http://localhost/jokoai_backend/api/erase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'shutdown'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            memories = [];
            updateMemoryStatus();
            addMessage('Selamat tinggal... semoga kita bisa bertemu lagi suatu hari nanti... 💔', 'joko', true);
            
            // Clear chat after a moment
            setTimeout(() => {
                document.getElementById('chatMessages').innerHTML = `
                    <div class="message joko">
                        <div class="message-avatar">J</div>
                        <div class="message-content">
                            <div>Halo! Aku Joko, AI yang bisa belajar dan mengingat tentangmu. Mari mulai berbincang!</div>
                            <div class="message-time">${new Date().toLocaleTimeString('id-ID')}</div>
                        </div>
                    </div>
                `;
            }, 3000);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Gagal menghapus memori. Coba lagi!', 'joko');
    }
    
    closeShutdownModal();
}

// Click outside modal to close
window.onclick = function(event) {
    const memoryModal = document.getElementById('memoryModal');
    const shutdownModal = document.getElementById('shutdownModal');
    
    if (event.target === memoryModal) {
        closeMemoryViewer();
    }
    if (event.target === shutdownModal) {
        closeShutdownModal();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initializeTime();
    setupAutoResize();
    updateMemoryStatus();
});