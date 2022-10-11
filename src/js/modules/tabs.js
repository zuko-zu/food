function tabs(tabsSelector, TabsContentSelector, tabsParentSelector, activeClass) {
    // 1. Скрыть ненужные табы
    // 2. Показать нужный табы
    // 3. Назначить обработчики событий на меню, которое и будет манипулировать вышеперечисленными функциями

    const tabs = document.querySelectorAll(tabsSelector);
    const tabsContent = document.querySelectorAll(TabsContentSelector);
    const tabsParent = document.querySelector(tabsParentSelector);

    function hideTabContent() {
        tabsContent.forEach(content => {
            content.style.display = 'none';
        });

        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((tab, i) => {
                if (event.target === tab) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

export default tabs;