window.addEventListener('DOMContentLoaded', function () {


    //Tabs
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');




    function hideTabContent() {

        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    //1) Создать функцию, которая будет устанавливать наш таймер - получать элементы и что-то с ними делать
    //2) Функционал, который будет определять разницу между временем (установить дедлайн в формате даты)
    //3) Вычеслить время, которое установлено у пользователя и найти разницу, которую будем оторбражать 
    //4) Функция, которая будет заниматься обновлением таймера 

    const deadline = '2021-10-28'; //определяем дедлайн

    function getTimeRemaining(endtime) { //определяем разницу между датами
        const t = Date.parse(endtime) - Date.parse(new Date()), //количество милесекунд в конечном времени и отнимаем текущую дату
            //тепепрь эту разницу превращаем в количество дней, часов, минут
            days = Math.floor((t / (1000 * 60 * 60 * 24))), //количество миллисекунд делим на колличество миллисекунд, который находятся в одном дне. Math.floor - округление. 1000 - количество миллисек в сек, *60 - в минуте, *60 - в часе, *24 - в сутках. Когда общее количество миллисекунд делим на то, что миллисекунды в сутках, то получаем сколько суток ло окончания
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //% - возвращает остаток от деления (чтобы часы переносились в дни)
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return { //создаем и возвращаем обьект из функции
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) { //чтобы подставлялся ноль
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //устанавливаем часы на страницу

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //запускаем здесь, чтобы не было мигания 

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');


    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');

        document.body.style.overflow = '';
    }


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });


    modalCloseBtn.addEventListener('click', closeModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 3000); //вызывем функцию open modal через 3 сек

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);



    //Шаблонизировать карточки с меню и создавать, передавая только нужные аргументы

    const menuClass = document.querySelectorAll(".menu__item");

    class Menu {
        constructor(photo, title, description, price, parentSelector, ...classes) { //ParentSelector - то, куда юбудем помещать
            this.photo = photo;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector); //будем передовать в настройку класса
            this.classes = classes; //массив
        }

        render() {
            
            const element = document.createElement('div');

            if (this.classes.length === 0) { //если длинна массива = 0
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className)); //перебираем наш массив
            }
            element.innerHTML = ` 
            
            <img src= ${this.photo}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.description}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
           
            `;
            this.parent.append(element); //помещаем element в parent
        }
        }

    
    
    //Только, когда используем 1 раз
    new Menu(
        "img/tabs/vegy.jpg", 
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229,
        '.menu .container',
        'menu__item', //последним аргументом добавляем класс
        'big' //добавляем для проверки

    ).render(); 

    new Menu(
        "img/tabs/elite.jpg", 
        'Меню "Премиум"',
        'Меню “Премиум” - мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550,
        '.menu .container',
        'menu__item',
        'big'

    ).render(); 

    new Menu(
        "img/tabs/post.jpg", 
        'Меню "Постное"',
        'Наше специальное “Постное меню” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения. Полная гармония с собой и природой в каждом элементе! Все будет Ом!',
        430,
        '.menu .container',
        'menu__item',
        'big'

    ).render(); 

    //Старый способ

    // const menu1 = new Menu();
    // menu1.render();
    // const menu2 = new Menu();
    // menu2.render();
    // const menu3 = new Menu();
    // menu3.render();


    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'Загрузка',
        success: 'Спасибо, скоро свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e)=> { //submit будет срабатывать каждый раз, когда мы будем пытаться отправить форму
            e.preventDefault(); //эта команда отменяет стандартное поведение браузера

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status'); //добавили класс
            statusMessage.textContent = message.loading;
            form.append(statusMessage); //к форме будем добовлять это сообщение 

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php'); //всегда вызывается метод open для настройки этого запроса

            request.setRequestHeader('Content-type', 'multipart/form-data');
            const formData = new FormData(form);

            request.send(formData);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });

    }
});