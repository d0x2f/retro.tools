let api_host = window.origin;

const common_options = {
  mode: "cors",
  cache: "no-cache",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

async function request(input, init) {
  return fetch(input, init);
}

async function requestJson(input, init) {
  return (await fetch(input, init)).json();
}

export async function createAuthToken() {
  return (await request(`${api_host}/auth`, common_options)).text();
}

export async function getBoard(boardId) {
  return requestJson(`${api_host}/boards/${boardId}`, common_options);
}

export async function getBoards() {
  return requestJson(`${api_host}/boards`, common_options);
}

export async function getRanks(boardId) {
  return requestJson(`${api_host}/boards/${boardId}/columns`, common_options);
}

export async function updateBoard(board) {
  return requestJson(`${api_host}/boards/${board.id}`, {
    method: "PATCH",
    body: JSON.stringify(board),
    ...common_options,
  });
}

export async function updateRank(boardId, rank) {
  return requestJson(`${api_host}/boards/${boardId}/columns/${rank.id}`, {
    method: "PATCH",
    body: JSON.stringify(rank),
    ...common_options,
  });
}

export async function createRank(boardId, name, position, data) {
  return requestJson(`${api_host}/boards/${boardId}/columns`, {
    method: "POST",
    body: JSON.stringify({
      name,
      position,
      data,
    }),
    ...common_options,
  });
}

export async function createBoard(name, data, ice_breaking) {
  return requestJson(`${api_host}/boards`, {
    method: "POST",
    body: JSON.stringify({
      name,
      data,
      cards_open: true,
      voting_open: true,
      ice_breaking,
    }),
    ...common_options,
  });
}

export async function getCards(boardId) {
  return requestJson(`${api_host}/boards/${boardId}/cards`, common_options);
}

export async function createCard(boardId, rankId, text, author) {
  return requestJson(`${api_host}/boards/${boardId}/columns/${rankId}/cards`, {
    method: "POST",
    body: JSON.stringify({
      text,
      author,
    }),
    ...common_options,
  });
}

export async function updateCard(board, card) {
  return requestJson(`${api_host}/boards/${board.id}/cards/${card.id}`, {
    method: "PATCH",
    body: JSON.stringify(card),
    ...common_options,
  });
}

export function deleteCard(board, card) {
  return request(`${api_host}/boards/${board.id}/cards/${card.id}`, {
    method: "DELETE",
    ...common_options,
  });
}

export async function agree(board, card) {
  return request(`${api_host}/boards/${board.id}/cards/${card.id}/vote`, {
    method: "PUT",
    ...common_options,
  });
}

export async function undoAgree(board, card) {
  return request(`${api_host}/boards/${board.id}/cards/${card.id}/vote`, {
    method: "DELETE",
    ...common_options,
  });
}

export function deleteRank(boardId, rankId) {
  return request(`${api_host}/boards/${boardId}/columns/${rankId}`, {
    method: "DELETE",
    ...common_options,
  });
}

export function deleteBoard(boardId) {
  return request(`${api_host}/boards/${boardId}`, {
    method: "DELETE",
    ...common_options,
  });
}

export async function react(board, card, reaction) {
  return request(`${api_host}/boards/${board.id}/cards/${card.id}/react`, {
    method: "PUT",
    body: JSON.stringify({ emoji: reaction }),
    ...common_options,
  });
}

export async function undoReact(board, card) {
  return request(`${api_host}/boards/${board.id}/cards/${card.id}/react`, {
    method: "DELETE",
    ...common_options,
  });
}

export function getCSVUrl(board) {
  return `${api_host}/boards/${board.id}/csv`;
}
