// js/screens/comments.js
import { el } from '../utils/dom.js';
import { Header } from '../components/header.js';
import { Breadcrumbs } from '../components/breadcrumbs.js';
import { SearchBar } from '../components/searchbar.js';
import { DataTable } from '../components/list.js';
import { Loader } from '../components/loader.js';
import { Empty } from '../components/empty.js';
import { state } from '../state.js';
import { getCommentsFiltered } from '../api/datasource.js';
import { clamp } from '../utils/format.js';

const ROUTE_KEY = 'users#posts#comments';

export async function renderComments(container) {
  container.innerHTML = '';
  const root = el('div', { children: [
    Header(),
    el('div', { class: 'app-card', children: [
      Breadcrumbs(['users','posts','comments']),
      el('div', { id: 'comments-search' }),
      el('div', { id: 'comments-list' }),
    ]})
  ]});
  container.appendChild(root);

  const searchWrap = root.querySelector('#comments-search');
  const search = SearchBar({
    placeholder: 'Искать в name/body…',
    onChange: (v) => { state.setSearchFor(ROUTE_KEY, v); drawList(); }
  });
  searchWrap.appendChild(search);
  search.querySelector('input').value = state.getSearchFor(ROUTE_KEY);

  drawList();

  async function drawList() {
    const wrap = root.querySelector('#comments-list');
    wrap.innerHTML = '';
    wrap.appendChild(Loader('Загружаем комментарии…'));
    try {
      const comments = await getCommentsFiltered(state.getSearchFor(ROUTE_KEY));
      wrap.innerHTML = '';
      if (!comments.length) { wrap.appendChild(Empty()); return; }
      const columns = [
        { key: 'id',    title: 'ID' },
        { key: 'name',  title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'body',  title: 'Body', render: (c) => clamp(c.body, 120) },
      ];
      wrap.appendChild(DataTable({ columns, rows: comments }));
    } catch (e) {
      wrap.innerHTML = '';
      wrap.appendChild(el('div', { class: 'error', text: 'Ошибка загрузки комментариев' }));
      console.error(e);
    }
  }
}
