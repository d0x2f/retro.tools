// TODO: config option
const api_host = 'https://retro.tools';
// const api_host = 'http://127.0.0.1:8000';

const common_options = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

async function request() {
  return fetch(...arguments);
}

async function requestJson() {
  return (await fetch(...arguments)).json();
}

export async function getBoard(boardId) {
  return requestJson(`${api_host}/boards/${boardId}`, common_options);
}

export async function getBoards() {
  return requestJson(`${api_host}/boards`, common_options);
}

export async function getRanks(boardId) {
  return requestJson(`${api_host}/boards/${boardId}/ranks`, common_options);
}

export async function updateBoard(board) {
  return requestJson(`${api_host}/boards/${board.id}`, {
    method: 'PATCH',
    body: JSON.stringify(board),
    ...common_options,
  });
}

export async function createRank(boardId, name, data) {
  return requestJson(`${api_host}/boards/${boardId}/ranks`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      data,
    }),
    ...common_options,
  });
}

export async function createBoard(name) {
  return requestJson(`${api_host}/boards`, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
    ...common_options,
  });
}

export async function getCards(boardId) {
  return requestJson(`${api_host}/boards/${boardId}/cards`, common_options);
}

export async function createCard(boardId, rankId, text) {
  return requestJson(`${api_host}/boards/${boardId}/ranks/${rankId}/cards`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Card',
      description: text,
    }),
    ...common_options,
  });
}

export async function updateCard(board, card, currentRankId) {
  if (!currentRankId) {
    currentRankId = card.rank_id;
  }
  return requestJson(
    `${api_host}/boards/${board.id}/ranks/${currentRankId}/cards/${card.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(card),
      ...common_options,
    }
  );
}

export function deleteCard(board, card) {
  return request(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}`,
    {
      method: 'DELETE',
      ...common_options,
    }
  );
}

export async function agree(board, card) {
  return requestJson(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'POST',
      ...common_options,
    }
  );
}

export async function undoAgree(board, card) {
  return requestJson(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'DELETE',
      ...common_options,
    }
  );
}

export function deleteRank(boardId, rankId) {
  return request(`${api_host}/boards/${boardId}/ranks/${rankId}`, {
    method: 'DELETE',
    ...common_options,
  });
}

export function deleteBoard(boardId) {
  return request(`${api_host}/boards/${boardId}`, {
    method: 'DELETE',
    ...common_options,
  });
}

export function getCSVUrl(board) {
  return `${api_host}/boards/${board.id}/csv`;
}
