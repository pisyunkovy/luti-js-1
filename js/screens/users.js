// js/screens/users.js
import { el } from '../utils/dom.js';
import { Header } from '../components/header.js';
import { Breadcrumbs } from '../components/breadcrumbs.js';
import { SearchBar } from '../components/searchbar.js';
import { DataTable } from '../components/list.js';
import { Loader } from '../components/loader.js';
import { Empty } from '../components/empty.js';
import { state } from '../state.js';
import { getUsersFiltered, addUserLocal, deleteUser } from '../api/datasource.js';

const ROUTE_KEY = 'users';

export async function renderUsers(container) {
  container.innerHTML = '';
  const root = el('div', { children: [
    Header(),
    el('div', { class: 'app-card', children: [
      Breadcrumbs(['users']),
      // создаём searchbar и потом установим ему value из state
      el('div', { id: 'users-search' }),
      el('div', { id: 'users-form' }),
      el('div', { id: 'users-list' }),
    ]})
  ]});
  container.appendChild(root);

  // Search
  const searchWrap = root.querySelector('#users-search');
  const search = SearchBar({
    placeholder: 'Имя или email…',
    onChange: (v) => { state.setSearchFor(ROUTE_KEY, v); drawList(); }
  });
  searchWrap.appendChild(search);
  // установить сохранённое значение
  search.querySelector('input').value = state.getSearchFor(ROUTE_KEY);

  // Форма
  const { UserForm } = await import('../components/userForm.js');
  root.querySelector('#users-form').appendChild(UserForm({
    onAdd: (u) => { addUserLocal(u); drawList(); }
  }));

  drawList();

  async function drawList() {
    const listWrap = root.querySelector('#users-list');
    listWrap.innerHTML = '';
    listWrap.appendChild(Loader('Загружаем пользователей…'));
    try {
      const users = await getUsersFiltered(state.getSearchFor(ROUTE_KEY));
      listWrap.innerHTML = '';
      if (!users.length) { listWrap.appendChild(Empty()); return; }
      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Имя' },
        { key: 'email', title: 'Email' },
        { key: 'actions', title: '', render: (u) => {
          return el('button', {
            class: 'btn danger',
            text: 'Удалить',
            on: { click: () => { if (confirm('Удалить пользователя?')) { deleteUser(u.id); drawList(); } } }
          });
        }},
      ];
      listWrap.appendChild(DataTable({ columns, rows: users }));
    } catch (e) {
      listWrap.innerHTML = '';
      listWrap.appendChild(el('div', { class: 'error', text: 'Не удалось загрузить пользователей. Попробуйте позже.' }));
      console.error(e);
    }
  }
}
