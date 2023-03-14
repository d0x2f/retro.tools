import { writable } from "svelte/store";

function createSet() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    replace: (id, card) =>
      update((store) => {
        const index = store.findIndex((c) => c.id === id);
        if (index !== -1) {
          store[index] = card;
        } else {
          store.push(card);
        }
        return store;
      }),
    remove: (id) =>
      update((store) => {
        const index = store.findIndex((c) => c.id === id);
        if (index !== -1) {
          store.splice(index, 1);
        }
        return store;
      }),
  };
}

export const board = writable({
  cards_open: false,
  id: "none",
  max_votes: 0,
  name: "Unknown Board",
  voting_open: false,
  ice_breaking: "",
  error: "",
  owner: false,
  data: {
    encryptionTest: "encryptionTest",
  },
});

export const ranks = createSet();
export const cards = createSet();
export const sorted = writable(false);
export const password = writable("");
export const author = writable("");
export const focusedRank = writable("");
export const firebaseToken = writable("");
export const uid = writable("");
