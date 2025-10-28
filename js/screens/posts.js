// js/screens/posts.js
import { el } from '../utils/dom.js';
import { Header } from '../components/header.js';
import { Breadcrumbs } from '../components/breadcrumbs.js';
import { SearchBar } from '../components/searchbar.js';
import { DataTable } from '../components/list.js';
import { Loader } from '../components/loader.js';
import { Empty } from '../components/empty.js';
import { state } from '../state.js';
import { getPostsFiltered } from '../api/datasource.js';
import { clamp } from '../utils/format.js';

const ROUTE_KEY = 'users#posts';

export async function renderPosts(container) {
  container.innerHTML = '';
  const root = el('div', { children: [
    Header(),
    el('div', { class: 'app-card', children: [
      Breadcrumbs(['users','posts']),
      el('div', { id: 'posts-search' }),
      el('div', { id: 'posts-list' }),
    ]})
  ]});
  container.appendChild(root);

  const searchWrap = root.querySelector('#posts-search');
  const search = SearchBar({
    placeholder: 'Искать в title/body…',
    onChange: (v) => { state.setSearchFor(ROUTE_KEY, v); drawList(); }
  });
  searchWrap.appendChild(search);
  search.querySelector('input').value = state.getSearchFor(ROUTE_KEY);

  drawList();

  async function drawList() {
    const wrap = root.querySelector('#posts-list');
    wrap.innerHTML = '';
    wrap.appendChild(Loader('Загружаем посты…'));
    try {
      const posts = await getPostsFiltered(state.getSearchFor(ROUTE_KEY));
      wrap.innerHTML = '';
      if (!posts.length) { wrap.appendChild(Empty()); return; }
      const columns = [
        { key: 'id',    title: 'ID' },
        { key: 'title', title: 'Title' },
        { key: 'body',  title: 'Body', render: (p) => clamp(p.body, 120) },
      ];
      wrap.appendChild(DataTable({ columns, rows: posts }));
    } catch (e) {
      wrap.innerHTML = '';
      wrap.appendChild(el('div', { class: 'error', text: 'Ошибка загрузки постов' }));
      console.error(e);
    }
  }
}
