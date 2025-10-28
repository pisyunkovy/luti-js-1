// js/components/searchbar.js
import { el } from '../utils/dom.js';
import { debounce } from '../utils/debounce.js';

export function SearchBar({ placeholder = 'Поиск…', onChange }) {
  const input = el('input', { attrs: { type: 'search', placeholder } });
  input.addEventListener('input', debounce(() => onChange?.(input.value), 400));
  return el('div', { class: 'searchbar', children: [ input ] });
}
