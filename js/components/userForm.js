// js/components/userForm.js
import { el } from '../utils/dom.js';

export function UserForm({ onAdd }) {
  const name = el('input', { attrs: { placeholder: 'Имя' } });
  const email = el('input', { attrs: { placeholder: 'Email', type: 'email' } });
  const btn = el('button', { class: 'btn primary', text: 'Добавить' });

  btn.addEventListener('click', () => {
    const n = name.value.trim();
    const e = email.value.trim();
    if (!n || !e || !e.includes('@')) return alert('Введите корректные имя и email');
    onAdd?.({ id: -Date.now(), name: n, email: e });
    name.value = '';
    email.value = '';
  });

  return el('div', { class: 'form', children: [
    el('div', { class: 'field', children: [ el('label', { text: 'Имя' }), name ] }),
    el('div', { class: 'field', children: [ el('label', { text: 'Email' }), email ] }),
    btn
  ]});
}
