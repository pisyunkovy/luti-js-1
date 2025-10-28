// js/main.js
import { route } from './router.js';

const container = document.getElementById('app');

function render() { route(container); }
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

// Дефолтный маршрут:
if (!location.hash) location.hash = '#users';
