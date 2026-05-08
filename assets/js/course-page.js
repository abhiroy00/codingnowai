// Enhanced Course Page JavaScript - All Features Included
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. BLOG SCROLLER - INFINITE LOOP
    // ============================================
    const initBlogScroller = () => {
        const blogScroller = document.getElementById('blog-scroller');
        const blogGridNew = document.getElementById('blogGridNew');
        const prevBtn = document.querySelector('.blog-scroll-btn.prev');
        const nextBtn = document.querySelector('.blog-scroll-btn.next');
        
        if (!blogScroller || !blogGridNew) return;
        
        // Move blog cards from blogGridNew to blog-scroller if present
        const cards = Array.from(blogGridNew.querySelectorAll('.card'));
        if (cards.length === 0) return;
        
        // Clear blogGridNew and move cards to blog-scroller
        blogGridNew.innerHTML = '';
        cards.forEach(card => blogScroller.appendChild(card));
        blogScroller.style.display = 'flex';
        blogScroller.classList.add('blog-scroller');
        
        const originalBlogCards = Array.from(blogScroller.querySelectorAll('.card'));
        const cardCount = originalBlogCards.length;
        
        if (cardCount === 0) return;
        
        // Duplicate all cards for seamless scrolling
        originalBlogCards.forEach(card => {
            const clone = card.cloneNode(true);
            blogScroller.appendChild(clone);
        });
        
        function getBlogCardWidth() {
            const blogCard = blogScroller.querySelector('.card');
            if (!blogCard) return blogScroller.clientWidth;
            const gap = parseFloat(getComputedStyle(blogScroller).gap) || 20;
            return Math.round(blogCard.offsetWidth + gap);
        }
        
        let currentIndex = 0;
        let isTransitioning = false;
        
        function scrollToCard(index, smooth = true) {
            if (isTransitioning) return;
            
            const cardWidth = getBlogCardWidth();
            const targetScroll = index * cardWidth;
            
            if (smooth) {
                isTransitioning = true;
                blogScroller.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    isTransitioning = false;
                }, 300);
            } else {
                blogScroller.scrollLeft = targetScroll;
            }
            
            currentIndex = index;
        }
        
        function nextCard() {
            currentIndex++;
            const totalCards = cardCount * 2;
            
            if (currentIndex >= cardCount) {
                setTimeout(() => {
                    blogScroller.style.scrollBehavior = 'auto';
                    currentIndex = currentIndex - cardCount;
                    scrollToCard(currentIndex, false);
                    blogScroller.style.scrollBehavior = 'smooth';
                }, 300);
            }
            
            scrollToCard(currentIndex);
        }
        
        function prevCard() {
            currentIndex--;
            
            if (currentIndex < 0) {
                currentIndex = cardCount - 1;
                setTimeout(() => {
                    blogScroller.style.scrollBehavior = 'auto';
                    scrollToCard(cardCount + currentIndex, false);
                    blogScroller.style.scrollBehavior = 'smooth';
                }, 300);
            }
            
            scrollToCard(currentIndex);
        }
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevCard();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextCard();
            });
        }
        
        // Keyboard navigation
        blogScroller.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextCard();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevCard();
            }
        });
        
        // Touch/drag support
        let isDragging = false;
        let startX;
        let startScrollLeft;
        let dragThreshold = 50;
        
        blogScroller.addEventListener('pointerdown', (e) => {
            isDragging = true;
            blogScroller.setPointerCapture(e.pointerId);
            startX = e.clientX;
            startScrollLeft = blogScroller.scrollLeft;
            blogScroller.style.cursor = 'grabbing';
        });
        
        blogScroller.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            blogScroller.scrollLeft = startScrollLeft - dx;
        });
        
        blogScroller.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            blogScroller.releasePointerCapture(e.pointerId);
            blogScroller.style.cursor = '';
            
            const dx = e.clientX - startX;
            if (Math.abs(dx) > dragThreshold) {
                if (dx > 0) {
                    prevCard();
                } else {
                    nextCard();
                }
            } else {
                scrollToCard(currentIndex);
            }
        });
        
        ['pointerleave', 'pointercancel'].forEach(ev => {
            blogScroller.addEventListener(ev, (e) => {
                if (isDragging) {
                    isDragging = false;
                    if (blogScroller.releasePointerCapture) blogScroller.releasePointerCapture(e.pointerId);
                    blogScroller.style.cursor = '';
                    scrollToCard(currentIndex);
                }
            });
        });
        
        blogScroller.style.scrollBehavior = 'smooth';
        
        // Autoplay functionality
        let autoplayInterval = null;
        const autoplayDelay = 4500;
        
        function startAutoplay() {
            if (autoplayInterval) return;
            autoplayInterval = setInterval(() => {
                nextCard();
            }, autoplayDelay);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }
        
        blogScroller.addEventListener('mouseenter', stopAutoplay);
        blogScroller.addEventListener('focusin', stopAutoplay);
        blogScroller.addEventListener('pointerdown', stopAutoplay);
        blogScroller.addEventListener('mouseleave', startAutoplay);
        blogScroller.addEventListener('focusout', startAutoplay);
        
        startAutoplay();
    };
    
    // ============================================
    // 2. FANCYBOX INITIALIZATION
    // ============================================
    const initFancyBox = () => {
        if (typeof jQuery !== 'undefined' && jQuery.fn.fancybox) {
            jQuery('[data-fancybox]').fancybox({
                padding: 0,
                width: '100%',
                type: 'iframe',
                helpers: {
                    overlay: { locked: false }
                }
            });
        }
    };
    
    // ============================================
    // 3. ROADMAP CAROUSEL
    // ============================================
    const initRoadmapCarousel = () => {
        let currentStep = 0;
        const slides = document.querySelectorAll('.roadmap-slide');
        const totalSteps = slides.length;
        const prevBtn = document.querySelector('.roadmap-prev');
        const nextBtn = document.querySelector('.roadmap-next');
        const currentCounter = document.querySelector('.roadmap-current');
        
        if (!slides.length) return;
        
        const updateArrowStates = () => {
            if (prevBtn) {
                prevBtn.disabled = currentStep === 0;
                prevBtn.classList.toggle('disabled', currentStep === 0);
            }
            if (nextBtn) {
                nextBtn.disabled = currentStep === totalSteps - 1;
                nextBtn.classList.toggle('disabled', currentStep === totalSteps - 1);
            }
        };
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('hidden', i !== index);
            });
            if (currentCounter) currentCounter.textContent = index + 1;
            currentStep = index;
            updateArrowStates();
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) showSlide(currentStep - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep < totalSteps - 1) showSlide(currentStep + 1);
            });
        }
        
        showSlide(0);
    };
    
    // ============================================
    // 4. TESTIMONIALS CAROUSEL
    // ============================================
    const initTestimonials = () => {
        let currentTestimonial = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const totalTestimonials = slides.length;
        const prevBtn = document.querySelector('.testimonial-prev-btn');
        const nextBtn = document.querySelector('.testimonial-next-btn');
        
        if (!slides.length) return;
        
        const showTestimonial = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            currentTestimonial = index;
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showTestimonial((currentTestimonial - 1 + totalTestimonials) % totalTestimonials);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showTestimonial((currentTestimonial + 1) % totalTestimonials);
            });
        }
        
        showTestimonial(0);
    };
    
    // ============================================
    // 5. SMOOTH SCROLL ANCHORS
    // ============================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#0' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };
    
    // ============================================
    // 6. IMAGE LAZY LOADING
    // ============================================
    const initLazyLoading = () => {
        document.querySelectorAll('img.lazy').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            }
        });
        
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    };
    
    // ============================================
    // 7. STICKY MENU HIGHLIGHTING
    // ============================================
    const initStickyMenu = () => {
        const sectionLinks = document.querySelectorAll('.sticky-section-menu a');
        const sections = document.querySelectorAll('section[id]');
        
        if (!sectionLinks.length || !sections.length) return;
        
        const updateActiveLink = () => {
            let currentSection = '';
            const scrollPosition = window.scrollY + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            sectionLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    };
    
    // ============================================
    // 8. ACCORDION FUNCTIONALITY
    // ============================================
    const initAccordions = () => {
        // Module accordions
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                const item = this.closest('.accordion-item');
                const content = item.querySelector('.accordion-content');
                const isExpanded = item.classList.contains('expanded');
                
                // Close all other items (optional, uncomment for single-open)
                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('expanded')) {
                        otherItem.classList.remove('expanded');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) otherContent.style.maxHeight = '0';
                    }
                });
                
                if (isExpanded) {
                    item.classList.remove('expanded');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('expanded');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
        
        // Lesson accordions
        document.querySelectorAll('.lesson-header').forEach(header => {
            header.addEventListener('click', function() {
                const item = this.closest('.lesson-item');
                const content = item.querySelector('.lesson-content');
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    item.classList.remove('expanded');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('expanded');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    };
    
    // ============================================
    // 9. FAQ ACCORDION
    // ============================================
    const initFAQ = () => {
        document.querySelectorAll('.faq-q').forEach(button => {
            button.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-a');
                const isActive = answer.style.display === 'block';
                
                // Close all other FAQs
                document.querySelectorAll('.faq-a').forEach(otherAnswer => {
                    otherAnswer.style.display = 'none';
                });
                document.querySelectorAll('.faq-q span').forEach(span => {
                    span.textContent = '▾';
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    answer.style.display = 'block';
                    this.querySelector('span').textContent = '▴';
                }
            });
        });
    };
    
    // ============================================
    // 10. COURSE SUPPORT TABS
    // ============================================
    const initCourseSupportTabs = () => {
        const tabButtons = document.querySelectorAll('.course-support-tab');
        const tabPanels = document.querySelectorAll('.course-support-panel');
        
        if (!tabButtons.length || !tabPanels.length) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(panel => {
                    panel.style.display = 'none';
                    panel.setAttribute('aria-hidden', 'true');
                });
                
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                const activePanel = document.querySelector(`.course-support-panel[data-panel="${tabName}"]`);
                if (activePanel) {
                    activePanel.style.display = 'block';
                    activePanel.setAttribute('aria-hidden', 'false');
                }
            });
        });
    };
    
    // ============================================
    // 11. PRICING TABS
    // ============================================
    const initPricingTabs = () => {
        const tabButtons = document.querySelectorAll('.pricing-tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel[data-mode]');
        
        if (!tabButtons.length || !tabPanels.length) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                
                tabPanels.forEach(panel => {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.setAttribute('hidden', '');
                    panel.style.display = 'none';
                });
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                const activePanel = document.querySelector(`.tab-panel[data-mode="${mode}"]`);
                if (activePanel) {
                    activePanel.removeAttribute('aria-hidden');
                    activePanel.removeAttribute('hidden');
                    activePanel.style.display = 'block';
                    activePanel.setAttribute('aria-hidden', 'false');
                }
                
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
            });
        });
    };
    
    // ============================================
    // 12. INSTRUCTORS CAROUSEL - INFINITE SCROLL
    // ============================================
    const initInstructorsCarousel = () => {
        const wrapper = document.querySelector('.instructors-carousel-wrapper');
        const scrollContainer = document.querySelector('.instructors-scroll-container');
        const track = document.querySelector('.instructors-carousel-track');
        const cards = document.querySelectorAll('.instructor-card-item');
        const prevBtn = document.querySelector('.instructor-carousel-prev');
        const nextBtn = document.querySelector('.instructor-carousel-next');
        
        if (!track || !cards.length || !scrollContainer) return;
        
        let CARD_WIDTH = 240;
        let GAP = 20;
        const VISIBLE_CARDS = 3;
        const SCROLL_INTERVAL = 5000;
        const ANIMATION_DURATION = 600;
        const TOTAL_ORIGINAL_CARDS = cards.length;
        
        let currentIndex = 0;
        let autoScrollInterval;
        let isAutoScrolling = true;
        let isScrolling = false;
        
        const calculateDimensions = () => {
            if (window.innerWidth <= 600) {
                CARD_WIDTH = 130;
                GAP = 14;
            } else if (window.innerWidth <= 768) {
                CARD_WIDTH = 145;
                GAP = 16;
            } else if (window.innerWidth <= 992) {
                CARD_WIDTH = 175;
                GAP = 18;
            } else if (window.innerWidth <= 1200) {
                CARD_WIDTH = 210;
                GAP = 20;
            } else {
                CARD_WIDTH = 240;
                GAP = 20;
            }
        };
        
        const updateCarouselPosition = (index, animated = true) => {
            if (isScrolling) return;
            isScrolling = true;
            calculateDimensions();
            
            const CARD_WITH_GAP = CARD_WIDTH + GAP;
            const containerWidth = scrollContainer.offsetWidth;
            const visibleWidth = (CARD_WIDTH * VISIBLE_CARDS) + (GAP * (VISIBLE_CARDS - 1));
            const centerOffset = (containerWidth - visibleWidth) / 2;
            const offset = centerOffset - (index * CARD_WITH_GAP);
            
            if (animated) {
                track.classList.remove('no-transition');
            } else {
                track.classList.add('no-transition');
            }
            
            track.style.transform = `translateX(${offset}px)`;
            
            setTimeout(() => {
                isScrolling = false;
            }, animated ? ANIMATION_DURATION : 0);
        };
        
        const scrollToNext = () => {
            currentIndex++;
            updateCarouselPosition(currentIndex, true);
            
            if (currentIndex >= TOTAL_ORIGINAL_CARDS) {
                setTimeout(() => {
                    track.classList.add('no-transition');
                    updateCarouselPosition(0, false);
                    currentIndex = 0;
                    setTimeout(() => {
                        track.classList.remove('no-transition');
                    }, 10);
                }, ANIMATION_DURATION);
            }
        };
        
        const scrollToPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition(currentIndex, true);
            }
        };
        
        const startAutoScroll = () => {
            if (!isAutoScrolling || autoScrollInterval) return;
            autoScrollInterval = setInterval(scrollToNext, SCROLL_INTERVAL);
        };
        
        const stopAutoScroll = () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        };
        
        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopAutoScroll);
            wrapper.addEventListener('mouseleave', startAutoScroll);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoScroll();
                scrollToPrev();
                setTimeout(startAutoScroll, ANIMATION_DURATION + 500);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoScroll();
                scrollToNext();
                setTimeout(startAutoScroll, ANIMATION_DURATION + 500);
            });
        }
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                calculateDimensions();
                updateCarouselPosition(currentIndex, false);
            }, 250);
        });
        
        calculateDimensions();
        updateCarouselPosition(0, false);
        startAutoScroll();
    };
    
    // ============================================
    // 13. READ MORE FUNCTIONALITY
    // ============================================
    const initReadMore = () => {
        const paragraph = document.getElementById('courseOverview');
        const button = document.getElementById('toggleOverview');
        
        if (!paragraph || !button) return;
        
        const MAX_CHARS = 720;
        const fullHTML = paragraph.innerHTML;
        const fullText = paragraph.textContent;
        let isExpanded = false;
        
        if (fullText.length > MAX_CHARS) {
            paragraph.setAttribute('data-full-html', fullHTML);
            paragraph.innerHTML = fullText.substring(0, MAX_CHARS) + '...';
            button.style.display = 'inline-flex';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    paragraph.innerHTML = fullHTML;
                    button.textContent = 'Read less';
                } else {
                    paragraph.innerHTML = fullText.substring(0, MAX_CHARS) + '...';
                    button.textContent = 'Read more';
                }
            });
        }
    };
    
    // ============================================
    // 14. RESPONSIVE ASIDE REPOSITIONING
    // ============================================
    // const initResponsiveAside = () => {
    //     const pricingAside = document.querySelector('.course-body .aside');
    //     const corporateSection = document.querySelector('#highlights');
    //     if (!pricingAside || !corporateSection) return;
        
    //     const originalParent = pricingAside.parentNode;
    //     const originalNextSibling = pricingAside.nextElementSibling;
    //     const corporateParent = corporateSection.parentNode;
    //     const breakpoint = 992;
        
    //     function positionPricing() {
    //         if (window.innerWidth < breakpoint) {
    //             if (pricingAside.parentNode !== corporateParent) {
    //                 corporateParent.insertBefore(pricingAside, corporateSection);
    //             }
    //         } else if (pricingAside.parentNode !== originalParent) {
    //             if (originalNextSibling) {
    //                 originalParent.insertBefore(pricingAside, originalNextSibling);
    //             } else {
    //                 originalParent.appendChild(pricingAside);
    //             }
    //         }
    //     }
        
    //     positionPricing();
    //     window.addEventListener('resize', positionPricing);
    // };
    
    // ============================================
    // 15. MODULE TITLE COLOR MANAGEMENT
    // ============================================
    const manageModuleTitleColors = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        function updateTitleColor(item) {
            const title = item.querySelector('.module-title');
            if (!title) return;
            title.style.color = item.classList.contains('expanded') ? 'white' : 'black';
        }
        
        accordionItems.forEach(item => updateTitleColor(item));
        
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const parentItem = this.closest('.accordion-item');
                if (!parentItem) return;
                updateTitleColor(parentItem);
            });
        });
    };
    
    // ============================================
    // MASTER INITIALIZATION
    // ============================================
    const initializeAll = () => {
        console.log('🚀 Initializing all course page components...');
        
        initBlogScroller();
        initFancyBox();
        initRoadmapCarousel();
        initTestimonials();
        initSmoothScroll();
        initLazyLoading();
        initStickyMenu();
        initAccordions();
        initFAQ();
        initCourseSupportTabs();
        initPricingTabs();
        initInstructorsCarousel();
        initReadMore();
        // initResponsiveAside();
        manageModuleTitleColors();
        
        console.log('✅ All components initialized successfully!');
    };
    
    initializeAll();
});