window.addEventListener('DOMContentLoaded', () => {
    // 1. Скрыть ненужные табы
    // 2. Показать нужный табы
    // 3. Назначить обработчики событий на меню, которое и будет манипулировать вышеперечисленными функциями

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(content => {
            content.style.display = 'none';
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (event.target === tab) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer 

    // Нам нужно функция, которая устанавляивает таймер. Получать элементы (спаны) и что-то с нимим делать. 
    // Нужна функция/функционал, которая будет определять разницу между временем. То есть найти разницу, которую мы будем отображать на экране
    // Функция, которая будет заниматься обновлением значений в таймере 

    const deadline = '2023-05-11';
    // ниже функция, возвращающая разницу времени
    //  Date.parse(endtime) - дедлайн в миллисекундах
    //  Date.parse(new Date) - текущее время в милисекундах
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        // Можно писать new Date() без Date.parse(), оставим так для единообразности кода
        let days;
        let hours;
        let minutes;
        let seconds;

        // Мы получили разницу в милисекундах, теперь из них нужно извлечь разницу в днях, часах и минутах
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    // Функция-помощник. Подстовлет "0", если количество часов меньше 9
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(secelctor, endtime) {
        const timer = document.querySelector(secelctor);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        // Запускаем функцию UpdateClock каждую секунду (таймер обновляется каждую секунду)
        const timeInterval = setInterval(updateClock, 1000);

        // Функция инициализации. Нужна чтобы избежать мигание. Иначе первый зауск функции произойдет лишь через секунду
        updateClock();

        // Пишем функцию. обновляющу таймер каждую секунду
        function updateClock() {
            // Расчет времеи, оставшегося на эту секунду
            const t = getTimeRemaining(endtime);
            // помещаем расчетные величины на страницу 
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            // Останавливаем функцию, когда дедлайн прошел
            if (t.total <= 0) {
                clearInterval(timeInterval); // Таймер больше не будет обновляться
            }
        }
    }
    setClock('.timer', deadline);

   // Modal
    const modal = document.querySelector('.modal');
    const modalOpenBtns = document.querySelectorAll('[data-modal-open]');

    function closeModal() {
        modal.classList.toggle('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    function openModal() { 
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        window.removeEventListener('scroll', openModalByScroll);
    }


    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('modal__close')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000);

    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
        }
    }

    window.addEventListener('scroll', openModalByScroll);

    // Используем классы для создания карточек меню

    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            // Здесь будет массив с классами или пустой массив, если мы ничео не передали
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }
        // Метод перевода долларов в гривны
        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if(this.classes.length === 0) {
                // Устанавливаем дефолтный класс, если пришел пустой массив
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                // Присваиваем элементу все классы из массива
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }

    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    //  Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'спасибо, скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach( form => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            // Отменяем поведение по умолчанию (отправка формы и перезагрузка страницы)
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json  = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const previousModalDialog = document.querySelector('.modal__dialog');

        previousModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider');
    const nextSlideBtn = document.querySelector('.offer__slider-next');
    const prevSlideBtn = document.querySelector('.offer__slider-prev');
    const current = document.querySelector('#current');
    
    let currentSlideIndex = 0;
    let offset = 0;
    
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
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

    // Calc
    
    const result = document.querySelector('.calculating__result span');
    let sex = 'female', 
        height, weight, age, 
        ratio = '1.375';

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal(); 

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(element => {
            element.addEventListener('click', (event) => {
                if(event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                } else {
                    sex = event.target.getAttribute('id');
                }
    
                elements.forEach(element => {
                    element.classList.remove(activeClass);
                });
    
                event.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = + input.value;
                    break;
                case 'age':
                    age = + input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
});