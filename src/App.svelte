<script>
  import { Router, Route } from 'svelte-routing';
  import { fade } from 'svelte/transition';

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
    <div class="h-100" in:fade out:fade>
      <Splash />
    </div>
  </Route>
  <Route path="/not-found">
    <div class="h-100" in:fade out:fade>
      <Splash
        errorAlertVisible="true"
        errorAlertMessage="error.board_not_found" />
    </div>
  </Route>
  <Route path="/:id" let:params>
    <div class="h-100" in:fade out:fade>
      <Board boardId={params.id} />
    </div>
  </Route>
</Router>
