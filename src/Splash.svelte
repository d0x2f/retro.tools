<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import { getBoards } from "./api.js";
  import { Icons } from "./data.js";
  import { colorMode, darkMode } from "./store.js";

  import BoardTable from "./components/BoardTable.svelte";
  import LocaleSelect from "./components/LocaleSelect.svelte";
  import Alert from "./components/Alert.svelte";
  import CreateForm from "./components/CreateForm.svelte";
  import Button from "./components/Button.svelte";

  export let errorAlertVisible = false;
  export let errorAlertMessage = "error.network";

  let boards = [];
  let errorClearTimeout;

  async function doGetBoards() {
    // If the getBoards request fails, just silently omit the board list
    try {
      boards = await getBoards();
    } catch {
      boards = [];
    }
  }

  function error(message, err) {
    if (err) console.error(err);
    errorAlertVisible = true;
    errorAlertMessage = message;

    if (errorClearTimeout) clearTimeout(errorClearTimeout);
    errorClearTimeout = setTimeout(() => (errorAlertVisible = false), 3000);
  }

  function handleError({ detail: { message, err } }) {
    error(message, err);
  }

  onMount(doGetBoards);
</script>

<svelte:head>
  <meta property="og:url" content="https://retro.tools" />
</svelte:head>

<div class="d-flex flex-column scroll h-100">
  <div class="px-2 pt-1 pb-5 bg-{$colorMode}">
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <h3
        class="text-uppercase fw-bold p-0 m-0"
        class:text-primary={!$darkMode}
        class:text-secondary={$darkMode}
      >
        retro.tools
      </h3>
      <div class="text-end flex-grow-1 text-nowrap d-flex justify-content-end">
        <Button
          id="darkLightToggle"
          color={$colorMode}
          on:click={() => {
            $darkMode = !$darkMode;
            window.localStorage.setItem("darkModePreference", $colorMode);
          }}
        >
          <div class="icon low-brightness">
            {#if $darkMode}
              <Icons.sunrise class="align-top" size="100%" />
            {:else}
              <Icons.sunset class="align-top" size="100%" />
            {/if}
          </div>
        </Button>
        <Button
          color={$colorMode}
          href="https://github.com/d0x2f/retrograde.js"
          rel="noreferrer"
          target="_blank"
          class="me-1"
        >
          <div class="icon low-brightness">
            <Icons.github class="align-top" size="100%" />
          </div>
          GitHub
        </Button>
        <Button
          color={$colorMode}
          class="me-1"
          href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=FJMVB9QFZQ79J&amp;source=url"
          rel="noreferrer"
          target="_blank"
        >
          <div class="icon text-danger">
            <Icons.heart class="align-top" size="100%" />
          </div>
          {$_("general.donate")}
        </Button>
        <LocaleSelect />
      </div>
    </div>
    <hr class="mt-1 mb-4" />
    <div class="d-flex justify-content-center">
      <div class="top-section">
        <h1 class="text-center mb-5 text-body" style="margin-top: 100px;">
          {$_("splash.hero_text")}
        </h1>
        <div class="d-flex flex-column justify-content-center">
          <CreateForm
            on:error={handleError}
            on:created={({ detail: boardId }) => navigate(`/${boardId}`)}
          />
          <BoardTable
            {boards}
            on:click={({ detail: boardId }) => navigate(`/${boardId}`)}
            on:error={handleError}
            on:deleted={doGetBoards}
          />
        </div>
      </div>
    </div>
  </div>
  <div class="bg-{$colorMode} flex-grow-1 mid-section" />
  <div
    class="d-flex justify-content-center py-5 text-{$colorMode}"
    class:bg-primary={!$darkMode}
    class:bg-secondary={$darkMode}
  >
    <div class="d-flex flex-column">
      <div class="d-flex justify-content-around py-4 flex-wrap">
        <div class="card">
          <div class="card-top">
            <Icons.anonymous size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">Anonymous</h5>
            <p class="card-text">
              No personal information is stored and you're free to delete boards
              for absolute certainty.
              <br />
              <br />
              <a
                class="text-{$colorMode}"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/d0x2f/retrograde.js"
              >
                Our code
              </a>
              is publicly available for anyone to verify.
              <br />
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.phone size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">Simple, Clean & Intuitive</h5>
            <p class="card-text">
              Our primary design goal is simplicity, we believe that tools
              should be easy to understand and require no manual.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.code size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">Free & Open Source</h5>
            <p class="card-text">
              Retro.tools is free to use and the source code is available on
              <a
                class="text-{$colorMode}"
                rel="noreferrer"
                target="_blank"
                href="https://github.com/d0x2f/retrograde.js"
              >
                GitHub.
              </a>
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.login size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">No Logins!</h5>
            <p class="card-text">
              To stay anonymous and convenient, we won't ask you to create an
              account or to provide any other information, simply click and go!
              <br />
              <br />
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.lock size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">End to End Encryption</h5>
            <p class="card-text">
              Board encryption is optionally available using a password.
              <br />
              <br />
              All encryption is handled by the browser and our backend sees nothing
              but encrypted data!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{#if errorAlertVisible}
  <div
    class="fixed-bottom"
    in:fly={{ y: 100, duration: 200 }}
    out:fly={{ y: 100, duration: 200 }}
  >
    <Alert class="fixed-bottom mb-0 py-1" color="danger" isOpen={true}>
      {$_(errorAlertMessage)}
    </Alert>
  </div>
{/if}

<style>
  .scroll {
    overflow: auto;
  }

  .icon {
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
  }

  .low-brightness {
    filter: brightness(0.6);
  }

  .card-text {
    opacity: 0.7;
  }

  .card {
    flex-basis: 10em;
    max-width: 20em;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 1em;
    background-color: #0000;
    border: 0;
  }

  .card-top {
    height: 3em;
    width: 3em;
    margin: 0 auto;
  }

  .card-title {
    text-align: center;
  }

  .top-section {
    width: 40em;
  }

  .mid-section {
    flex-basis: 100px;
    flex-shrink: 0;
  }
</style>
