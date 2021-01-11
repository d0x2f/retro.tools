<script>
  import { navigate } from 'svelte-routing';

  import LocaleSelect from './LocaleSelect.svelte';
  import Textarea from './Textarea.svelte';
  import EncryptedText from './EncryptedText.svelte';
  import Menu from './Menu.svelte';

  import { board, password } from '../store.js';
  import { decrypt, encrypt, checkBoardPassword } from '../crypto.js';

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
  <div class="d-flex justify-content-between pt-1">
    <h3
      data-name="home-link"
      class="text-primary text-uppercase font-weight-bold px-2 m-0 home-link"
      on:click={() => navigate('/')}>
      retro.tools
    </h3>

    <div
      data-name="board-title"
      class="text-center text-secondary d-none d-lg-block pt-1"
      on:click={startEdit}>
      {#if editMode}
        <Textarea
          data-name="board-title-edit-field"
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
    <div class="d-flex mb-1 mr-1 justify-content-end">
      <div class="mr-1">
        <LocaleSelect size="sm" />
      </div>
      <Menu />
    </div>
  </div>
  <div
    data-name="board-title"
    class="text-secondary d-lg-none px-3 text-center">
    <EncryptedText bind:text={$board.name} />
  </div>
</div>
