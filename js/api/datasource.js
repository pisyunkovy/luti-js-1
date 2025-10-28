// js/api/datasource.js
import { state } from '../state.js';
import { qNormalize, includes } from '../utils/format.js';
import { fetchUsers, fetchTodos, fetchPosts, fetchComments } from './jsonplaceholder.js';
import {
  getLocalUsers, addLocalUser, removeLocalUser,
  getDeletedUserIds, hideRemoteUser,
  getLocalTodos, addLocalTodo, updateLocalTodo as _updateLocalTodo
} from './localstore.js';

async function ensure(key, fetcher) {
  if (!state.cache[key]) {
    const data = await fetcher();
    state.setCache(key, data);
  }
  return state.cache[key];
}

/** USERS */
export async function getUsersFiltered(qRaw = '') {
  const q = qNormalize(qRaw);
  const [remote, local, deleted] = await Promise.all([
    ensure('users', fetchUsers),
    Promise.resolve(getLocalUsers()),
    Promise.resolve(getDeletedUserIds())
  ]);
  const del = new Set(deleted);
  const merged = [...remote.filter(u => !del.has(u.id)), ...local];
  return merged.filter(u => includes(u.name, q) || includes(u.email, q));
}

export function addUserLocal(u) { addLocalUser(u); }
export function deleteUser(id)  { if (id < 0) removeLocalUser(id); else hideRemoteUser(id); }

/** TODOS */
export async function getTodosFiltered(qRaw = '') {
  const q = qNormalize(qRaw);
  const [remote, local] = await Promise.all([
    ensure('todos', fetchTodos),
    Promise.resolve(getLocalTodos())
  ]);
  const merged = [...remote, ...local];
  return merged.filter(t => includes(t.title, q));
}

export function addTodoLocal(todo)           { addLocalTodo(todo); }
export function updateLocalTodo(id, patch)   { _updateLocalTodo(id, patch); }

/** POSTS */
export async function getPostsFiltered(qRaw = '') {
  const q = qNormalize(qRaw);
  const posts = await ensure('posts', fetchPosts);
  return posts.filter(p => includes(p.title, q) || includes(p.body, q));
}

/** COMMENTS */
export async function getCommentsFiltered(qRaw = '') {
  const q = qNormalize(qRaw);
  const comments = await ensure('comments', fetchComments);
  return comments.filter(c => includes(c.name, q) || includes(c.body, q));
}

/** For forms */
export async function getAllUsersMerged() {
  const [remote, local, deleted] = await Promise.all([
    ensure('users', fetchUsers),
    Promise.resolve(getLocalUsers()),
    Promise.resolve(getDeletedUserIds())
  ]);
  const del = new Set(deleted);
  return [...remote.filter(u => !del.has(u.id)), ...local];
}
