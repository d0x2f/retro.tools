import { writable } from 'svelte/store';

function createCards() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    append: (card) =>
      update((store) => {
        store.push(card);
        return store;
      }),
    replace: (id, card) =>
      update((store) => {
        const index = store.findIndex((c) => c.id === id);
        Object.assign(store[index], card);
        return store;
      }),
    remove: (id) =>
      update((store) => {
        const index = store.findIndex((c) => c.id === id);
        store.splice(index, 1);
        return store;
      }),
  };
}

export const board = writable({
  cards_open: false,
  id: 'none',
  max_votes: 0,
  name: 'Unknown Board',
  voting_open: false,
});

export const ranks = writable([]);
export const cards = createCards();
export const sorted = writable(false);
export const password = writable('');
export const author = writable('');
export const focusedRank = writable('');
