<script>
  import { navigate } from "svelte-routing";

  import LocaleSelect from "./LocaleSelect.svelte";
  import EncryptedText from "./EncryptedText.svelte";
  import Menu from "./Menu.svelte";

  import { board, colorMode, password, darkMode } from "../store.js";
  import { decrypt, encrypt, checkBoardPassword } from "../encryption.js";
  import Button from "./Button.svelte";
  import { Icons } from "../data";
  import Input from "./Input.svelte";

  let editMode = false;
  let newBoardName = "";

  async function startEdit() {
    if ($board.owner && (await checkBoardPassword($board, $password))) {
      editMode = true;
      newBoardName = await decrypt($board.name, $password);
    }
  }

  function cancelEdit() {
    editMode = false;
  }

  async function submitEdit() {
    $board.name = await encrypt(newBoardName, $password);
    editMode = false;
  }
</script>

<div class="on-top">
  <div class="d-flex justify-content-between flex-wrap">
    <div class="d-flex flex-column justify-content-center">
      <h3
        data-name="home-link"
        class="text-uppercase fw-bold ps-2 m-0 home-link"
        class:text-primary={!$darkMode}
        class:text-secondary={$darkMode}
        on:keypress={null}
        on:click={() => navigate("/")}
      >
        retro.tools
      </h3>
    </div>

    <div
      data-name="board-title"
      class="text-center d-none m-0 d-lg-block h3 w-50 text-body"
      on:keypress={null}
      on:click={startEdit}
    >
      {#if editMode}
        <Input
          data-name="board-title-edit-field"
          autofocus
          bind:value={newBoardName}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit}
          class="p-0 text-center big-text border-0"
        />
      {:else}
        <EncryptedText bind:text={$board.name} />
      {/if}
    </div>
    <div class="d-flex flex-grow-1 mb-1 me-1 justify-content-end">
      <Button
        id="darkLightToggle"
        color={$colorMode}
        class="me-1"
        on:click={() => {
          $darkMode = !$darkMode;
          window.localStorage.setItem("darkModePreference", $colorMode);
        }}
      >
        <div class="icon">
          {#if $darkMode}
            <Icons.sunrise class="align-top" size="100%" />
          {:else}
            <Icons.sunset class="align-top" size="100%" />
          {/if}
        </div>
      </Button>
      <LocaleSelect class="me-1 h-100" />
      <Menu on:error />
    </div>
  </div>
  <hr class="my-0 d-lg-none" />
  <div
    data-name="board-title"
    class="text-secondary d-lg-none h3 pt-1 text-center text-body"
    on:keypress={null}
    on:click={startEdit}
  >
    {#if editMode}
      <Input
        data-name="board-title-edit-field"
        autofocus
        bind:value={newBoardName}
        on:submit={submitEdit}
        on:cancel={cancelEdit}
        on:blur={submitEdit}
        class="p-0 text-center border-0"
      />
    {:else}
      <EncryptedText bind:text={$board.name} />
    {/if}
  </div>
  <hr class="my-0" />
</div>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
    filter: brightness(0.6);
  }

  .on-top {
    z-index: 1040;
  }

  .home-link {
    cursor: pointer;
  }
</style>
