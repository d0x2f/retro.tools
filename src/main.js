import crayon from 'crayon';
import svelte from 'crayon-svelte';
import animate from 'crayon-animate';
import Splash from './Splash.svelte';
import Board from './Board.svelte';

import { gtag } from './ga.js';
import { board, ranks } from './store.js';
import { getRanks, getBoard } from './api.js';

gtag('js', new Date());
gtag('config', 'UA-73143855-2');
gtag('config', 'AW-996832467');

async function mountBoard(res, boardId) {
  try {
    let [board_result, ranks_result] = await Promise.all([
      getBoard(boardId),
      getRanks(boardId),
    ]);
    board.set(board_result);
    ranks.set(ranks_result);
    return res.mount(Board, { nav: app });
  } catch {
    return res.mount(Splash, {
      nav: app,
      errorAlertVisible: true,
      errorAlertMessage: 'Unable to find requested board!',
    });
  }
}

const app = crayon.create();

app.use(svelte.router(document.body));
app.use(
  animate.defaults({
    name: 'rt-fade',
    duration: 300,
  })
);

app.path('/', (_req, res) => res.mount(Splash, { nav: app }));
app.path('/:id', async (req, res) => {
  const sub = app.events.subscribe(event => {
    if (event.type === 'ROUTER_END') {
      return mountBoard(res, req.params.id);
    }
  });
  res.onLeave(() => sub.unsubscribe());
});

app.load();
