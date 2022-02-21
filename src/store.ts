import { writable } from 'svelte/store';

export const teams = writable([]);
export const locals = writable([]);
export const aways = writable([]);
export const table = writable([]);
export const addTeamInput = writable('');
export const awaysSelect = writable([]);
export const localsSelect = writable([]);
export const isTableVisible = writable(false);
