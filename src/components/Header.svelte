<script>
  import LocaleSelect from './LocaleSelect.svelte';
  import Textarea from './Textarea.svelte';
  import EncryptedText from './EncryptedText.svelte';
  import Menu from './Menu.svelte';

  import { board, password } from '../store.js';
  import { decrypt, encrypt, checkBoardPassword } from '../crypto.js';

  export let nav;

  let editMode = false;
  let newBoardName = '';

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

<style>
  .on-top {
    z-index: 1040;
  }

  .home-link {
    cursor: pointer;
  }
</style>

<div class="shadow-sm on-top bg-white">
  <div class="row justify-content-between pt-1">
    <div
      class="col text-primary text-uppercase font-weight-bold h5 pt-1 ml-2
      home-link"
      on:click={nav.navigate('/')}>
      retro.tools
    </div>

    <div
      class="col text-center text-secondary d-none d-lg-block pt-1"
      on:click={startEdit}>
      {#if editMode}
        <Textarea
          autofocus
          bind:value={newBoardName}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit}
          class="p-0 text-center" />
      {:else}
        <EncryptedText bind:text={$board.name} />
      {/if}
    </div>
    <div class="col d-flex mb-1 mr-1 justify-content-end">
      <div class="mr-1">
        <LocaleSelect />
      </div>
      <Menu />
    </div>
  </div>
  <div class="text-secondary d-lg-none px-3 text-center">
    <EncryptedText bind:text={$board.name} />
  </div>
</div>
