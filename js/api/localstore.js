// js/api/localstore.js
const K_USERS = 'localUsers';
const K_DELETED = 'deletedUsers';
const K_TODOS = 'localTodos';

const read  = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export function getLocalUsers()        { return read(K_USERS); }
export function setLocalUsers(arr)     { write(K_USERS, arr); }
export function getDeletedUserIds()    { return read(K_DELETED); }
export function setDeletedUserIds(arr) { write(K_DELETED, arr); }
export function getLocalTodos()        { return read(K_TODOS); }
export function setLocalTodos(arr)     { write(K_TODOS, arr); }

export function addLocalUser(u) {
  const arr = getLocalUsers();
  arr.push(u);
  setLocalUsers(arr);
}

export function removeLocalUser(id) {
  setLocalUsers(getLocalUsers().filter(u => u.id !== id));
  // удалить его локальные todos
  setLocalTodos(getLocalTodos().filter(t => t.userId !== id));
}

export function hideRemoteUser(id) {
  const del = new Set(getDeletedUserIds());
  del.add(id);
  setDeletedUserIds([...del]);
}

export function addLocalTodo(todo) {
  const arr = getLocalTodos();
  arr.push(todo);
  setLocalTodos(arr);
}

// ✅ новое: обновлять локальный todo (напр. completed)
export function updateLocalTodo(id, patch) {
  const arr = getLocalTodos();
  const idx = arr.findIndex(t => t.id === id);
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...patch };
    setLocalTodos(arr);
  }
}
