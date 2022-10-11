// Функция-помощник. Подстовлет "0", если количество часов меньше 9
function getZero(num) {
    if (num >= 0 && num < 10) {
        return `0${num}`;
    } else {
        return num;
    }
}

function timer(id, deadline) {
    // Нам нужно функция, которая устанавляивает таймер. Получать элементы (спаны) и что-то с нимим делать. 
    // Нужна функция/функционал, которая будет определять разницу между временем. То есть найти разницу, которую мы будем отображать на экране
    // Функция, которая будет заниматься обновлением значений в таймере 

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
    setClock(id, deadline);
}

export default timer;
export {getZero};