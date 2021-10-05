document.addEventListener("DOMContentLoaded", function (event) {

    let allExpenses = [];

    let valueInputWhere = '';
    let valueInputHow = '';
    let inputWhere = null;
    let inputHow = null;

    const inputChange = async () => {
        inputWhere = document.getElementById('inputWhere');
        inputHow = document.getElementById('inputHow');
        inputWhere.addEventListener('change', updateValueWhere);
        inputHow.addEventListener('change', updateValueHow);
        const resp = await fetch('http://localhost:8000/getAllExpenses', {
            method: 'GET'
        });
        let result = await resp.json();
        allExpenses = result.data;
        render();
    }

    //  фунекция формирования даты
    const dateFunction = () => {
        let date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();
        date = day + '.' + month + '.' + year;
        return date;
    }
    dateFunction()

    buttonAdd = document.getElementById('btnAdd');
    buttonAdd.addEventListener('click', function () {
        console.log('нажал добавить')
        clickBtnAdd();
    })

    const clickBtnAdd = async () => {
        if (inputWhere.value === '' || inputHow.value === '') {
            alert('Введите коректное значение');
        } else {
            const resp = await fetch('http://localhost:8000/createNewExp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: valueInputWhere,
                dateNow: dateFunction(),
                price: valueInputHow,
            })
        });
        let result = await resp.json();
        allExpenses = result.data;
        valueInputWhere = '';
        valueInputHow = '';
        inputWhere.value = '';
        inputHow.value = '';
        render();
        }
        
    }

    const updateValueWhere = (e) => {
        valueInputWhere = e.target.value;
    }

    const updateValueHow = (ev) => {
        valueInputHow = ev.target.value;
    }

    const render = () => {

        let total = 0;
        const contentList = document.getElementById('contentList');
        let sum = document.getElementById('totalSum');

        while (contentList.firstChild) {
            contentList.removeChild(contentList.firstChild);
        }

        // проверяю есть расходы если нет итог равен нулю
        if (allExpenses.length === 0) {
            sum.innerText = `Итого: ${0} р.`;
        }

        allExpenses.map((item, index) => {

            // нахожу сумму элементов
            total += Number(item.price)
            sum.innerText = `Итого: ${total}р.`;

            const listItem = document.createElement('li'); // создаю элемент списка
            const container = document.createElement('div'); //  создаю рабочий контеинер
            container.className = 'expenses';
            contentList.appendChild(listItem)
            listItem.appendChild(container);

            const allBtn = document.createElement('div')// контеинер для всех кнопок
            allBtn.className = 'all-btn';

            const textShopDate = document.createElement('div'); // контеинер для магазина с датой
            textShopDate.className = 'textshop-date';

            const priceBlock = document.createElement('div'); // контеинер для цены
            priceBlock.className = 'price-block';

            // создаю текст с названием магазина
            const textShop = document.createElement('div');
            textShop.innerText = `Магазин "${item.text}"`;
            textShop.className = 'expensesShop';
            textShopDate.appendChild(textShop);

            // создаю инпут для изменения магазина
            const inputEditShop = document.createElement('input')
            inputEditShop.className = 'input-edit';
            inputEditShop.classList.add('hide');
            textShopDate.appendChild(inputEditShop);

            // создаю текст с датой
            const whenDate = document.createElement('div')
            whenDate.innerText = item.dateNow;
            whenDate.className = 'expensesDate';
            textShopDate.appendChild(whenDate);
            container.appendChild(textShopDate);

            // создаю блок с ценой
            const price = document.createElement('div')
            price.innerText = `${item.price} р.`;
            priceBlock.appendChild(price);


            // создаю инпут для изменения цены
            const inputEditPrice = document.createElement('input')
            inputEditPrice.className = 'input-edit';
            inputEditPrice.type = 'Number';
            inputEditPrice.classList.add('hide');
            priceBlock.appendChild(inputEditPrice);
            container.appendChild(priceBlock)

            // создаю кнопку редактировать
            const editBtn = document.createElement('img')
            editBtn.src = './img/edit.png';
            allBtn.appendChild(editBtn);

            editBtn.onclick = () => clickEdit(index, textShop, price, inputEditShop, inputEditPrice, deleteBtn, doneBtn, editBtn);

            // создаю кнопку удалить
            const deleteBtn = document.createElement('img')
            deleteBtn.src = './img/delete.png';
            allBtn.appendChild(deleteBtn);

            deleteBtn.onclick = () => delBtn(item._id);

            // создаю кнопку применить
            const doneBtn = document.createElement('img')
            doneBtn.src = './img/save.png';
            doneBtn.classList.add('hide')
            allBtn.appendChild(doneBtn)
            container.appendChild(allBtn)

            doneBtn.onclick = () => clickDone(item._id, textShop, price, inputEditShop, inputEditPrice, deleteBtn, doneBtn, editBtn);
        })
    }

    // функция внести изменение
    const clickEdit = ((index, textShop, price, inputEditShop, inputEditPrice, deleteBtn, doneBtn, editBtn) => {
        inputEditShop.value = allExpenses[index].text;
        inputEditPrice.value = allExpenses[index].price;
        console.log(allExpenses[index].price)
        textShop.classList.toggle('hide')
        price.classList.toggle('hide');
        inputEditShop.classList.toggle('hide');
        inputEditPrice.classList.toggle('hide');
        doneBtn.classList.toggle('hide');
        deleteBtn.classList.toggle('hide');
        editBtn.classList.toggle('hide');
    });

    // функция принять именения
    const clickDone = async (index, textShop, price, inputEditShop, inputEditPrice, deleteBtn, doneBtn, editBtn) => {

        const resp = await fetch(`http://localhost:8000/changeExp`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: inputEditShop.value,
                price: inputEditPrice.value,
                _id: index
            })
        });
        let result = await resp.json();
        allExpenses = result.data;

        textShop.classList.toggle('hide')
        price.classList.toggle('hide');
        inputEditShop.classList.toggle('hide');
        inputEditPrice.classList.toggle('hide');
        doneBtn.classList.toggle('hide');
        deleteBtn.classList.toggle('hide');
        editBtn.classList.toggle('hide');
        render()
    };

    const delBtn = async (value) => {
        const resp = await fetch(`http://localhost:8000/deleteExp?_id=${value}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
                }
            });
            let result = await resp.json();
            console.log('result delete', result);
            allExpenses = result.data;
        render()
    }
    inputChange();

});