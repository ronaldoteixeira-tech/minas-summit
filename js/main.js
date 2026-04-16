document.addEventListener('DOMContentLoaded', () => {
    /* =============== MAGIC CURSOR (Isolado no Networking) =============== */
    const cursorLight = document.getElementById('cursorLight');
    const networkingSection = document.getElementById('networking');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lightX = mouseX;
    let lightY = mouseY;
    let inNetworking = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Verifica área da Seção 2
        if (networkingSection) {
            const rect = networkingSection.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                cursorLight.style.opacity = '1';
                inNetworking = true;
            } else {
                cursorLight.style.opacity = '0';
                inNetworking = false;
            }
        }
    });

    function animateLight() {
        if (inNetworking) {
            lightX += (mouseX - lightX) * 0.08;
            lightY += (mouseY - lightY) * 0.08;
            cursorLight.style.transform = `translate(${lightX}px, ${lightY}px)`;
        }
        requestAnimationFrame(animateLight);
    }
    animateLight();

    /* =============== DRAG TO SCROLL (CAROUSEL) =============== */
    const slider = document.querySelector('.stand-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Controle de Setas
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const scrollAmount = window.innerWidth > 1024 ? slider.clientWidth * 0.5 : slider.clientWidth * 0.8;
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                const scrollAmount = window.innerWidth > 1024 ? slider.clientWidth * 0.5 : slider.clientWidth * 0.8;
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        // Paginação (Dots)
        const dotsContainer = document.getElementById('carouselDots');
        const slides = document.querySelectorAll('.stand-slide');
        const dots = [];

        if (slides.length > 0 && dotsContainer) {
            slides.forEach((slide, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');

                dot.addEventListener('click', () => {
                    const containerCenter = slider.offsetWidth / 2;
                    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                    slider.scrollTo({ left: slideCenter - containerCenter, behavior: 'smooth' });
                });

                dotsContainer.appendChild(dot);
                dots.push(dot);
            });

            // Atualizar bolinha ativa no scroll livre
            slider.addEventListener('scroll', () => {
                let activeIndex = 0;
                let minDistance = Infinity;
                const scrollCenter = slider.scrollLeft + slider.offsetWidth / 2;

                slides.forEach((slide, index) => {
                    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                    const distance = Math.abs(scrollCenter - slideCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeIndex = index;
                    }
                });

                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });
        }
    }
});
