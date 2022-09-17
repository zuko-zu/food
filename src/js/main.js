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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();

    //  Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'спасибо, скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach( form => {
        postData(form);
    });

    // Реализуем функцию отправки форм на сервер
    function postData(form) {
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

            // request.setRequestHeader('Content-type', 'multypart/form-data');
            //  Не сработает без атрибута "name" у инпутов

            const formData = new FormData(form);

            const object = {};
            formData.forEach(function (value, key){
                object[key] = value;
            });

            fetch('servr.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then(data => data.text())
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

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});