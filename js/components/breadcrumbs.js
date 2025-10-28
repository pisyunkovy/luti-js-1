// js/components/breadcrumbs.js
import { NAV_MAP } from '../utils/navmap.js';
import { el } from '../utils/dom.js';

export function Breadcrumbs(segments) {
  // segments: ['users','posts','comments']
  const items = [];
  let acc = [];
  segments.forEach((s, i) => {
    acc.push(s);
    const hash = '#' + acc.join('#');
    const title = NAV_MAP[s] || s;
    const isLast = i === segments.length - 1;
    items.push(
      isLast
        ? el('span', { text: title })
        : el('a', { attrs: { href: hash }, text: title })
    );
    if (!isLast) items.push(el('span', { class: 'breadcrumbs__sep', text: '/' }));
  });

  return el('div', { class: 'breadcrumbs', children: items });
}
