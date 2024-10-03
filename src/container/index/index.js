export class Todo {
static #NAME = 'todo'

//метод saveData зберіг.дані(список і кільк.задач) в localStorage в форматі JSON
static #saveData = () => {
    localStorage.setItem(    //localStorage-метод зберігання даних в веб-браузері,НАВІТЬ ПІСЛЯ ЗАКРИВАННЯ ВКЛАДКИ,але він підтримує тільки СТРОКИ,тому для зберігання обєктів і масивів ми використовуєм (JSON.stringify-перетворення обєкта в строку) і (JSON.parse-перетвор.строки обратно в обєкт)
        this.#NAME,
        JSON.stringify({ //JSON.stringify-перетворення обєкта в строку
            list: this.#list,
            count: this.#count,
        }),
    )
}

//метод loadData-загружає дані з localStorage,якщо вони є
static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)
    if(data) {
        const {list, count} = JSON.parse(data) // JSON.parse-перетвор.строки обратно в обєкт
        this.#list = list       //і обновляє list список
        this.#count = count     //і обновляє count число(кількість)
    }
}

static #list = [] // список
static #count = 0   // число задач- для генерації id для кожної задачі


static #createTaskData = (text) => {
    this.#list.push({
        id: ++this.#count,
        text,
        done: false,
    })
}

    // block-це main(в index.hbs),куди ми будем додавати(вставляти) нові елементи з template
    static #block = null
     // template-це template(в index.hbs)
    static #template = null
    // input-це input(в index.hbs)
    static #input = null
    // button-це button(в index.hbs)
    static #button = null

    static init = () => {
        this.#template = document.getElementById('task',).content.firstElementChild  // звернукає в документі HTML(index.hbs) елем. з ідентифікатором id='task', якщо є-повертається,якщо ні-повертає null
        this.#block = document.querySelector('.task__list')
        
        this.#input = document.querySelector('.form__input')
        
        this.#button = document.querySelector('.form__button')
        
        this.#button.onclick = this.#handleAdd

        this.#loadData()

        this.#render()
    }
    
    static #handleAdd = () => { //цей метод получає текст із поля ввода #input,передає його в метод createTaskData і очищає поле ввода #input
        // const value = this.#input.value
        // if(value.lenght > 1) {
        this.#createTaskData(this.#input.value)  // визиваєм приват.метод createTaskData,якому передаєм знач.із елем.ввода #input
        this.#input.value = ''  // після створення(добавлення) даних,-поле ввода зачищається-пуста строка
        this.#render() //оновлює список і показує виконану задачу(дані виводить)
        this.#saveData()
        // }
        // console.log(this.#list)
        //     this.#block,
        //     this.#button,
        //     this.#input,
        //     this.#template,
        //     )
    }
 
    static #render = () => {
        this.#block.innerHTML = ''  // видаляєм все що є в #block

        // якщо список пустий =0,то виведе Список задач пустий
        if(this.#list.length === 0) {
            this.#block.innerText = `Список задач пустий` 
        } else {
            // якщо список не пустий,то пройдемось по всьому списку list
            this.#list.forEach((taskData) => {
                // const el = this.#template.cloneNode(true) // копіюєм(без true не покаже текст) те що в template(index.hbs),ми його витягнули в init
                const el = this.#createTaskElem(taskData) 
                this.#block.append(el) //Додаєм #block в змінну 
            })
        }
    }

    static #createTaskElem = (data) => {
        const el = this.#template.cloneNode(true)//клоніруєм шаблон HTML template(true-з усіма дочірніми елементами,якщо false-скопіює без елем)

        const[id, text, btnDo, btnCancel] = el.children // через деструктиразацію виймаємо дані(елем.з template)
        
        id.innerText = `${data.id}.` // нумерація по порядку 1. 2. 3. ... ,яку буде виводити
        text.innerText = data.text  // текст який ми вписуємо буде виводити з нумерацією
        btnCancel.onclick = this.#handleCancel(data);  //при натиск.на кнопку визвем handleCancel передаючи їй парам.data
        btnDo.onclick = this.#handleDo(data, btnDo, el)  //при натиск.на кнопку визвем handleDo передаючи їй парам.(data, btnDo, el)
        
        if(data.done) {
            el.classList.add('task--done')       //тут додаєм клас task--done до елемента el,якщо його там нема;видаляє його якщо він там є
            btnDo.classList.remove('task__button--do') //тут переключаєм на клас task__button--do до елемента btn,змінюєм значок
            btnDo.classList.add('task__button--done') //тут переключаєм на клас task__button--done до елемента btn,змінюєм значок
        }
        
        return el
    } 

    static #handleDo = (data, btn, el) => () => {
        const result = this.#toggleDone(data.id)  //визвем ф-ю toggleDone передаючи їй data.id,результ виконання ф-ї записую в result
        if(result === true || result === false) {  //якщо result=true або false,виконуєм блок if, якщо отримаєм null,то блок if не виконується
            el.classList.toggle('task--done')       //тут додаєм клас task--done до елемента el,якщо його там нема;видаляє його якщо він там є
            btn.classList.toggle('task__button--do') //тут переключаєм на клас task__button--do до елемента btn,змінюєм значок
            btn.classList.toggle('task__button--done') //тут переключаєм на клас task__button--done до елемента btn,змінюєм значок

            this.#saveData()
        }
    }
    
    static #toggleDone = (id) => {  // toggleDone приймає ідент.id
        const task = this.#list.find((item) => item.id === id)  // по ідентиф-ру знаходить task
        if(task) {                                              // якщо task є
            task.done = !task.done  //звертаємось до task.done, якщо він false,то стає true
            return task.done
        } else {
            return null
        }
    }
 
    //ф-я яка виконує іншу ф-ю
    static #handleCancel = (data) => () => {
        if(confirm('Видалити задачу?')) {   // випливає выкно для підтвердження видалення
            const result = this.#deleteById(data.id);
            if(result) {
                this.#render();
                this.#saveData()
            }
        }
    }

    static #deleteById = (id) => {
        this.#list = this.#list.filter((item) => item.id !== id)
        return true
    }
}

Todo.init()

//тут клас Todo присвоюєм властивості тodo обєкта window,це робить клас Todo доступним глобально в браузері,через window.todo ми можемо звертатися в клас Todo
window.todo = Todo  