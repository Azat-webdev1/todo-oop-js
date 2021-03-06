'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));

  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem);
    this.addToStorage();
  }

  createItem = (item) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = item.key;
    li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${item.value}</span>
        <div class="todo-buttons">
          <button class="todo-remove"></button>
          <button class="todo-complete"></button>
        </div>`);

    if (item.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
    this.input.value = '';
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      alert('Пустое дело добавить нельзя!!');
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(item) {
    let currentElem = item.closest('.todo-item');
    this.todoData.forEach((elem, key, map) => {
      if (key === currentElem.key) {
        map.delete(key);
      }
    this.render();
    });
  }

  completedItem(item) {
    let currentElem = item.closest('.todo-item');
    this.todoData.forEach((elem, key) => {
      if (currentElem.key === key) {
        elem.completed = (!elem.completed) ? true : false;
        this.render();
      }
    });
  }

  handler() {
    this.todoContainer.addEventListener('click', (e) => {
      if (e.target.closest('.todo-remove')) {
        this.deleteItem(e.target);
      }
      if (e.target.closest('.todo-complete')) {
        this.completedItem(e.target);
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();

  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();