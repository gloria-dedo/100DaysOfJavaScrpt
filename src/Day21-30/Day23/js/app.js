
// 3D Card Effect
const card = document.getElementById('card');
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Reset card on mouse leave
document.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

// Color selection
const colorDots = document.querySelectorAll('.color-dot');
colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        // Remove active class from all dots
        colorDots.forEach(d => d.classList.remove('active', 'border-2', 'border-white'));
        // Add active class to clicked dot
        dot.classList.add('active', 'border-2', 'border-white');
        
        // Change sneaker color based on selection (in a real app, you'd change the image)
        const color = dot.getAttribute('data-color');
        console.log(`Selected color: ${color}`);
        
        // Animation for color change
        gsap.to('#mainSneaker', {
            scale: 1.3,
            rotation: -25,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    });
});

// Size selection
const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        sizeBtns.forEach(b => {
            b.classList.remove('bg-white', 'text-black');
            b.classList.add('text-gray-300', 'border-gray-400');
        });
        
        // Add active class to clicked button
        btn.classList.remove('text-gray-300', 'border-gray-400');
        btn.classList.add('bg-white', 'text-black');
        
        // Animation for size selection
        gsap.from(btn, {
            scale: 1.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Thumbnail click to change main sneaker image
const mainSneaker = document.getElementById('mainSneaker');
const thumbnails = document.querySelectorAll('.sneaker-thumbnail');

thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        thumb.classList.add('active');
        
        // Get the source of the clicked thumbnail
        const newSrc = thumb.getAttribute('data-src');
        
        // Animate the main sneaker out
        gsap.to(mainSneaker, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                // Change the source
                mainSneaker.src = newSrc;
                
                // Animate the main sneaker back in
                gsap.to(mainSneaker, {
                    opacity: 1,
                    scale: 1.5,
                    rotation: -30,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            }
        });
    });
});

// Buy button animation
const buyBtn = document.getElementById('buyBtn');
buyBtn.addEventListener('click', () => {
    gsap.to(buyBtn, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
    
    // Add a fun bounce to the main sneaker when buying
    gsap.to(mainSneaker, {
        y: "-=30",
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 3
    });
});

// Initial animation on page load
window.addEventListener('load', () => {
    gsap.from('#card', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from('#mainSneaker', {
        scale: 0,
        rotation: -90,
        duration: 1.5,
        delay: 0.5,
        ease: "elastic.out(1, 0.3)"
    });
    
    // gsap.from('.sneaker-thumbnail', {
    //     x: 100,
    //     opacity: 0,
        
    //     stagger: 0.2,
    //     delay: 1,
    //     ease: "power1.out"
    // });
});
