document.addEventListener('DOMContentLoaded', function() {
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Get all elements that need to fade in
    const fadeElements = document.querySelectorAll('.section-title, .cronologia-title, .text-column, .text-columns, h1, h2, .scroll-container, .footer-text, .timeline-item, .playlist-title, .playlist-subtitle, .spotify-embed');
    
    // Enhanced fade-in animation with FASTER staggered timing
    fadeElements.forEach((element, index) => {
        // Reduced delay for faster animations
        element.style.transitionDelay = (index * 0.02) + 's';
        
        // Initial check for elements in viewport
        if (isInViewport(element)) {
            element.classList.add('fade-in');
        }
    });
    
    // Improved scroll effect with FASTER transitions
    window.addEventListener('scroll', function() {
        fadeElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('fade-in')) {
                element.classList.add('fade-in');
            }
        });
    });
    
    // Handle timeline items hover effect with enhanced transitions
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Extract data for the timeline items
    const timelineData = [
        { year: "Portugal Rural", description: "No campo, o ritmo é ditado pela natureza — a cadência dos gestos, os cânticos de trabalho e as frases partilhadas marcam o tempo das colheitas e da entreajuda." },
        { year: "1A força da comunidade", description: "Com o tempo, os gestos e os cantares transformam-se em memória viva — surgem os ranchos folclóricos, onde se celebra o quotidiano de ontem com orgulho e pertença." },
        { year: "1974", description: "Revolução" },
        { year: "1980", description: "Modernização" },
        { year: "A força da comunidade", description: "Com o tempo, os gestos e os cantares transformam-se em memória viva — surgem os ranchos folclóricos, onde se celebra o quotidiano de ontem com orgulho e pertença." },
        { year: "2005", description: "Fusão" },
        { year: "2010", description: "Renascimento" },
        { year: "Tradição reinventada", description: "Hoje, as festas da aldeia e os Santos Populares revivem essa herança — onde o cheiro a sardinha, os arcos de papel e a música popular juntam gerações em torno da tradição." },
        { year: "2018", description: "Reconhecimento" },
        { year: "2020", description: "Transformação Digital" },
        { year: "Uma cultura que resiste", description: "Entre a memória e a festa, o passado ecoa no presente — e os sons da ruralidade continuam a dançar nos corações de quem canta, celebra e nunca esquece." },
        { year: "Hoje", description: "Legado" },
        { year: "Futuro", description: "Inovação" }
    ];
    
    // Smooth scrolling for timeline
    const timelineScroll = document.querySelector('.timeline-scroll');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    if (timelineScroll) {
        // Remove text content from timeline items
        const timelineItemContents = document.querySelectorAll('.timeline-item .item-content');
        timelineItemContents.forEach(itemContent => {
            itemContent.style.display = 'none';
        });
        
        // Create timeline tracker if it doesn't exist
        createTimelineTracker();
        
        // When reaching the end of the timeline, scroll to the beginning
        timelineScroll.addEventListener('scroll', function() {
            // Check if we've reached the end
            const maxScrollLeft = timelineScroll.scrollWidth - timelineScroll.clientWidth;
            
            // If we've reached the end, show visual indication (optional)
            if (Math.ceil(timelineScroll.scrollLeft) >= maxScrollLeft - 5) {
                // You can add a visual indication here if needed
                timelineScroll.classList.add('scroll-end');
            } else {
                timelineScroll.classList.remove('scroll-end');
            }
            
            // Update the timeline tracker position and subtitle
            updateTimelineTracker();
        });
        
        // Mouse events for desktop
        timelineScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            timelineScroll.style.cursor = 'grabbing';
            startX = e.pageX - timelineScroll.offsetLeft;
            scrollLeft = timelineScroll.scrollLeft;
        });
        
        timelineScroll.addEventListener('mouseleave', () => {
            isDown = false;
            timelineScroll.style.cursor = 'grab';
        });
        
        timelineScroll.addEventListener('mouseup', () => {
            isDown = false;
            timelineScroll.style.cursor = 'grab';
        });
        
        timelineScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineScroll.offsetLeft;
            // Increased scroll speed from 2 to 3 for faster scrolling
            const walk = (x - startX) * 3; 
            timelineScroll.scrollLeft = scrollLeft - walk;
        });
        
        // Add alternative navigation for timeline with keyboard
        document.addEventListener('keydown', function(e) {
            if (!timelineScroll) return;
            
            // Get the maximum scroll position
            const maxScrollLeft = timelineScroll.scrollWidth - timelineScroll.clientWidth;
            
            if (e.key === 'ArrowRight') {
                // Calculate new position
                const scrollDistance = (timelineItems[0].offsetWidth + 30) * 1.5;
                const newPosition = timelineScroll.scrollLeft + scrollDistance;
                
                // Limit scrolling to the end
                const limitedPosition = Math.min(newPosition, maxScrollLeft);
                
                // Scroll with animation
                timelineScroll.scrollBy({
                    left: limitedPosition - timelineScroll.scrollLeft,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowLeft') {
                // Calculate new position
                const scrollDistance = (timelineItems[0].offsetWidth + 30) * 1.5;
                const newPosition = timelineScroll.scrollLeft - scrollDistance;
                
                // Limit scrolling to the beginning (cannot go below 0)
                const limitedPosition = Math.max(newPosition, 0);
                
                // Scroll with animation
                timelineScroll.scrollBy({
                    left: limitedPosition - timelineScroll.scrollLeft,
                    behavior: 'smooth'
                });
            }
        });
        
        // Set initial grab cursor for timeline
        timelineScroll.style.cursor = 'grab';
        
        // Initialize the timeline tracker on load
        updateTimelineTracker();
    }
    
    // Function to create the timeline tracker
    function createTimelineTracker() {
        const timelineWrapper = document.querySelector('.timeline-wrapper');
        
        // Create the tracker container if it doesn't exist
        if (!document.querySelector('.timeline-tracker-container')) {
            const trackerContainer = document.createElement('div');
            trackerContainer.className = 'timeline-tracker-container fade-in';
            
            // Create the tracker line
            const trackerLine = document.createElement('div');
            trackerLine.className = 'timeline-tracker-line';
            trackerContainer.appendChild(trackerLine);
            
            // Create the tracker indicator
            const trackerIndicator = document.createElement('div');
            trackerIndicator.className = 'timeline-tracker-indicator';
            trackerLine.appendChild(trackerIndicator);
            
            // Create the subtitle display
            const subtitleDisplay = document.createElement('div');
            subtitleDisplay.className = 'timeline-subtitle';
            subtitleDisplay.innerHTML = '<span>Origem da MPP</span>';
            trackerContainer.appendChild(subtitleDisplay);
            
            // Add the tracker container to the timeline wrapper
            timelineWrapper.appendChild(trackerContainer);
        }
    }
    
    // Function to update the timeline tracker position and subtitle
    function updateTimelineTracker() {
        const timelineScroll = document.querySelector('.timeline-scroll');
        const trackerIndicator = document.querySelector('.timeline-tracker-indicator');
        const subtitleDisplay = document.querySelector('.timeline-subtitle span');
        
        if (!timelineScroll || !trackerIndicator || !subtitleDisplay) return;
        
        // Calculate the progress percentage
        const maxScroll = timelineScroll.scrollWidth - timelineScroll.clientWidth;
        const currentScroll = timelineScroll.scrollLeft;
        const scrollPercentage = (currentScroll / maxScroll) * 100;
        
        // Update the tracker position
        trackerIndicator.style.left = `${scrollPercentage}%`;
        
        // Get all timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Calculate which item is most visible in the viewport
        let mostVisibleItemIndex = 0;
        let maxVisibleArea = 0;
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const containerRect = timelineScroll.getBoundingClientRect();
            
            // Calculate how much of the item is visible
            const visibleLeft = Math.max(rect.left, containerRect.left);
            const visibleRight = Math.min(rect.right, containerRect.right);
            const visibleWidth = Math.max(0, visibleRight - visibleLeft);
            
            if (visibleWidth > maxVisibleArea) {
                maxVisibleArea = visibleWidth;
                mostVisibleItemIndex = index;
            }
        });
        
        // Update the subtitle using the timelineData array
        if (timelineData[mostVisibleItemIndex]) {
            const { year, description } = timelineData[mostVisibleItemIndex];
            
            // Add transition effect
            subtitleDisplay.classList.add('changing');
            
            // Update text after a short delay to allow fade-out
            setTimeout(() => {
                subtitleDisplay.textContent = `${year}: ${description}`;
                subtitleDisplay.classList.remove('changing');
            }, 150);
        }
    }
    
    // Scroll-triggered animation enhancements
    window.addEventListener('scroll', function() {
        // Add parallax effect to backgrounds
        const scrollPosition = window.scrollY;
        
        // Enhanced fade effect for better scroll experience
        fadeElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementPosition = rect.top + window.scrollY;
            const distanceFromTop = elementPosition - scrollPosition;
            
            // More advanced fade-in logic based on scroll position
            if (distanceFromTop < window.innerHeight * 0.8) {
                // Decreased delay for faster animations
                const delay = index * 0.01; 
                setTimeout(() => {
                    element.classList.add('fade-in');
                }, delay * 1000);
            }
        });
    });
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll for page anchors
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Responsive navigation toggle if needed
    const addResponsiveNav = () => {
        const navToggle = document.createElement('button');
        navToggle.classList.add('nav-toggle');
        navToggle.innerHTML = '☰';
        
        const nav = document.querySelector('.nav-links');
        nav.parentNode.insertBefore(navToggle, nav);
        
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    };
    
    // Only add responsive nav for small screens
    if (window.innerWidth <= 768) {
        addResponsiveNav();
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    const titleContainer = document.querySelector('.title-container');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < window.innerHeight) {
            // Create parallax effect on scroll
            if (titleContainer) {
                titleContainer.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            }
            if (heroSection) {
                heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        }
        
        // Back to top button visibility
        const backToTopButton = document.querySelector('.back-to-top');
        if (backToTopButton) {
            if (scrollPosition > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    });
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});