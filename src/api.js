// TODO: config option
const api_host = 'https://api.retro.tools';
// const api_host = 'http://127.0.0.1:8000';

const common_options = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include',
};

export async function getBoard(boardId) {
  const response = await fetch(`${api_host}/boards/${boardId}`, common_options);
  return await response.json();
}

export async function getRanks(boardId) {
  const response = await fetch(
    `${api_host}/boards/${boardId}/ranks`,
    common_options
  );
  return await response.json();
}

export async function updateBoard(board) {
  const response = await fetch(`${api_host}/boards/${board.id}`, {
    method: 'PATCH',
    body: JSON.stringify(board),
    ...common_options,
  });
  return await response.json();
}

export async function createRank(boardId, name, data) {
  let response = await fetch(`${api_host}/boards/${boardId}/ranks`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      data,
    }),
    ...common_options,
  });
  return await response.json();
}

export async function createBoard(name) {
  let response = await fetch(`${api_host}/boards`, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
    ...common_options,
  });
  return await response.json();
}

export async function getCards(boardId) {
  const response = await fetch(
    `${api_host}/boards/${boardId}/cards`,
    common_options
  );
  return await response.json();
}

export async function createCard(boardId, rankId, text) {
  const response = await fetch(
    `${api_host}/boards/${boardId}/ranks/${rankId}/cards`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'Card',
        description: text,
      }),
      ...common_options,
    }
  );
  return await response.json();
}

export async function updateCard(board, card, currentRankId) {
  if (!currentRankId) {
    currentRankId = card.rank_id;
  }
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${currentRankId}/cards/${card.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(card),
      ...common_options,
    }
  );
  return await response.json();
}

export function deleteCard(board, card) {
  return fetch(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}`,
    {
      method: 'DELETE',
      ...common_options,
    }
  );
}

export async function agree(board, card) {
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'POST',
      ...common_options,
    }
  );
  return await response.json();
}

export async function undoAgree(board, card) {
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'DELETE',
      ...common_options,
    }
  );
  return await response.json();
}

export function deleteRank(boardId, rankId) {
  return fetch(`${api_host}/boards/${boardId}/ranks/${rankId}`, {
    method: 'DELETE',
    ...common_options,
  });
}

export function getCSVUrl(board) {
  return `${api_host}/boards/${board.id}/csv`;
}
