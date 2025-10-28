// js/state.js
const listeners = new Set();

export const state = {
  cache: { users: null, todos: null, posts: null, comments: null },

  searchByRoute: Object.create(null),

  setSearchFor(routeKey, q) {
    this.searchByRoute[routeKey] = q;
    emit();
  },
  getSearchFor(routeKey) {
    return this.searchByRoute[routeKey] || '';
  },

  setCache(key, data) {
    this.cache[key] = data;
    emit();
  }
};

export function onState(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function emit() { for (const cb of listeners) cb(state); }
