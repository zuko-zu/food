function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.toggle('show');
    modal.classList.add('hide');
    document.body.style.overflow = '';
}

function openModal(modalSelector, modalTimerId) { 
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function modal(triggerSelector, modalSelector, modalTimerId) {
       // Modal
    const modal = document.querySelector(modalSelector);
    const modalOpenBtns = document.querySelectorAll(triggerSelector);

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('modal__close')) {
            closeModal(modalSelector);
        }
    });

    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', openModalByScroll);
        }
    }

    window.addEventListener('scroll', openModalByScroll);
}

export default modal;
export {closeModal};
export {openModal};