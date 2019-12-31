// TODO: config option
const api_host = 'https://api.retrograde.dyl.dog';

export async function getBoard(boardId) {
  const response = await fetch(`${api_host}/boards/${boardId}`, {
    credentials: 'include',
  });
  return await response.json();
}

export async function getRanks(boardId) {
  const response = await fetch(`${api_host}/boards/${boardId}/ranks`, {
    credentials: 'include',
  });
  return await response.json();
}

export async function updateBoard(board) {
  const response = await fetch(`${api_host}/boards/${board.id}`, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(board),
  });
  return await response.json();
}

export async function createRank(boardId, name) {
  let response = await fetch(`${api_host}/boards/${boardId}/ranks`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  });
  return await response.json();
}

export async function createBoard(name) {
  let response = await fetch(`${api_host}/boards`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  });
  return await response.json();
}

export async function getCards(boardId) {
  const response = await fetch(`${api_host}/boards/${boardId}/cards`, {
    credentials: 'include',
  });
  return await response.json();
}

export async function createCard(boardId, rankId, text) {
  const response = await fetch(
    `${api_host}/boards/${boardId}/ranks/${rankId}/cards`,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Card',
        description: text,
      }),
    }
  );
  return await response.json();
}

export async function updateCard(board, card, current_rank_id) {
  if (!current_rank_id) {
    current_rank_id = card.rank_id;
  }
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${current_rank_id}/cards/${card.id}`,
    {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    }
  );
  return await response.json();
}

export async function agree(board, card) {
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
    }
  );
  return await response.json();
}

export async function undoAgree(board, card) {
  const response = await fetch(
    `${api_host}/boards/${board.id}/ranks/${card.rank_id}/cards/${card.id}/vote`,
    {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
    }
  );
  return await response.json();
}

export async function deleteRank(boardId, rankId) {
  const response = await fetch(
    `${api_host}/boards/${boardId}/ranks/${rankId}`,
    {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
    }
  );
  return await response.json();
}
