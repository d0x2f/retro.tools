import crayon from 'crayon'
import svelte from 'crayon-svelte'
import Splash from './Splash.svelte';
import Board from './Board.svelte';

import { board, ranks } from "./store.js";
import { getRanks, getBoard } from "./api.js";

const app = crayon.create();

app.use(svelte.router(document.body));

app.path('/', (req, res) =>
  res.mount(Splash, { req, nav: app })
)

app.path('/:id', async (req, res) => {
  let [board_result, ranks_result] = await Promise.all([
    getBoard(req.params.id),
    getRanks(req.params.id)
  ]);
  board.set(board_result);
  ranks.set(ranks_result);
  res.mount(Board, { req, nav: app })
});

app.load();