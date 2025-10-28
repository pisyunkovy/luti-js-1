// js/components/todoForm.js
import { el } from '../utils/dom.js';

export function TodoForm({ users = [], onAdd }) {
  const userSel = el('select');
  users.forEach(u => userSel.appendChild(el('option', { attrs: { value: u.id }, text: `${u.name} (${u.email})` })));
  const title = el('input', { attrs: { placeholder: 'Title' } });
  const btn = el('button', { class: 'btn primary', text: 'Добавить todo' });

  btn.addEventListener('click', () => {
    const uid = Number(userSel.value);
    const t = title.value.trim();
    if (!t) return alert('Введите title');
    onAdd?.({ id: -Date.now(), userId: uid, title: t, completed: false });
    title.value = '';
  });

  return el('div', { class: 'form', children: [
    el('div', { class: 'field', children: [ el('label', { text: 'Пользователь' }), userSel ] }),
    el('div', { class: 'field', children: [ el('label', { text: 'Title' }), title ] }),
    btn
  ]});
}
