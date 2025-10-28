// js/components/header.js
import { el } from '../utils/dom.js';

function navLink(hash, text) {
  const a = el('a', { attrs: { href: hash }, text });
  if (location.hash === hash) a.classList.add('active');
  return a;
}

export function Header() {
  return el('div', { class: 'app-card app-header', children: [
    el('h1', { text: 'JSONPlaceholder SPA' }),
    el('nav', { class: 'nav', children: [
      navLink('#users', 'Пользователи'),
      navLink('#users#todos', 'ToDo'),
      navLink('#users#posts', 'Посты'),
      navLink('#users#posts#comments', 'Комментарии'),
    ]})
  ]});
}
