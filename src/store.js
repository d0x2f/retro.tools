import { writable } from 'svelte/store';

export const board = writable({
  cards_open: false,
  id: "none",
  max_votes: 0,
  name: "Unknown Board",
  voting_open: false
});

export const ranks = writable([]);