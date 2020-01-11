import { writable } from 'svelte/store';

export const board = writable({
  cards_open: false,
  id: 'none',
  max_votes: 0,
  name: 'Unknown Board',
  voting_open: false,
});

export const ranks = writable([]);

function createCards() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    append: card =>
      update(store => {
        store.push(card);
        return store;
      }),
    replace: (id, card) =>
      update(store => {
        const index = store.findIndex(c => c.id === id);
        store[index] = card;
        return store;
      }),
  };
}

export const cards = createCards();

export const settings = writable({
  sorted: false
});