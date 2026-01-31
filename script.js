// Advanced Modern JavaScript with Complex Interactions

class ModernWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.setupCustomCursor();
        this.setupLoadingScreen();
        this.setupScrollAnimations();
        this.setupGalleryFilters();
        this.setupCounterAnimations();
        this.setupTiltEffects();
        this.setupSemiCircleCarousel();
    }

    init() {
        // Initialize core functionality
        this.isLoaded = false;
        this.scrollY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];

        // Performance optimization
        this.rafId = null;
        this.ticking = false;
        this.lastParticleTime = 0;
        this.lastBurstTime = 0;

        // Reduce motion for users who prefer it
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    setupEventListeners() {
        // Navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        navToggle?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));

                if (target) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');

                    this.smoothScrollTo(target);
                }
            });
        });

        // Optimized scroll events with passive listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }

            // Clear scroll timeout
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.ticking = false;
            }, 100);
        }, { passive: true });

        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateCursor(e);
        });

        // CTA Buttons
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCTAClick(e);
            });
        });

        // Gallery Item Buttons
        document.querySelectorAll('.item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGalleryItemClick(e);
            });
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupCustomCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        const orchidCursor = document.querySelector('.orchid-cursor');
        const cursorTrail = document.querySelector('.cursor-trail');

        if (!orchidCursor || !cursorTrail) return;

        let cursorX = 0;
        let cursorY = 0;
        let trailX = 0;
        let trailY = 0;
        let isMoving = false;

        // Throttled cursor update
        const updateCursor = () => {
            if (!isMoving) return;

            orchidCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

            // Smooth trail following with reduced frequency
            trailX += (cursorX - trailX) * 0.08;
            trailY += (cursorY - trailY) * 0.08;
            cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

            // Stop animation when cursor stops moving
            if (Math.abs(cursorX - trailX) < 1 && Math.abs(cursorY - trailY) < 1) {
                isMoving = false;
            } else {
                requestAnimationFrame(updateCursor);
            }
        };

        // Throttled mouse move handler
        let mouseMoveTimeout;
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateCursor);
            }

            // Clear previous timeout
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                isMoving = false;
            }, 100);
        });

        // Cursor interactions for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn, .nav-link, .cta-button');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                orchidCursor.classList.add('hover');
                cursorTrail.classList.add('hover');

                // Add special effects for different elements
                if (el.classList.contains('gallery-item')) {
                    this.createOrchidParticles(cursorX, cursorY);
                }
            });

            el.addEventListener('mouseleave', () => {
                orchidCursor.classList.remove('hover');
                cursorTrail.classList.remove('hover');
            });

            el.addEventListener('mousedown', () => {
                orchidCursor.classList.add('click');
                this.createOrchidBurst(cursorX, cursorY);
            });

            el.addEventListener('mouseup', () => {
                orchidCursor.classList.remove('click');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            orchidCursor.style.opacity = '0';
            cursorTrail.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            orchidCursor.style.opacity = '1';
            cursorTrail.style.opacity = '0.6';
        });
    }

    createOrchidParticles(x, y) {
        // Limit particle creation frequency
        if (this.lastParticleTime && Date.now() - this.lastParticleTime < 500) return;
        this.lastParticleTime = Date.now();

        // Reduced particle count for better performance
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'orchid-particle';
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: #FFD700;
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9997;
                animation: orchidParticle 0.8s ease-out forwards;
                transform: translate(-50%, -50%);
            `;

            const angle = (Math.PI * 2 * i) / 3;
            const velocity = 15 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.style.setProperty('--vx', `${vx}px`);
            particle.style.setProperty('--vy', `${vy}px`);

            document.body.appendChild(particle);

            // Faster cleanup
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 800);
        }
    }

    createOrchidBurst(x, y) {
        // Limit burst creation frequency
        if (this.lastBurstTime && Date.now() - this.lastBurstTime < 300) return;
        this.lastBurstTime = Date.now();

        // Reduced petal count for better performance
        for (let i = 0; i < 6; i++) {
            const petal = document.createElement('div');
            petal.className = 'orchid-burst';
            petal.style.cssText = `
                position: fixed;
                width: 4px;
                height: 6px;
                background: #FFD700;
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9997;
                animation: orchidBurst 0.6s ease-out forwards;
                transform: translate(-50%, -50%) rotate(${i * 60}deg);
            `;

            document.body.appendChild(petal);

            // Faster cleanup
            setTimeout(() => {
                if (petal.parentNode) {
                    petal.remove();
                }
            }, 600);
        }
    }

    updateCursor(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');

        if (!loadingScreen || !loadingProgress) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.isLoaded = true;
                    this.startAnimations();
                }, 500);
            }
            loadingProgress.style.width = `${progress}%`;
        }, 100);

        // Create loading particles
        this.createLoadingParticles();
    }

    createLoadingParticles() {
        const particlesContainer = document.querySelector('.loading-particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #FFD700;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            particlesContainer.appendChild(particle);
        }

        // Add particle animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
                50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles() {
        const particleSystem = document.querySelector('.particle-system');
        if (!particleSystem) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(255, 215, 0, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: heroParticle ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleSystem.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes heroParticle {
                0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) translateX(50px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    handleScroll() {
        this.scrollY = window.pageYOffset;

        // Update navbar (throttled)
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (this.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update scroll progress (throttled)
        const navProgress = document.querySelector('.nav-progress');
        if (navProgress) {
            const scrollPercent = (this.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            navProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }

        // Reduced frequency parallax effects
        if (this.scrollY % 3 === 0) { // Only update every 3rd scroll event
            this.updateParallax();
        }
    }

    updateParallax() {
        // Simplified parallax with better performance
        const parallaxElements = document.querySelectorAll('.floating-item[data-tilt]');

        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1); // Reduced intensity
            const yPos = -(this.scrollY * speed);

            // Use transform3d for hardware acceleration and reduce calculations
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Simplified geometric shapes parallax
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05); // Reduced intensity
            const yPos = this.scrollY * speed;
            shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');

                    // Stagger animation for gallery items
                    if (entry.target.classList.contains('gallery-item')) {
                        const items = Array.from(document.querySelectorAll('.gallery-item'));
                        const index = items.indexOf(entry.target);

                        setTimeout(() => {
                            entry.target.classList.add('show');
                        }, index * 100);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.gallery-item, .section-header, .hero-stats').forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    checkScrollAnimations() {
        // Custom scroll animations can be added here
    }

    setupGalleryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                galleryItems.forEach((item, index) => {
                    const category = item.dataset.category;

                    if (filter === 'all' || category === filter) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            item.classList.add('show');
                        }, index * 50);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    let current = 0;
                    const increment = target / 100;

                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    setupTiltEffects() {
        const tiltElements = document.querySelectorAll('[data-tilt]');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    setupSemiCircleCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const cards = document.querySelectorAll('.carousel-card');
        const leftArrow = document.querySelector('.carousel-arrow-left');
        const rightArrow = document.querySelector('.carousel-arrow-right');
        const indicators = document.querySelectorAll('.indicator');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (!carouselTrack || cards.length === 0) return;

        let currentIndex = 0;
        let allCards = Array.from(cards);
        let visibleCards = [...allCards];
        let autoPlayInterval = null;
        const totalCards = cards.length;

        // Full circle configuration
        const circleRadius = 380; // Radius of the circle
        const verticalOffset = 80; // How much to push cards down/up based on position

        // Position cards in a full circle
        const positionCards = (activeIndex) => {
            const numCards = visibleCards.length;

            visibleCards.forEach((card, i) => {
                // Calculate the angle for this card in the circle
                // Cards are evenly distributed around the full 360 degrees
                const baseAngle = (i / numCards) * Math.PI * 2;

                // Adjust angle based on which card is active (rotate the whole circle)
                const activeAngle = (activeIndex / numCards) * Math.PI * 2;
                const angle = baseAngle - activeAngle;

                // Normalize angle to determine front/back position
                // Front is at angle 0, back is at angle PI
                let normalizedAngle = angle;
                while (normalizedAngle < -Math.PI) normalizedAngle += Math.PI * 2;
                while (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;

                // Calculate X position (left/right on the circle)
                const x = Math.sin(angle) * circleRadius;

                // Calculate Z depth (cos gives us -1 at back, 1 at front)
                const zDepth = Math.cos(angle);

                // Calculate Y position - cards at front are slightly higher
                const y = -zDepth * verticalOffset;

                // Scale based on depth (1 at front, smaller at back)
                const depthFactor = (zDepth + 1) / 2; // 0 at back, 1 at front
                const scale = 0.5 + (depthFactor * 0.5); // 0.5 at back, 1.0 at front

                // Blur based on depth (sharp at front, blurry at back)
                const blur = (1 - depthFactor) * 8;

                // Opacity based on depth
                const opacity = 0.3 + (depthFactor * 0.7); // 0.3 at back, 1.0 at front

                // Z-index based on depth (front cards on top)
                const zIndex = Math.round(50 + zDepth * 50);

                // Rotation for 3D effect
                const rotateY = -Math.sin(angle) * 35;

                // Apply transforms - use translateZ for true 3D depth
                card.style.transform = `
                    translate(-50%, -50%)
                    translateX(${x}px)
                    translateY(${y}px)
                    translateZ(${zDepth * 200}px)
                    scale(${scale})
                    rotateY(${rotateY}deg)
                `;
                card.style.filter = blur < 0.5 ? 'blur(0px)' : `blur(${blur}px)`;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;

                // Set active and adjacent classes
                card.classList.remove('active', 'adjacent');
                const isActive = Math.abs(normalizedAngle) < 0.3;
                const isAdjacent = Math.abs(normalizedAngle) < 0.8 && !isActive;

                if (isActive) {
                    card.classList.add('active');
                    card.style.pointerEvents = 'auto';
                } else if (isAdjacent) {
                    card.classList.add('adjacent');
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.pointerEvents = 'none';
                }
            });

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === activeIndex);
            });
        };

        // Navigate to specific card
        const goToCard = (index) => {
            // Handle wrapping
            if (index < 0) {
                index = visibleCards.length - 1;
            } else if (index >= visibleCards.length) {
                index = 0;
            }

            currentIndex = index;
            positionCards(currentIndex);
        };

        // Navigate previous
        const prevCard = () => {
            goToCard(currentIndex - 1);
        };

        // Navigate next
        const nextCard = () => {
            goToCard(currentIndex + 1);
        };

        // Auto-play functionality
        const startAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                nextCard();
            }, 4000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        // Event listeners
        leftArrow?.addEventListener('click', () => {
            prevCard();
            stopAutoPlay();
            startAutoPlay();
        });

        rightArrow?.addEventListener('click', () => {
            nextCard();
            stopAutoPlay();
            startAutoPlay();
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToCard(index);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        // Card click to navigate
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const cardIndex = visibleCards.indexOf(card);
                if (cardIndex !== -1 && cardIndex !== currentIndex) {
                    goToCard(cardIndex);
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const carouselWrapper = document.querySelector('.carousel-wrapper');
            const rect = carouselWrapper?.getBoundingClientRect();
            if (!rect) return;

            // Only respond if carousel is in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevCard();
                    stopAutoPlay();
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextCard();
                    stopAutoPlay();
                    startAutoPlay();
                }
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselStage = document.querySelector('.carousel-stage');

        carouselStage?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carouselStage?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextCard();
                } else {
                    prevCard();
                }
            }
            startAutoPlay();
        }, { passive: true });

        // Pause on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        carouselWrapper?.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper?.addEventListener('mouseleave', startAutoPlay);

        // Handle filter changes - update visible cards
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Filter cards based on category
                if (filter === 'all') {
                    visibleCards = [...allCards];
                } else {
                    visibleCards = allCards.filter(card => card.dataset.category === filter);
                }

                // Update indicator count dynamically
                indicators.forEach((indicator, i) => {
                    indicator.style.display = i < visibleCards.length ? 'block' : 'none';
                });

                // Reset to first card
                currentIndex = 0;

                // Hide non-visible cards, show visible ones
                allCards.forEach(card => {
                    if (visibleCards.includes(card)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Reposition visible cards
                positionCards(currentIndex);
            });
        });

        // Card button click handler
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const folderName = btn.dataset.folder;
                if (folderName) {
                    window.location.href = `gallery-detail.html?folder=${encodeURIComponent(folderName)}`;
                }
            });
        });

        // Initial positioning
        positionCards(0);

        // Start auto-play after a delay
        setTimeout(startAutoPlay, 2000);
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    }

    handleCTAClick(e) {
        const button = e.currentTarget;

        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Handle navigation
        if (button.textContent.includes('Explore')) {
            const gallery = document.querySelector('#gallery');
            if (gallery) {
                this.smoothScrollTo(gallery);
            }
        }
    }

    handleGalleryItemClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const folderName = button.dataset.folder;

        if (folderName) {
            // Navigate to gallery detail page with folder parameter
            window.location.href = `gallery-detail.html?folder=${encodeURIComponent(folderName)}`;
        }
    }

    startAnimations() {
        // Start hero animations after loading
        document.querySelectorAll('.title-char').forEach((char, index) => {
            char.style.animationDelay = `${0.1 + (index * 0.05)}s`;
        });
    }

    handleResize() {
        // Handle responsive changes
        if (window.innerWidth <= 768) {
            document.querySelector('.cursor')?.style.setProperty('display', 'none');
            document.querySelector('.cursor-follower')?.style.setProperty('display', 'none');
        } else {
            document.querySelector('.cursor')?.style.setProperty('display', 'block');
            document.querySelector('.cursor-follower')?.style.setProperty('display', 'block');
        }
    }
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    new ModernWebsite();
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page loaded in ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    });
}