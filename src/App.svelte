<script>
  import { Router, Link, Route } from 'svelte-routing';

  import { gtag } from './ga.js';

  import Splash from './Splash.svelte';
  import Board from './Board.svelte';

  export let url = '';

  gtag('js', new Date());
  gtag('config', 'UA-73143855-2');
  gtag('config', 'AW-996832467');
</script>

<Router {url}>
  <Route path="/">
    <Splash />
  </Route>
  <Route path="/not-found">
    <Splash
      errorAlertVisible="true"
      errorAlertMessage="error.board_not_found" />
  </Route>
  <Route path="/:id" let:params>
    <Board boardId={params.id} />
  </Route>
</Router>
