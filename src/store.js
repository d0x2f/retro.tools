import { writable } from 'svelte/store';

export const board = writable({
  cards_open: false,
  id: "none",
  max_votes: 0,
  name: "Unknown Board",
  voting_open: false
});

export const ranks = writable([]);

function createCards() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set: (rankId, cards) => update(store => { store[rankId] = cards; return store; }),
    append: card => update(store => {
      store[card.rank_id].push(card);
      return store;
    }),
    replace: (id, card) => update(store => {
      const index = store[card.rank_id].findIndex(c => c.id === id)
      store[card.rank_id][index] = card;
      return store;
    })
  };
}

export const cards = createCards();