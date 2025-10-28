// js/router.js
import { renderUsers } from './screens/users.js';
import { renderTodos } from './screens/todos.js';
import { renderPosts } from './screens/posts.js';
import { renderComments } from './screens/comments.js';

export function getSegments() {
  const raw = (location.hash || '').replace(/^#/, '');
  return raw.split('#').filter(Boolean);
}

export function navigate(hash) {
  location.hash = hash;
}

export function route(container) {
  const segs = getSegments();
  const key = segs.join('#') || 'users'; // дефолт — users

  // Поддерживаем ровно требуемые пути:
  switch (key) {
    case 'users':
      renderUsers(container); break;
    case 'users#todos':
      renderTodos(container); break;
    case 'users#posts':
      renderPosts(container); break;
    case 'users#posts#comments':
      renderComments(container); break;
    default:
      // 404 простенькая
      container.innerHTML = '';
      container.appendChild(document.createTextNode('Страница не найдена'));
  }
}
