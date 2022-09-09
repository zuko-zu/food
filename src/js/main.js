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
            tab.classList.remove('tabheader__item_active')
        })
    };

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active')
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
            })
        };
    })
})