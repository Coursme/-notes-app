const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

// Месяцы на русском языке
const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
    "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

// Получаем сохраненные заметки из localStorage, если есть
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

// Открываем окно для добавления новой заметки
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Добавить новую заметку";
    addBtn.innerText = "Добавить заметку";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

// Закрываем окно добавления/редактирования заметки
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// Функция отображения всех заметок
function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Редактировать</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Удалить</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

// Показать меню настроек для заметки
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Удалить заметку
function deleteNote(noteId) {
    let confirmDel = confirm("Вы уверены, что хотите удалить эту заметку?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

// Обновить заметку
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Обновить заметку";
    addBtn.innerText = "Обновить заметку";
}

// Добавление или обновление заметки
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});

/*
Комментарий к коду:

1. Переменные объявляются для различных элементов DOM, таких как кнопка добавления заметки, окно всплывающего окна, заголовки и элементы формы.
2. Массив "months" содержит названия месяцев на русском языке для отображения даты.
3. Сохраняем заметки в "localStorage", чтобы данные не исчезали после перезагрузки страницы.
4. addBox.addEventListener("click", ...) - открывает окно для добавления новой заметки.
5. closeIcon.addEventListener("click", ...) - закрывает окно добавления/редактирования.
6. showNotes() - функция для отображения всех существующих заметок на странице.
7. showMenu(elem) - показывает меню для редактирования или удаления заметки.
8. deleteNote(noteId) - удаляет выбранную заметку после подтверждения.
9. updateNote(noteId, title, filterDesc) - открывает окно редактирования заметки и заполняет его текущими данными.
10. addBtn.addEventListener("click", ...) - добавляет новую заметку или обновляет существующую, сохраняя изменения в localStorage.
*/