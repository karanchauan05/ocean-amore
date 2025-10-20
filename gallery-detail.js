// Gallery Detail Page JavaScript

class GalleryDetail {
    constructor() {
        this.init();
        this.setupCustomCursor();
        this.loadGalleryImages();
    }

    init() {
        // Get folder name from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.folderName = urlParams.get('folder');
        
        if (!this.folderName) {
            // Redirect back to main gallery if no folder specified
            window.location.href = 'index.html#gallery';
            return;
        }
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

        const updateCursor = () => {
            if (!isMoving) return;
            
            orchidCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            
            trailX += (cursorX - trailX) * 0.08;
            trailY += (cursorY - trailY) * 0.08;
            cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
            
            if (Math.abs(cursorX - trailX) < 1 && Math.abs(cursorY - trailY) < 1) {
                isMoving = false;
            } else {
                requestAnimationFrame(updateCursor);
            }
        };

        let mouseMoveTimeout;
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateCursor);
            }
            
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                isMoving = false;
            }, 100);
        });

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .detail-image');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                orchidCursor.classList.add('hover');
                cursorTrail.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                orchidCursor.classList.remove('hover');
                cursorTrail.classList.remove('hover');
            });
        });
    }

    loadGalleryImages() {
        // Define category information and actual image names for each folder
        const categoryData = {
            'keychain': {
                title: 'Custom Keychains',
                description: 'Personalized resin keychains with your precious memories',
                images: [
                    '1keychain ocean.jpg',
                    '2keychain amore.jpg',
                    'keychain bunch 1.jpg',
                    'keychain bunch 2.jpg',
                    'keychain k1.jpg',
                    'keychain k2.jpg',
                    'keychain riya.jpg',
                    'keychain s.jpg',
                    'keychain t.jpg'
                ]
            },
            'pendant 1': {
                title: 'Resin Pendants',
                description: 'Beautiful and unique resin pendants for every occasion',
                images: [
                    'pendant bunch 1.jpg',
                    'pendant bunch 2.jpg',
                    'pendant combo 1.jpg',
                    'pendant combo 2.jpg',
                    'pendant white.jpg',
                    'pendant.png'
                ]
            },
            'phone case 1': {
                title: 'Phone Cases',
                description: 'Protective and stylish custom resin phone cases',
                images: [
                    'clear case 1.JPG',
                    'clear case 2.JPG',
                    'phone case same.png',
                    'purple case 2.JPG',
                    'purple case.JPG'
                ]
            },
            'photo frame': {
                title: 'Photo Frames',
                description: 'Preserve your memories in beautiful resin frames',
                images: [
                    'bookmark.jpg',
                    'box.jpg',
                    'photoframe.JPG',
                    'smol art.jpg'
                ]
            },
            'tray and coaster': {
                title: 'Trays & Coasters',
                description: 'Functional art pieces for your home',
                images: [
                    'blue bowl.jpg',
                    'coaster set 1.jpg',
                    'combo 1.jpg',
                    'combo 2.jpg',
                    'red tray.jpg',
                    'tray 1.JPG',
                    'tray 2.JPG',
                    'tray combo.JPG'
                ]
            },
            'wall art': {
                title: 'Wall Art',
                description: 'Stunning resin wall art pieces',
                images: [
                    'clocl and ocean art combo.JPG',
                    'mantra and wall art 1.JPG',
                    'mantra and wall art 2.JPG',
                    'mantra and wall art 3.JPG',
                    'mantra and wall art 4.JPG',
                    'mantra and wall art.JPG',
                    'mantra tablet 2.JPG',
                    'mantra tablet 3.JPG',
                    'mantra tablet 5.JPG',
                    'mantra tablet 6.JPG',
                    'mantra tablet.JPG',
                    'name plate.JPG',
                    'ocean art 1.JPG',
                    'ocean art 2.JPG',
                    'ocean art 3.JPG',
                    'ocean art 4.JPG'
                ]
            },
            'wall clock': {
                title: 'Wall Clocks',
                description: 'Functional timepieces with artistic flair',
                images: [
                    'abstract 1.JPG',
                    'abstract 2.JPG',
                    'black 1.JPG',
                    'black 2.JPG',
                    'blue gold 1.JPG',
                    'blue gold 2.JPG',
                    'blue white 1.jpg',
                    'blue white 2.jpg',
                    'blue white 3.jpg',
                    'blue white 4.jpg',
                    'blue white 5.jpg',
                    'cyan 1.JPG',
                    'cyan 2.JPG',
                    'cyan 3.JPG',
                    'gold white 1.JPG',
                    'gold white 2.JPG',
                    'gold white 3.JPG',
                    'grey gold 1.JPG',
                    'grey gold 2.JPG',
                    'night beach 1.JPG',
                    'night beach 2.JPG',
                    'ocean 1.JPG',
                    'ocean 2.JPG',
                    'ocean 3.JPG',
                    'ocean 4.JPG'
                ]
            }
        };

        const category = categoryData[this.folderName.toLowerCase()];
        
        if (!category) {
            console.error('Category not found:', this.folderName);
            window.location.href = 'index.html#gallery';
            return;
        }

        // Update page title and description
        document.getElementById('categoryTitle').textContent = category.title;
        document.getElementById('categoryDescription').textContent = category.description;
        document.title = `${category.title} - Ocean Amore by Dhara`;

        // Load images - if we have specific images listed, use them, otherwise try to detect
        if (category.images && category.images.length > 0) {
            this.displayImages(category.images);
        } else {
            this.loadImagesFromFolder();
        }
    }

    async loadImagesFromFolder() {
        // Common image extensions to look for
        const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        const images = [];

        // Since we can't directly read directory contents in the browser,
        // we'll try to load common image patterns and see which ones exist
        const commonPatterns = [
            // Try numbered patterns
            ...Array.from({length: 20}, (_, i) => `${i + 1}.jpg`),
            ...Array.from({length: 20}, (_, i) => `${i + 1}.jpeg`),
            ...Array.from({length: 20}, (_, i) => `${i + 1}.png`),
            
            // Try named patterns based on folder
            `${this.folderName}.jpg`,
            `${this.folderName}.jpeg`,
            `${this.folderName}.png`,
            `${this.folderName}_1.jpg`,
            `${this.folderName}_2.jpg`,
            `${this.folderName}_3.jpg`,
            
            // Try common naming patterns
            'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg',
            'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
            'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
            
            // For keychain folder, use the known images
            ...(this.folderName.toLowerCase() === 'keychain' ? [
                '1keychain ocean.jpg',
                '2keychain amore.jpg',
                'keychain bunch 1.jpg',
                'keychain bunch 2.jpg',
                'keychain k1.jpg',
                'keychain k2.jpg',
                'keychain riya.jpg',
                'keychain s.jpg',
                'keychain t.jpg'
            ] : [])
        ];

        // Test which images actually exist
        for (const imageName of commonPatterns) {
            try {
                const imagePath = `assets/${this.folderName}/${imageName}`;
                const exists = await this.checkImageExists(imagePath);
                if (exists && !images.includes(imageName)) {
                    images.push(imageName);
                }
            } catch (error) {
                // Image doesn't exist, continue
                continue;
            }
        }

        // If no images found, show placeholder
        if (images.length === 0) {
            this.displayImages([]);
        } else {
            this.displayImages(images);
        }
    }

    checkImageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
        });
    }

    displayImages(images) {
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = '';

        if (images.length === 0) {
            imageGrid.innerHTML = `
                <div class="no-images">
                    <p>Images coming soon...</p>
                    <p>Contact us for more information about this category.</p>
                </div>
            `;
            return;
        }

        images.forEach((imageName, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'detail-image-container';
            imageContainer.style.animationDelay = `${index * 0.1}s`;

            const imagePath = `assets/${this.folderName}/${imageName}`;

            imageContainer.innerHTML = `
                <div class="detail-image">
                    <img src="${imagePath}" alt="${imageName}" loading="lazy">
                    <div class="image-overlay">
                        <button class="zoom-btn" data-image-src="${imagePath}" data-image-alt="${imageName}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                                <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="2"/>
                                <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            imageGrid.appendChild(imageContainer);

            // Add click event listener to the zoom button
            const zoomBtn = imageContainer.querySelector('.zoom-btn');
            zoomBtn.addEventListener('click', () => {
                this.openImageModal(imagePath, imageName);
            });
        });

        // Add image modal functionality
        this.setupImageModal();
    }

    setupImageModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('imageModal')) {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-controls">
                        <button class="modal-close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                        <div class="zoom-controls">
                            <button class="zoom-in-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                                    <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="2"/>
                                    <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </button>
                            <button class="zoom-out-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                                    <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </button>
                            <button class="zoom-reset-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2"/>
                                    <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2"/>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2"/>
                                    <path d="M8 16H3v5" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="modal-image-container">
                        <img id="modalImage" src="" alt="" draggable="false">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add event listeners for modal controls
            const backdrop = modal.querySelector('.modal-backdrop');
            const closeBtn = modal.querySelector('.modal-close');
            const zoomInBtn = modal.querySelector('.zoom-in-btn');
            const zoomOutBtn = modal.querySelector('.zoom-out-btn');
            const zoomResetBtn = modal.querySelector('.zoom-reset-btn');
            const modalImage = modal.querySelector('#modalImage');
            
            // Initialize zoom variables
            this.currentZoom = 1;
            this.minZoom = 0.5;
            this.maxZoom = 3;
            this.zoomStep = 0.25;
            this.isDragging = false;
            this.dragStart = { x: 0, y: 0 };
            this.imagePosition = { x: 0, y: 0 };
            
            backdrop.addEventListener('click', () => {
                this.closeImageModal();
            });
            
            closeBtn.addEventListener('click', () => {
                this.closeImageModal();
            });

            zoomInBtn.addEventListener('click', () => {
                this.zoomImage(this.zoomStep);
            });

            zoomOutBtn.addEventListener('click', () => {
                this.zoomImage(-this.zoomStep);
            });

            zoomResetBtn.addEventListener('click', () => {
                this.resetZoom();
            });

            // Mouse wheel zoom
            modalImage.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomDelta = e.deltaY > 0 ? -this.zoomStep : this.zoomStep;
                this.zoomImage(zoomDelta);
            });

            // Drag functionality
            modalImage.addEventListener('mousedown', (e) => {
                if (this.currentZoom > 1) {
                    this.isDragging = true;
                    this.dragStart.x = e.clientX - this.imagePosition.x;
                    this.dragStart.y = e.clientY - this.imagePosition.y;
                    modalImage.style.cursor = 'grabbing';
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging && this.currentZoom > 1) {
                    this.imagePosition.x = e.clientX - this.dragStart.x;
                    this.imagePosition.y = e.clientY - this.dragStart.y;
                    this.updateImageTransform();
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    modalImage.style.cursor = this.currentZoom > 1 ? 'grab' : 'default';
                }
            });

            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeImageModal();
                }
            });
        }
    }

    openImageModal(imageSrc, altText) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        
        modalImage.src = imageSrc;
        modalImage.alt = altText;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset zoom and position
        this.resetZoom();
    }

    closeImageModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset zoom and position
        this.resetZoom();
    }

    zoomImage(delta) {
        const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.currentZoom + delta));
        
        if (newZoom !== this.currentZoom) {
            this.currentZoom = newZoom;
            this.updateImageTransform();
            
            const modalImage = document.getElementById('modalImage');
            modalImage.style.cursor = this.currentZoom > 1 ? 'grab' : 'default';
        }
    }

    resetZoom() {
        this.currentZoom = 1;
        this.imagePosition = { x: 0, y: 0 };
        this.updateImageTransform();
        
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.style.cursor = 'default';
        }
    }

    updateImageTransform() {
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.style.transform = `translate(${this.imagePosition.x}px, ${this.imagePosition.y}px) scale(${this.currentZoom})`;
        }
    }
}

// Make functions globally accessible
window.openImageModal = function(imageSrc, altText) {
    if (window.galleryDetail) {
        window.galleryDetail.openImageModal(imageSrc, altText);
    }
};

window.closeImageModal = function() {
    if (window.galleryDetail) {
        window.galleryDetail.closeImageModal();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryDetail = new GalleryDetail();
});

// Mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');

    navToggle?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});