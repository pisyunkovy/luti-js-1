// js/components/empty.js
import { el } from '../utils/dom.js';
export const Empty = (text = 'Ничего не найдено') => el('div', { class: 'empty', text });
