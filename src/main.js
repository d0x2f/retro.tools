import crayon from 'crayon';
import svelte from 'crayon-svelte';
import animate from 'crayon-animate';
import Splash from './Splash.svelte';
import Board from './Board.svelte';

import { gtag } from './ga.js';
import { board, ranks } from './store.js';
import { getRanks, getBoard } from './api.js';
import './i18n.js';

gtag('js', new Date());
gtag('config', 'UA-73143855-2');
gtag('config', 'AW-996832467');

async function mountBoard(context, boardId) {
  try {
    let [board_result, ranks_result] = await Promise.all([
      getBoard(boardId),
      getRanks(boardId),
    ]);
    board.set(board_result);
    ranks.set(ranks_result);
    return context.mount(Board, { nav: app });
  } catch {
    return context.mount(Splash, {
      nav: app,
      errorAlertVisible: true,
      errorAlertMessage: 'error.board_not_found',
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

app.path('/', context => context.mount(Splash, { nav: app }));
app.path('/:id', async context => {
  const sub = app.events.subscribe(event => {
    if (event.type === crayon.RouterEventType.ProgressEnd) {
      return mountBoard(context, context.params.id);
    }
  });
  context.onLeave(() => sub.unsubscribe());
});

app.load();
