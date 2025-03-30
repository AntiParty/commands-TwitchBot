// Simple particle system
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "0";
  document.getElementById("particles-js").appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `rgba(145, 71, 255, ${Math.random() * 0.5 + 0.1})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  const particles = [];
  for (let i = 0; i < Math.floor(canvas.width / 10); i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect particles
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(145, 71, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});

// Command data with preview examples
const commands = [
  {
    name: "pm2",
    description: "Displays currently running pm2 processes on the server",
    usage: "!pm2",
    disabled: false,
    preview: {
      userInput: "!pm2",
      botResponse: "Current PM2 processes: bot.js, web.js, api.js",
    },
  },
  {
    name: "quote",
    description: "Displays a random quote or a specific quote by index",
    usage: "!quote [index]",
    disabled: false,
    preview: {
      userInput: "!quote 42",
      botResponse:
        '"The only way to do great work is to love what you do." - Steve Jobs (Quote #42)',
    },
  },
  {
    name: "remindme",
    description: "Sets a reminder that will ping you after the specified time",
    usage: "!remindme [time] [message] (e.g., !remindme 30m Check the stream)",
    disabled: false,
    preview: {
      userInput: "!remindme 30m Check the stream",
      botResponse: "@user, reminder set! I'll ping you in 30 minutes.",
    },
  },
  {
    name: "request",
    description:
      "Request a song to be played (subscribers, VIPs, and mods only)",
    usage: "!request <song name> or !request <spotify link>",
    disabled: false,
    preview: {
      userInput: "!request Bohemian Rhapsody",
      botResponse: '@user, 🎵 Added to queue: "Bohemian Rhapsody" by Queen',
    },
  },
  {
    name: "status",
    description: "Displays system status information",
    usage: "!status",
    disabled: false,
    preview: {
      userInput: "!status",
      botResponse: "System status: CPU 24%, Memory 3.2GB/8GB, Uptime 3d 7h 12m",
    },
  },
  {
    name: "suggest",
    description: "Suggest a new command or feature for the bot",
    usage: "!suggest <type> <name> <description>",
    disabled: false,
    preview: {
      userInput: "!suggest command weather Get current weather",
      botResponse:
        "@user, thanks for your suggestion! It's been sent to the developer.",
    },
  },
  {
    name: "toggle",
    description: "Toggle a command or service on/off (mod only)",
    usage: "!toggle <command|service> <name> <on|off>",
    disabled: false,
    preview: {
      userInput: "!toggle command request off",
      botResponse: '✔️ Command "request" has been turned off.',
    },
  },
  {
    name: "addquote",
    description: "Adds a new quote to the database (mod only)",
    usage: "!addquote @username [quote text]",
    disabled: false,
    preview: {
      userInput: '!addquote @antiparty "Hello world"',
      botResponse: 'Quote #123 added: "Hello world" - antiparty',
    },
  },
  {
    name: "commands",
    description: "Lists all available commands",
    usage: "!commands",
    disabled: false,
    preview: {
      userInput: "!commands",
      botResponse:
        "Available commands: !pm2, !quote, !remindme, !request, !status, !suggest, !toggle, !addquote, !commands",
    },
  },
];

const commandsContainer = document.getElementById("commands");
const searchInput = document.getElementById("search");
const previewPopup = document.getElementById("previewPopup");
const closePreviewBtn = document.querySelector(".close-preview");
const chatSimulation = document.getElementById("chatSimulation");
const previewTitle = document.getElementById("previewTitle");

function renderCommands(filteredCommands = commands) {
  commandsContainer.innerHTML = "";

  if (filteredCommands.length === 0) {
    commandsContainer.innerHTML = `
                    <div class="command-card" style="grid-column: 1 / -1; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                        <h3>No commands found</h3>
                        <p style="color: var(--text-muted);">Try adjusting your search</p>
                    </div>
                `;
    return;
  }

  filteredCommands.forEach((cmd) => {
    const cmdEl = document.createElement("div");
    cmdEl.className = `command-card ${cmd.disabled ? "disabled" : ""}`;

    cmdEl.innerHTML = `
                    <div class="command-name">${cmd.name}</div>
                    <div class="command-desc">${cmd.description}</div>
                    <div class="command-usage">${cmd.usage}</div>
                    <button class="preview-btn" data-cmd="${cmd.name}">👀 Preview Command</button>
                `;

    commandsContainer.appendChild(cmdEl);
  });

  // Add event listeners to all preview buttons
  document.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cmdName = this.getAttribute("data-cmd");
      showCommandPreview(cmdName);
    });
  });
}

function showCommandPreview(cmdName) {
  const command = commands.find((cmd) => cmd.name === cmdName);
  if (!command) return;

  // Set the title
  previewTitle.textContent = `!${command.name} Preview`;

  // Clear previous chat simulation
  chatSimulation.innerHTML = "";

  // Show the popup
  previewPopup.classList.add("active");
  document.body.style.overflow = "hidden";

  // Create user message
  setTimeout(() => {
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message";
    userMsg.innerHTML = `
                    <span class="user">viewer:</span>
                    <span class="message">${command.preview.userInput}</span>
                `;
    chatSimulation.appendChild(userMsg);

    // Create typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `
                    <span>AntipartyRR is typing</span>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
    chatSimulation.appendChild(typingIndicator);

    // After delay, show bot response
    setTimeout(() => {
      typingIndicator.remove();

      const botReply = document.createElement("div");
      botReply.className = "chat-message bot-reply";
      botReply.innerHTML = `
                        <span class="user">AntipartyRR Bot:</span>
                        <span class="message">${command.preview.botResponse}</span>
                    `;
      chatSimulation.appendChild(botReply);

      // Scroll to bottom
      chatSimulation.scrollTop = chatSimulation.scrollHeight;
    }, 1500);
  }, 300);
}

// Close preview when clicking X or outside
closePreviewBtn.addEventListener("click", closePreview);
previewPopup.addEventListener("click", function (e) {
  if (e.target === this) {
    closePreview();
  }
});

function closePreview() {
  previewPopup.classList.remove("active");
  document.body.style.overflow = "auto";
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(term) ||
      cmd.description.toLowerCase().includes(term) ||
      cmd.usage.toLowerCase().includes(term)
  );
  renderCommands(filtered);
});

// Initial render
renderCommands();