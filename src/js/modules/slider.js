import {getZero} from './timer';

function slider({container, slide, nextArrow, prevArrow, currentCounter, wrapper, field}) {
  // Slider

    const slides = document.querySelectorAll(slide);
    const slider = document.querySelector(container);
    const nextSlideBtn = document.querySelector(nextArrow);
    const prevSlideBtn = document.querySelector(prevArrow);
    const current = document.querySelector(currentCounter);

    let currentSlideIndex = 0;
    let offset = 0;

    const slidesWrapper = document.querySelector(wrapper);
    const slidesField = document.querySelector(field);
    const width = window.getComputedStyle(slidesWrapper).width;

    const indicators = document.createElement('ol');
    const dots = [];

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function updateCurrentSlideNum() {
        current.textContent = getZero(currentSlideIndex + 1);
    }

    function showCurrentDot() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[currentSlideIndex].style.opacity = 1;
    }

    function showSlide() {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    updateCurrentSlideNum();

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    nextSlideBtn.addEventListener('click', () => {
        if (offset == (deleteNotDigits(width) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }
        showSlide();

        if (currentSlideIndex == slides.length - 1) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex++;
        }

        updateCurrentSlideNum();
        showCurrentDot();
    });

    prevSlideBtn.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }
        showSlide();

        if (currentSlideIndex == 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex--;
        }

        updateCurrentSlideNum();
        showCurrentDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const slideTo = event.target.getAttribute('data-slide-to');

            currentSlideIndex = slideTo - 1;
            offset = deleteNotDigits(width) * (slideTo - 1);

            showSlide();
            updateCurrentSlideNum();
            showCurrentDot();
        });
    });
}

export default slider;