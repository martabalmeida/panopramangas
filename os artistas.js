// os artistas.js - Updated version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    console.log("DOM loaded, initializing carousel");
    initCarousel();
    
    // Initialize audio with fixed functionality
    initAudio();
    
    // Standardize the navigation bar
    standardizeNavBar();
});

// Function to standardize the navigation bar
function standardizeNavBar() {
    const logoContainers = document.querySelectorAll('.overlay-logo, .logo');
    const logoLinks = document.querySelectorAll('.overlay-logo a, .logo a');
    const logoImages = document.querySelectorAll('.overlay-logo img, .logo img');
    
    // Set standard logo size and styles
    logoImages.forEach(img => {
        img.style.height = '40px';
        img.style.width = 'auto';
        img.style.transition = 'transform 0.3s ease';
    });
    
    // Set standard logo container styles
    logoContainers.forEach(container => {
        container.style.position = 'relative';
        container.style.zIndex = '1000';
    });
    
    // Set standard logo link behavior
    logoLinks.forEach(link => {
        link.style.display = 'block';
        link.style.textDecoration = 'none';
        link.style.transition = 'opacity 0.3s ease';
        
        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        });
    });
    
    console.log("Navigation bar standardized");
}

// Carousel functionality with looping feature
function initCarousel() {
    const carousel = document.querySelector('.album-carousel');
    const items = document.querySelectorAll('.album-item');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    
    console.log("Carousel elements:", {
        carousel: carousel,
        items: items.length,
        prevButton: prevButton,
        nextButton: nextButton
    });
    
    if (!carousel || !prevButton || !nextButton || items.length === 0) {
        console.error("Missing essential elements for carousel");
        return;
    }
    
    // Get dimensions with explicit calculation
    const itemWidth = items[0].offsetWidth;
    const itemGap = 40; // From CSS gap property
    
    // Set initial state
    let currentIndex = 0;
    const itemsPerPage = Math.min(3, items.length); // Visible items, max 3
    const totalItems = items.length;
    
    // Map to keep track of which original item each clone corresponds to
    const cloneToOriginalMap = new Map();
    
    // Clone items for infinite scroll
    function setupInfiniteCarousel() {
        // Clone first few items and append to the end
        const cloneCount = Math.min(itemsPerPage, totalItems);
        
        for (let i = 0; i < cloneCount; i++) {
            const clone = items[i].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.setAttribute('data-original-index', i); // Store the original index
            cloneToOriginalMap.set(clone, i); // Map this clone to its original
            carousel.appendChild(clone);
        }
        
        // Clone last few items and prepend to the beginning
        for (let i = totalItems - 1; i >= Math.max(0, totalItems - cloneCount); i--) {
            const clone = items[i].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.setAttribute('data-original-index', i); // Store the original index
            cloneToOriginalMap.set(clone, i); // Map this clone to its original
            carousel.insertBefore(clone, carousel.firstChild);
        }
        
        // Adjust initial position to start at first real item
        currentIndex = cloneCount;
        const translateX = currentIndex * (itemWidth + itemGap);
        carousel.style.transform = `translateX(-${translateX}px)`;
    }
    
    // Update carousel position with transition
    function updateCarousel(withTransition = true) {
        const translateX = currentIndex * (itemWidth + itemGap);
        
        if (withTransition) {
            carousel.style.transition = 'transform 0.5s ease';
        } else {
            carousel.style.transition = 'none';
        }
        
        console.log(`Moving carousel to index ${currentIndex}, translating by ${translateX}px`);
        carousel.style.transform = `translateX(-${translateX}px)`;
        
        // Update currentVisibleItems for audio management
        updateCurrentVisibleItems();
    }
    
    // Keep track of which items are currently visible in the viewport
    let currentVisibleItems = [];
    
    function updateCurrentVisibleItems() {
        const allItems = document.querySelectorAll('.album-item');
        currentVisibleItems = [];
        
        const viewportWidth = window.innerWidth;
        const carouselRect = carousel.getBoundingClientRect();
        const carouselLeft = carouselRect.left;
        
        allItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemLeft = itemRect.left;
            const itemRight = itemRect.right;
            
            // Check if item is visible in the viewport
            if (itemRight > carouselLeft && itemLeft < carouselLeft + viewportWidth) {
                let originalIndex;
                
                if (item.hasAttribute('data-clone')) {
                    originalIndex = parseInt(item.getAttribute('data-original-index'));
                } else {
                    originalIndex = index;
                }
                
                currentVisibleItems.push({
                    element: item,
                    originalIndex: originalIndex
                });
            }
        });
        
        console.log("Currently visible items:", currentVisibleItems);
    }
    
    // Handle transition end for infinite loop
    function handleTransitionEnd() {
        const cloneCount = Math.min(itemsPerPage, totalItems);
        
        // If we've moved past the last real item
        if (currentIndex >= totalItems + cloneCount) {
            // Jump to the first real items without transition
            currentIndex = cloneCount;
            updateCarousel(false);
        }
        
        // If we've moved before the first real item
        if (currentIndex < cloneCount) {
            // Jump to the last real items without transition
            currentIndex = totalItems;
            updateCarousel(false);
        }
    }
    
    // Use explicit click handlers
    function handlePrevClick(event) {
        console.log("Previous button clicked");
        event.preventDefault();
        event.stopPropagation();
        
        currentIndex--;
        updateCarousel();
    }
    
    function handleNextClick(event) {
        console.log("Next button clicked");
        event.preventDefault();
        event.stopPropagation();
        
        currentIndex++;
        updateCarousel();
    }
    
    // Add click event listeners
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    
    // Add transition end listener for infinite loop effect
    carousel.addEventListener('transitionend', handleTransitionEnd);
    
    // Enable touch swipe for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, false);
    
    carousel.addEventListener('touchmove', function(e) {
        touchEndX = e.touches[0].clientX;
    }, false);
    
    carousel.addEventListener('touchend', function() {
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left, go to next
            currentIndex++;
            updateCarousel();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right, go to previous
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Initialize infinite carousel
    setupInfiniteCarousel();
    updateCurrentVisibleItems(); // Initial calculation of visible items
    console.log("Infinite carousel initialized");
    
    // Add window resize listener to update visible items
    window.addEventListener('resize', updateCurrentVisibleItems);
}

// Audio functionality
function initAudio() {
    console.log("Initializing audio functionality");
    
    // Define audio tracks with specific start times for the middle 25 seconds
    const audioTracks = [
        { path: 'audio/Emanuel - Pimba pimba (mp3.mp3', startTime: 45, duration: 25 },
        { path: 'audio/Zum-Zum-Zum.mp3', startTime: 30, duration: 25 },
        { path: 'audio/Ágata - Sozinha (Official Video).mp3', startTime: 40, duration: 25 },
        { path: 'audio/Roberto Leal   Arrebita.mp3', startTime: 35, duration: 25 },
        { path: 'audio/Toy - És tão sensual (Art Track).mp3', startTime: 30, duration: 25 },
        { path: 'audio/Tonicha - Zumba Na Caneca.wmv.mp3', startTime: 30, duration: 25 },
        { path: 'audio/Ruth Marlene - Coisinha Sexy (Art Track).mp3', startTime: 30, duration: 25 },
        { path: 'audio/Quim Barreiros - O melhor dia para casar.mp3', startTime: 30, duration: 25 },
        { path: 'audio/Mónica Sintra - Afinal havia outra.mp3', startTime: 30, duration: 25 },
        { path: 'audio/24 Amores.mp3', startTime: 30, duration: 25 }
    ];
    
    // Create audio objects for each album
    const originalAlbumItems = document.querySelectorAll('.album-item:not([data-clone])');
    const albumAudios = [];
    
    // Create audio objects for each original album (not clones)
    originalAlbumItems.forEach((item, index) => {
        // Create audio element
        const audio = new Audio();
        
        // Add error handler
        audio.addEventListener('error', function(e) {
            console.error(`Error loading audio track ${index}:`, e);
        });
        
        // Check if we have a defined track for this index, otherwise use a placeholder
        if (index < audioTracks.length) {
            audio.src = audioTracks[index].path;
        } else {
            // Fallback to first track if no specific track defined
            audio.src = audioTracks[0].path;
        }
        
        // Create audio indicator if it doesn't exist
        let indicator = item.querySelector('.audio-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'audio-indicator';
            
            const span = document.createElement('span');
            indicator.appendChild(span);
            
            item.appendChild(indicator);
        }
        
        // Add to our collection
        albumAudios.push({
            element: audio,
            container: item,
            indicator: indicator,
            startTime: audioTracks[Math.min(index, audioTracks.length - 1)].startTime,
            duration: audioTracks[Math.min(index, audioTracks.length - 1)].duration,
            index: index // Store the index of the audio track
        });
    });
    
    // Get all album items including clones
    const allAlbumItems = document.querySelectorAll('.album-item');
    
    // Now add event listeners for all items (originals and clones)
    allAlbumItems.forEach((item) => {
        // Find which audio to play for this item
        let audioIndex = -1;
        
        if (item.hasAttribute('data-clone') && item.hasAttribute('data-original-index')) {
            // For clones, use the stored original index
            audioIndex = parseInt(item.getAttribute('data-original-index'));
        } else {
            // For original items, find their position among original items
            audioIndex = Array.from(originalAlbumItems).indexOf(item);
        }
        
        // Skip if we couldn't find the audio index
        if (audioIndex === -1 || audioIndex >= albumAudios.length) {
            return;
        }
        
        // Add event listeners using the correct audio index
        setupAudioEvents(item, albumAudios[audioIndex]);
    });
    
    // Helper function to set up audio events for an item
    function setupAudioEvents(item, audio) {
        // Handle pause all audio except the current one
        function pauseAllAudio(exceptElement) {
            albumAudios.forEach(audio => {
                if (audio.element !== exceptElement) {
                    fadeOutAudio(audio.element, audio.indicator);
                }
            });
        }
        
        // Fade out audio
        function fadeOutAudio(audioElement, indicator) {
            if (audioElement.paused) return;
            
            let volume = audioElement.volume;
            const fadeOut = setInterval(function() {
                if (volume > 0.1) {
                    volume -= 0.1;
                    audioElement.volume = volume;
                } else {
                    clearInterval(fadeOut);
                    audioElement.pause();
                    audioElement.currentTime = 0;
                    audioElement.volume = 0;
                    indicator.classList.remove('active');
                }
            }, 50);
        }
        
        // Mouse enter event - start playing
        item.addEventListener('mouseenter', function() {
            console.log(`Mouse entered album item ${audio.index}, starting audio`);
            
            // Pause any other playing audio
            pauseAllAudio(audio.element);
            
            // Set to start at specific time
            audio.element.currentTime = audio.startTime;
            
            // Start playing with fade in
            const playPromise = audio.element.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    audio.indicator.classList.add('active');
                    
                    // Activate the audio indicator on this specific item
                    const itemIndicator = item.querySelector('.audio-indicator');
                    if (itemIndicator) {
                        itemIndicator.classList.add('active');
                    }
                    
                    // Fade in
                    let volume = 0;
                    const fadeIn = setInterval(function() {
                        if (volume < 0.7) {
                            volume += 0.1;
                            audio.element.volume = volume;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                }).catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        });
        
        // Mouse leave event - stop playing
        item.addEventListener('mouseleave', function() {
            console.log(`Mouse left album item ${audio.index}, stopping audio`);
            fadeOutAudio(audio.element, audio.indicator);
            
            // Deactivate the audio indicator on this specific item
            const itemIndicator = item.querySelector('.audio-indicator');
            if (itemIndicator) {
                itemIndicator.classList.remove('active');
            }
        });
        
        // Add click event for mobile devices
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on navigation
            if (e.target.closest('.carousel-control')) {
                return;
            }
            
            console.log(`Album ${audio.index} clicked`);
            
            // If this audio is already playing, pause it
            if (!audio.element.paused) {
                fadeOutAudio(audio.element, audio.indicator);
                
                // Deactivate the audio indicator on this specific item
                const itemIndicator = item.querySelector('.audio-indicator');
                if (itemIndicator) {
                    itemIndicator.classList.remove('active');
                }
                
                return;
            }
            
            // Otherwise, play this audio and pause others
            pauseAllAudio(audio.element);
            
            // Set to start at specific time
            audio.element.currentTime = audio.startTime;
            
            // Play this audio
            const playPromise = audio.element.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audio.indicator.classList.add('active');
                    
                    // Activate the audio indicator on this specific item
                    const itemIndicator = item.querySelector('.audio-indicator');
                    if (itemIndicator) {
                        itemIndicator.classList.add('active');
                    }
                    
                    // Fade in audio
                    let volume = 0;
                    const fadeIn = setInterval(function() {
                        if (volume < 0.7) {
                            volume += 0.1;
                            audio.element.volume = volume;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                }).catch(error => console.log("Audio play failed:", error));
            }
        });
        
        // Add play button click event
        const playButton = item.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering container click
                
                console.log(`Play button for album ${audio.index} clicked`);
                
                // If this audio is already playing, pause it
                if (!audio.element.paused) {
                    fadeOutAudio(audio.element, audio.indicator);
                    
                    // Deactivate the audio indicator on this specific item
                    const itemIndicator = item.querySelector('.audio-indicator');
                    if (itemIndicator) {
                        itemIndicator.classList.remove('active');
                    }
                    
                    return;
                }
                
                // Otherwise, play this audio and pause others
                pauseAllAudio(audio.element);
                
                // Set to start at specific time
                audio.element.currentTime = audio.startTime;
                
                // Play this audio
                const playPromise = audio.element.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audio.indicator.classList.add('active');
                        
                        // Activate the audio indicator on this specific item
                        const itemIndicator = item.querySelector('.audio-indicator');
                        if (itemIndicator) {
                            itemIndicator.classList.add('active');
                        }
                        
                        // Fade in audio
                        let volume = 0;
                        const fadeIn = setInterval(function() {
                            if (volume < 0.7) {
                                volume += 0.1;
                                audio.element.volume = volume;
                            } else {
                                clearInterval(fadeIn);
                            }
                        }, 100);
                    }).catch(error => console.log("Audio play failed:", error));
                }
            });
        }
    }
    
    // Add time update handler to all audio elements
    albumAudios.forEach(audio => {
        // Set initial properties
        audio.element.loop = false;
        audio.element.volume = 0;
        
        // Set up audio time limits
        audio.element.addEventListener('timeupdate', function() {
            // Check if we've reached the end of our 25-second clip
            if (audio.element.currentTime >= audio.startTime + audio.duration) {
                // Pause the audio when the clip duration is reached
                audio.element.pause();
                audio.element.currentTime = 0;
                audio.element.volume = 0;
                audio.indicator.classList.remove('active');
                
                // Deactivate all indicators for this audio
                document.querySelectorAll('.audio-indicator').forEach(indicator => {
                    indicator.classList.remove('active');
                });
            }
        });
    });

    // Pre-load audio files to improve response time
    albumAudios.forEach(audio => {
        audio.element.preload = "metadata";
        audio.element.load();
    });
    
    console.log("Audio functionality initialized");
}