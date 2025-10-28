// js/utils/dom.js
export function el(tag, opts = {}) {
  const { class: className, attrs = {}, on = {}, text, children = [] } = opts;
  const node = document.createElement(tag);

  if (className) node.className = className;

  // ✅ короткая запись id: el('div', { id: 'users-form' })
  if (opts.id) node.id = String(opts.id);

  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const [ev, handler] of Object.entries(on)) {
    node.addEventListener(ev, handler);
  }
  if (text !== undefined) node.textContent = text;

  for (const child of (Array.isArray(children) ? children : [children])) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}
