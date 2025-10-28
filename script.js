// Utility Functions
class NumberLookup {
    constructor() {
        this.init();
    }

    init() {
        this.searchBtn = document.getElementById('searchBtn');
        this.mobileInput = document.getElementById('mobileNumber');
        this.resultsWrap = document.getElementById('resultsWrap');
        
        this.bindEvents();
        this.createParticles();
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.onSearch());
        this.mobileInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.onSearch();
        });
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            this.searchBtn.addEventListener('touchstart', () => {
                navigator.vibrate(10);
            });
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(unsafe) {
        return unsafe?.replace(/[&<"'>]/g, c => ({
            '&': '&amp;',
            '<': '&lt;', 
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])) || '';
    }

    onSearch() {
        const number = this.mobileInput.value.trim();
        
        if (!this.validateNumber(number)) {
            this.showError('Please enter a valid 10-digit number');
            return;
        }

        this.fetchLookup(number);
    }

    validateNumber(number) {
        return /^\d{10}$/.test(number);
    }

    showLoader() {
        this.resultsWrap.innerHTML = '';
        const loaderCard = document.createElement('div');
        loaderCard.className = 'result-card visible';
        loaderCard.innerHTML = `
            <div style="display:flex;gap:14px;align-items:center">
                <div class="loader" aria-hidden="true"></div>
                <div style="color:var(--muted)">Fetching results…</div>
            </div>
        `;
        this.resultsWrap.appendChild(loaderCard);
    }

    showError(message) {
        this.resultsWrap.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'result-card visible';
        card.innerHTML = `
            <div class="result-header">
                <div class="result-title">No results</div>
                <div class="result-meta">lookup</div>
            </div>
            <div class="group">
                <div class="k">Error</div>
                <div class="v">${this.escapeHtml(message)}</div>
            </div>
        `;
        this.resultsWrap.appendChild(card);
    }

    renderResults(items) {
        this.resultsWrap.innerHTML = '';
        
        items.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'result-card';
            card.innerHTML = this.createResultCardHTML(item);
            this.resultsWrap.appendChild(card);

            // Staggered animation
            setTimeout(() => card.classList.add('visible'), 120 * index + 80);
        });
    }

    createResultCardHTML(data) {
        const metaTime = new Date().toLocaleString();
        
        return `
            <div class="result-header">
                <div class="result-title">Lookup Result</div>
                <div class="result-meta">${this.escapeHtml(data.mobile || '—')} • ${metaTime}</div>
            </div>

            <div class="group">
                <div class="k">Name</div>
                <div class="v">${this.escapeHtml(data.name || 'N/A')}</div>
                <div class="k">Father</div>
                <div class="v">${this.escapeHtml(data.father_name || 'N/A')}</div>
                <div class="k">Mother</div>
                <div class="v">${this.escapeHtml(data.mother_name || 'N/A')}</div>
                <div class="k">DOB</div>
                <div class="v">${this.escapeHtml(data.dob || 'N/A')}</div>
            </div>
            
            <div class="group">
                <div class="k">Gender</div>
                <div class="v">${this.escapeHtml(data.gender || 'N/A')}</div>
                <div class="k">Aadhaar</div>
                <div class="v">${this.escapeHtml(data.aadhaar_number || 'Not Linked')}</div>
                <div class="k">Email</div>
                <div class="v">${this.escapeHtml(data.email || 'N/A')}</div>
                <div class="k">SIM Type</div>
                <div class="v">${this.escapeHtml(data.sim_type || 'N/A')}</div>
            </div>

            <div class="group">
                <div class="k">Circle</div>
                <div class="v">${this.escapeHtml(data.circle || 'N/A')}</div>
                <div class="k">Registered On</div>
                <div class="v">${this.escapeHtml(data.registered_on || 'N/A')}</div>
                <div class="k">Location</div>
                <div class="v">${this.escapeHtml(data.location || 'N/A')}</div>
                <div class="k">Address</div>
                <div class="v">${this.escapeHtml(data.address || 'N/A')}</div>
            </div>
        `;
    }

    async fetchLookup(number) {
        this.showLoader();
        
        try {
            const url = `https://n2d.vercel.app/api?key=freeApi&number=${encodeURIComponent(number)}`;
            const response = await fetch(url, { cache: 'no-store' });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data?.status === 'success' && Array.isArray(data.data) && data.data.length) {
                this.renderResults(data.data);
            } else {
                this.showError('No data found for this number');
            }
        } catch (error) {
            console.error('Lookup error:', error);
            this.showError('Network or API error. Please try again.');
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 120 + 60;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 25 + 15;
            const colors = [
                'rgba(0, 230, 195, 0.1)',
                'rgba(0, 123, 255, 0.1)',
                'rgba(255, 0, 127, 0.1)',
                'rgba(255, 210, 0, 0.1)',
                'rgba(157, 78, 221, 0.1)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.background = color;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
}

// Performance optimization
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', '0ms');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberLookup();
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}