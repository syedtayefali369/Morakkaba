// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const timeDisplay = document.getElementById('timeDisplay');
const timerButtons = document.querySelectorAll('.timer-btn');
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const donationOptions = document.querySelectorAll('.donation-option');
const customAmountInput = document.getElementById('customAmount');
const donateButton = document.getElementById('donateButton');
const startSound = document.getElementById('startSound');
const endSound = document.getElementById('endSound');

// Timer Variables
let timerInterval;
let timeLeft = 600; // 10 minutes in seconds
let isRunning = false;
let selectedTime = 600;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTimeDisplay();
    setupEventListeners();
    setupSmoothScroll();
    
    // Add floating animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Timer buttons
    timerButtons.forEach(button => {
        button.addEventListener('click', () => {
            timerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTime = parseInt(button.getAttribute('data-time'));
            timeLeft = selectedTime;
            updateTimeDisplay();
        });
    });
    
    // Start/Stop timer
    startTimerBtn.addEventListener('click', toggleTimer);
    
    // Reset timer
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Donation options
    donationOptions.forEach(option => {
        option.addEventListener('click', () => {
            donationOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            if (option.getAttribute('data-amount') === 'custom') {
                customAmountInput.style.display = 'block';
                customAmountInput.focus();
            } else {
                customAmountInput.style.display = 'none';
                customAmountInput.value = '';
            }
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', () => {
        donationOptions.forEach(opt => opt.classList.remove('active'));
    });
    
    // Donate button
    donateButton.addEventListener('click', processDonation);
}

// Smooth scrolling for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Timer Functions
function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timeLeft <= 0) return;
    
    isRunning = true;
    startTimerBtn.innerHTML = '<i class="fas fa-pause-circle"></i> PAUSE MEDITATION';
    startTimerBtn.classList.add('pulse');
    
    // Play start sound
    startSound.play();
    
    // Show notification
    showNotification('Meditation session started. Find your focus.', false);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimeDisplay();
        
        if (timeLeft <= 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startTimerBtn.innerHTML = '<i class="fas fa-play-circle"></i> RESUME MEDITATION';
    startTimerBtn.classList.remove('pulse');
    
    showNotification('Meditation paused.', false);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = selectedTime;
    updateTimeDisplay();
    startTimerBtn.innerHTML = '<i class="fas fa-play-circle"></i> START MEDITATION';
    startTimerBtn.classList.remove('pulse');
    
    showNotification('Timer reset to ' + formatTime(selectedTime), false);
}

function completeTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 0;
    updateTimeDisplay();
    startTimerBtn.innerHTML = '<i class="fas fa-play-circle"></i> START MEDITATION';
    startTimerBtn.classList.remove('pulse');
    
    // Play completion sound
    endSound.play();
    
    // Show completion notification
    showNotification('Meditation complete! Take a moment to notice how you feel.', false);
    
    // Show celebration effect
    showCelebration();
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Add pulsing effect when under 1 minute
    if (timeLeft < 60) {
        timeDisplay.style.animation = 'pulse 1s infinite';
        timeDisplay.style.color = 'var(--neon-blue)';
    } else {
        timeDisplay.style.animation = '';
        timeDisplay.style.color = 'var(--neon-green)';
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// Donation Processing
function processDonation() {
    let amount = 0;
    
    // Check if custom amount is entered
    if (customAmountInput.value) {
        amount = parseInt(customAmountInput.value);
    } else {
        // Check active donation option
        const activeOption = document.querySelector('.donation-option.active');
        if (activeOption && activeOption.getAttribute('data-amount') !== 'custom') {
            amount = parseInt(activeOption.getAttribute('data-amount'));
        }
    }
    
    if (amount > 0) {
        // In a real implementation, this would redirect to payment gateway
        // For now, show a demo message
        showNotification(`Thank you for your $${amount} donation! Redirecting to secure payment...`, false);
        
        // Simulate payment processing
        setTimeout(() => {
            showNotification('Payment processed successfully! Thank you for supporting Morakkaba.', false);
            showCelebration();
            
            // Reset donation form
            donationOptions.forEach(opt => opt.classList.remove('active'));
            donationOptions[1].classList.add('active'); // Reset to $10
            customAmountInput.style.display = 'none';
            customAmountInput.value = '';
        }, 2000);
    } else {
        showNotification('Please select or enter a donation amount.', true);
    }
}

// Notification System
function showNotification(message, isError) {
    // Remove existing notification
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `custom-notification ${isError ? 'error' : 'success'}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${isError ? 'rgba(255, 50, 50, 0.9)' : 'rgba(0, 255, 157, 0.9)'};
            color: ${isError ? 'white' : 'black'};
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 350px;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid ${isError ? 'rgba(255, 50, 50, 0.5)' : 'rgba(0, 255, 157, 0.5)'};
        ">
            <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 10px;"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Add CSS for animation if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Celebration Effect
function showCelebration() {
    const celebration = document.createElement('div');
    celebration.style.position = 'fixed';
    celebration.style.top = '0';
    celebration.style.left = '0';
    celebration.style.width = '100%';
    celebration.style.height = '100%';
    celebration.style.pointerEvents = 'none';
    celebration.style.zIndex = '9998';
    celebration.style.background = 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,255,157,0.1) 70%)';
    celebration.style.animation = 'pulse 1s ease-out';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.parentNode.removeChild(celebration);
        }
    }, 1000);
}

// ==================== PAYMENT INTEGRATION GUIDE ====================

// This function would be replaced with actual Stripe/PayPal integration
function setupPaymentIntegration() {
    // Stripe Integration Example (commented out - requires actual API keys)
    /*
    // Load Stripe.js
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);
    
    // Initialize Stripe with your publishable key
    const stripe = Stripe('pk_live_your_publishable_key_here');
    
    // Create checkout session (backend required)
    async function createCheckoutSession(amount) {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to cents
                currency: 'usd'
            }),
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        
        if (result.error) {
            showNotification(result.error.message, true);
        }
    }
    */
    
    // PayPal Integration Example (commented out - requires actual Client ID)
    /*
    // Load PayPal SDK
    const paypalScript = document.createElement('script');
    paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD';
    document.head.appendChild(paypalScript);
    
    paypalScript.onload = function() {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: donationAmount
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showNotification('Payment completed successfully!', false);
                });
            }
        }).render('#paypal-button-container');
    };
    */
}

// ==================== AD INTEGRATION GUIDE ====================

function setupAdIntegration() {
    // Google AdSense Integration (commented out - requires approval)
    /*
    const adsenseScript = document.createElement('script');
    adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
    adsenseScript.async = true;
    adsenseScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsenseScript);
    
    // Ad placements
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    adPlaceholders.forEach((placeholder, index) => {
        const adScript = document.createElement('script');
        adScript.innerHTML = `
            (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-YOUR_PUBLISHER_ID",
                enable_page_level_ads: true,
                overlays: {bottom: true}
            });
        `;
        placeholder.appendChild(adScript);
    });
    */
    
    // For now, show demo ads
    showDemoAds();
}

function showDemoAds() {
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    const demoAds = [
        'Meditation Cushion Sale - 50% Off',
        'Try Calm Premium - Free Trial',
        'Noise Cancelling Headphones - Best for Meditation',
        'Meditation Retreat in Bali - Limited Spots'
    ];
    
    adPlaceholders.forEach((placeholder, index) => {
        placeholder.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(0,255,157,0.1), rgba(0,217,255,0.1));
                padding: 20px;
                border-radius: 10px;
                border: 1px solid rgba(0,255,157,0.3);
                color: var(--neon-green);
                font-weight: 600;
                text-align: center;
            ">
                <i class="fas fa-ad" style="margin-right: 10px;"></i>
                ${demoAds[index % demoAds.length]}
                <br>
                <span style="font-size: 0.8rem; color: #aaa; font-weight: normal;">[Advertisement]</span>
            </div>
        `;
        
        // Make ads clickable (in real implementation, this would link to advertiser)
        placeholder.style.cursor = 'pointer';
        placeholder.addEventListener('click', () => {
            showNotification('Advertisement clicked - this would redirect to advertiser in production', false);
        });
    });
}

// Initialize ad integration
setTimeout(() => {
    setupAdIntegration();
}, 2000);

// Track page views for ad optimization
let pageViews = localStorage.getItem('morakkaba_pageviews') || 0;
pageViews++;
localStorage.setItem('morakkaba_pageviews', pageViews);

// Show premium ad after 3 pageviews
if (pageViews > 3) {
    setTimeout(() => {
        const premiumAd = document.createElement('div');
        premiumAd.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #000, var(--dark-bg));
                border: 2px solid var(--neon-green);
                padding: 15px;
                border-radius: 10px;
                max-width: 300px;
                z-index: 9997;
                box-shadow: var(--neon-glow);
                animation: slideInRight 0.5s ease-out;
            ">
                <h4 style="color: var(--neon-green); margin-bottom: 10px;">Upgrade to Premium</h4>
                <p style="color: #aaa; font-size: 0.9rem;">Unlock advanced features for $9.99/month</p>
                <button style="
                    background: var(--gradient);
                    color: black;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 10px;
                    width: 100%;
                ">Learn More</button>
                <button onclick="this.parentElement.style.display='none'" style="
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    background: transparent;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">×</button>
            </div>
        `;
        document.body.appendChild(premiumAd);
    }, 10000);
}
