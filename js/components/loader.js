// js/components/loader.js
import { el } from '../utils/dom.js';
export const Loader = (text = 'Загрузка…') => el('div', { class: 'loader', text });
