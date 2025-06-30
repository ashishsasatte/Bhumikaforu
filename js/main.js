/**
 * Mobile-Optimized Main JavaScript File
 * Combines all animations and mobile enhancements
 */

// Device Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Initialize when DOM is ready
$(document).ready(function() {
    // Add device classes to body
    if (isMobile) $('body').addClass('mobile');
    if (isIOS) $('body').addClass('ios');

    // Handle orientation changes
    function checkOrientation() {
        if (window.innerHeight < window.innerWidth) {
            $('body').addClass('landscape').removeClass('portrait');
        } else {
            $('body').addClass('portrait').removeClass('landscape');
        }
    }
    window.addEventListener('resize', checkOrientation);
    checkOrientation();

    // Audio Player Setup
    const audioSetup = function() {
        try {
            const audioPlayer = new Audio();
            audioPlayer.src = "audio/background.mp3"; // Update with your audio path
            audioPlayer.loop = true;
            audioPlayer.preload = "auto";

            $('#audio').on('click touchstart', function(e) {
                e.preventDefault();
                if (audioPlayer.paused) {
                    audioPlayer.play().catch(e => console.log("Audio play failed:", e));
                    $(this).text('Pause Music');
                } else {
                    audioPlayer.pause();
                    $(this).text('Play Music');
                }
                return false;
            });
        } catch (e) {
            console.error("Audio error:", e);
            $('#audio').hide();
        }
    };

    // Touch Feedback for Buttons
    const setupTouchControls = function() {
        $('.control-btn').on('touchstart', function() {
            $(this).addClass('btn-touch');
        }).on('touchend', function() {
            $(this).removeClass('btn-touch');
        });
    };

    // Mobile Performance Optimizations
    const optimizeForMobile = function() {
        if (isMobile) {
            // Reduce animation intensity
            $.fx.interval = isIOS ? 30 : 50;
            
            // Simplify animations on mobile
            $('.stars > li').css('animation-duration', '8s');
            $('.water_1, .water_2, .water_3, .water_4').css('animation-duration', '25s');
            
            // Scale down character on small screens
            if (window.innerWidth < 400) {
                $('#boy').css('transform', 'scale(0.5)');
            }
        }
    };

    // Initialize Swipe functionality
    const initSwipe = function() {
        const swipeContainer = $('#content');
        let startX, moveX, currentX = 0;
        const sceneWidth = swipeContainer.width();

        swipeContainer.on('touchstart', function(e) {
            startX = e.originalEvent.touches[0].clientX;
        });

        swipeContainer.on('touchmove', function(e) {
            moveX = e.originalEvent.touches[0].clientX;
            const diff = moveX - startX;
            $('#content > .scene').css('transform', `translateX(${currentX + diff}px)`);
        });

        swipeContainer.on('touchend', function(e) {
            const moveX = e.originalEvent.changedTouches[0].clientX;
            const diff = moveX - startX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                currentX += diff > 0 ? sceneWidth : -sceneWidth;
                // Boundary checking
                currentX = Math.min(0, Math.max(-(sceneWidth * 2), currentX));
                
                $('#content > .scene').css({
                    'transition': 'transform 0.3s ease-out',
                    'transform': `translateX(${currentX}px)`
                });
            }
        });
    };

    // Loading Screen Handler
    const handleLoading = function() {
        // Hide loading screen when all assets are loaded
        $(window).on('load', function() {
            $('.loading-indicator').fadeOut(500, function() {
                // Start animations after loading
                if (typeof BoyWalk === 'function') {
                    const boy = BoyWalk();
                    // Example usage:
                    boy.walkTo(3000, 0.5);
                }
            });
        });
    };

    // Initialize all components
    audioSetup();
    setupTouchControls();
    optimizeForMobile();
    if (isMobile) initSwipe();
    handleLoading();

    // Start Button Click Handler
    $('#btn').on('click touchstart', function(e) {
        e.preventDefault();
        $(this).text('Journey Started...');
        
        // Example animation sequence
        if (typeof BoyWalk === 'function') {
            const boy = BoyWalk();
            boy.walkTo(2000, 0.3)
                .then(() => boy.rotate())
                .then(() => boy.walkTo(3000, 0.7));
        }
        
        return false;
    });
});

// Animation End Detection
const animationEnd = (function() {
    const styles = window.getComputedStyle(document.documentElement, '');
    const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/);
    return (pre && pre[1]) || 'animationend';
})();

// Helper function to get element position
function getValue(className) {
    const $elem = $(className);
    return {
        height: $elem.height(),
        top: $elem.position().top
    };
}