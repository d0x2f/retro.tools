<script>
  import { Router, Route } from "svelte-routing";
  import { fade } from "svelte/transition";

  import Splash from "./Splash.svelte";
  import Board from "./Board.svelte";
  import { colorMode, darkMode } from "./store";
  import { onMount } from "svelte";

  export let url = "";

  onMount(() => {
    const darkModeChangeListener = (m) =>
      document.documentElement.setAttribute("data-bs-theme", m);
    const unsubscribeDarkModeChange = colorMode.subscribe(
      darkModeChangeListener
    );

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDarkScheme.addEventListener("change", (e) => {
      const systemPreference = e.matches;
      const appPreference = window.localStorage.getItem("darkModePreference");

      // Update color theme if the user hasn't set an app preference
      if (appPreference) {
        $darkMode = appPreference === "dark";
      } else {
        $darkMode = systemPreference;
      }
    });
    return () => {
      unsubscribeDarkModeChange();
      prefersDarkScheme.removeEventListener("change", darkModeChangeListener);
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
  <Route path="/:id" let:params>
    <div class="h-100" in:fade out:fade>
      <Board boardId={params.id} />
    </div>
  </Route>
</Router>
