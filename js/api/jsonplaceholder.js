// js/api/jsonplaceholder.js
const BASE = 'https://jsonplaceholder.typicode.com';

async function _fetch(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.status === 429) throw new Error('Rate limited');
      if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
      return await r.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(res => setTimeout(res, 400 * (i + 1))); // простой backoff
    }
  }
}

export const fetchUsers = () => _fetch(`${BASE}/users`);
export const fetchTodos = () => _fetch(`${BASE}/todos`);
export const fetchPosts = () => _fetch(`${BASE}/posts`);
export const fetchComments = () => _fetch(`${BASE}/comments`);
