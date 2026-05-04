<script>
  import { Router, Route } from 'svelte-routing';
  import { fade } from 'svelte/transition';

  import Splash from './Splash.svelte';
  import Board from './Board.svelte';
  import { colorMode, darkMode } from './store';
  import { onMount } from 'svelte';

  let { url = '' } = $props();

  onMount(() => {
    const darkModeChangeListener = (m) =>
      document.documentElement.setAttribute('data-bs-theme', m);
    const unsubscribeDarkModeChange = colorMode.subscribe(
      darkModeChangeListener
    );

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSchemeChange = (e) => {
      const systemPreference = e.matches;
      const appPreference = window.localStorage.getItem('darkModePreference');
      if (appPreference) {
        $darkMode = appPreference === 'dark';
      } else {
        $darkMode = systemPreference;
      }
    };
    prefersDarkScheme.addEventListener('change', handleSchemeChange);
    return () => {
      unsubscribeDarkModeChange();
      prefersDarkScheme.removeEventListener('change', handleSchemeChange);
    };
  });
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
        errorAlertVisible={true}
        errorAlertMessage="error.board_not_found"
      />
    </div>
  </Route>
  <Route path="/:id">
    {#snippet children({ params })}
      <div class="h-100" in:fade out:fade>
        <Board boardId={params.id} />
      </div>
    {/snippet}
  </Route>
</Router>
