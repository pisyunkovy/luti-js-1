// js/components/list.js
import { el } from '../utils/dom.js';

export function DataTable({ columns, rows }) {
  const thead = el('thead', { children: [
    el('tr', { children: columns.map(c => el('th', { text: c.title })) })
  ]});
  const tbody = el('tbody', {
    children: rows.map(row => el('tr', {
      children: columns.map(c => el('td', {
        children: [ typeof c.render === 'function' ? c.render(row) : String(row[c.key] ?? '') ]
      }))
    }))
  });
  return el('table', { class: 'table', children: [ thead, tbody ] });
}
