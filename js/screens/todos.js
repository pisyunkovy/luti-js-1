// js/screens/todos.js
import { el } from '../utils/dom.js';
import { Header } from '../components/header.js';
import { Breadcrumbs } from '../components/breadcrumbs.js';
import { SearchBar } from '../components/searchbar.js';
import { DataTable } from '../components/list.js';
import { Loader } from '../components/loader.js';
import { Empty } from '../components/empty.js';
import { state } from '../state.js';
import { getTodosFiltered, addTodoLocal, getAllUsersMerged, updateLocalTodo } from '../api/datasource.js';

const ROUTE_KEY = 'users#todos';

export async function renderTodos(container) {
  container.innerHTML = '';
  const root = el('div', { children: [
    Header(),
    el('div', { class: 'app-card', children: [
      Breadcrumbs(['users','todos']),
      el('div', { id: 'todo-search' }),
      el('div', { id: 'todo-form' }),
      el('div', { id: 'todo-list' }),
    ]})
  ]});
  container.appendChild(root);

  // Поиск
  const searchWrap = root.querySelector('#todo-search');
  const search = SearchBar({
    placeholder: 'Искать по title…',
    onChange: (v) => { state.setSearchFor(ROUTE_KEY, v); drawList(); }
  });
  searchWrap.appendChild(search);
  search.querySelector('input').value = state.getSearchFor(ROUTE_KEY);

  // Форма
  const users = await getAllUsersMerged();
  const { TodoForm } = await import('../components/todoForm.js');
  root.querySelector('#todo-form').appendChild(TodoForm({
    users,
    onAdd: (t) => { addTodoLocal(t); drawList(); }
  }));

  drawList();

  async function drawList() {
    const wrap = root.querySelector('#todo-list');
    wrap.innerHTML = '';
    wrap.appendChild(Loader('Загружаем todos…'));
    try {
      const todos = await getTodosFiltered(state.getSearchFor(ROUTE_KEY));
      wrap.innerHTML = '';
      if (!todos.length) { wrap.appendChild(Empty()); return; }
      const columns = [
        { key: 'userId', title: 'User ID' },
        { key: 'title',  title: 'Title' },
        {
          key: 'completed', title: 'Статус',
          render: (t) => {
            if (t.id < 0) {
              const cb = el('input', { attrs: { type: 'checkbox' } });
              cb.checked = !!t.completed;
              cb.addEventListener('change', () => updateLocalTodo(t.id, { completed: cb.checked }));
              return cb;
            }
            return el('span', { class: 'badge', text: t.completed ? 'done' : 'open' });
          }
        },
      ];
      wrap.appendChild(DataTable({ columns, rows: todos }));
    } catch (e) {
      wrap.innerHTML = '';
      wrap.appendChild(el('div', { class: 'error', text: 'Ошибка загрузки todos' }));
      console.error(e);
    }
  }
}
