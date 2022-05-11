<script>
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { board, password } from '../store.js';
  import { decrypt, encrypt, checkBoardPassword } from '../encryption.js';

  import Textarea from './Textarea.svelte';
  import EncryptedText from './EncryptedText.svelte';

  let showIceBreaking = false;
  let iceBreakingEditMode = false;
  let newIceBreakingText = '';

  let classes = '';
  let className = '';
  export { className as class };

  async function checkIceBreak() {
    newIceBreakingText = $board.ice_breaking || '';
    showIceBreaking = newIceBreakingText !== '';
    return showIceBreaking;
  }

  async function startEdit() {
    if ($board.owner && (await checkBoardPassword($board, $password))) {
      iceBreakingEditMode = true;
      newIceBreakingText = await decrypt($board.ice_breaking, $password);
    }
  }

  function cancelEdit() {
    iceBreakingEditMode = false;
  }

  async function submitEdit() {
    $board.ice_breaking = await encrypt(newIceBreakingText, $password);
    iceBreakingEditMode = false;
  }

  onMount(async () => {
    checkIceBreak();
  });

  $: classes = clsx(className, 'p-3', 'mx-auto');
</script>

{#if showIceBreaking}
  <div class={classes}>
    <div class="card text-center" on:click={startEdit}>
      <div class="card-body">
        <h5 class="card-title">{$_('splash.icebreaking')}</h5>
        {#if iceBreakingEditMode}
          <Textarea
            autofocus
            bind:value={newIceBreakingText}
            on:submit={submitEdit}
            on:cancel={cancelEdit}
            on:blur={submitEdit}
            class="p-0 text-center"
          />
        {:else}
          <EncryptedText
            bind:text={$board.ice_breaking}
          />
        {/if}
      </div>
    </div>
  </div>
{/if}
