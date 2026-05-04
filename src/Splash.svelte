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

  let {
    errorAlertVisible = $bindable(false),
    errorAlertMessage = $bindable("error.network"),
  } = $props();

  let boards = $state([]);
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

  function handleError({ message, err }) {
    error(message, err);
  }

  onMount(doGetBoards);
</script>

<svelte:head>
  <meta property="og:url" content="https://retro.tools" />
</svelte:head>

<div class="d-flex flex-column scroll h-100">
  <div class="px-2 pt-1 pb-5">
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
          textColor="body"
          class="me-1"
          onclick={() => {
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
          textColor="body"
          href="https://github.com/d0x2f/retro.tools"
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
          textColor="body"
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
        <h1
          data-name="splash-hero"
          class="text-center mb-5 text-body"
          style="margin-top: 100px;"
        >
          {$_("splash.hero_text")}
        </h1>
        <div class="d-flex flex-column justify-content-center">
          <CreateForm
            onerror={handleError}
            oncreated={(boardId) => navigate(`/${boardId}`)}
          />
          <BoardTable
            {boards}
            onclick={(boardId) => navigate(`/${boardId}`)}
            onerror={handleError}
            ondeleted={doGetBoards}
          />
        </div>
      </div>
    </div>
  </div>
  <div class="flex-grow-1 mid-section"></div>
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
            <h5 class="card-title">{$_("splash.features.anonymous.title")}</h5>
            <p class="card-text">
              {$_("splash.features.anonymous.body_1")}
              <br />
              <br />
              <a
                class="text-{$colorMode}"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/d0x2f/retro.tools"
              >
                {$_("splash.features.anonymous.code_link")}
              </a>
              {$_("splash.features.anonymous.body_2")}
              <br />
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.phone size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">{$_("splash.features.simple.title")}</h5>
            <p class="card-text">
              {$_("splash.features.simple.body")}
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.code size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">
              {$_("splash.features.open_source.title")}
            </h5>
            <p class="card-text">
              {$_("splash.features.open_source.body")}
              <a
                class="text-{$colorMode}"
                rel="noreferrer"
                target="_blank"
                href="https://github.com/d0x2f/retro.tools"
              >
                {$_("splash.features.open_source.github_link")}
              </a>
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-top">
            <Icons.login size="100%" />
          </div>
          <div class="card-body">
            <h5 class="card-title">{$_("splash.features.no_logins.title")}</h5>
            <p class="card-text">
              {$_("splash.features.no_logins.body")}
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
            <h5 class="card-title">{$_("splash.features.encryption.title")}</h5>
            <p class="card-text">
              {$_("splash.features.encryption.body_1")}
              <br />
              <br />
              {$_("splash.features.encryption.body_2")}
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
    <Alert
      data-name="error-alert"
      class="fixed-bottom mb-0 py-1"
      color="danger"
      isOpen={true}
    >
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
