<script>
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { board, password } from '../store.js';
  import { decrypt, encrypt, checkBoardPassword } from '../encryption.js';

  import Input from './Input.svelte';
  import EncryptedText from './EncryptedText.svelte';

  let showIceBreaking = $state(false);
  let iceBreakingEditMode = $state(false);
  let newIceBreakingText = $state('');

  let { class: className = '' } = $props();

  let classes = $derived(
    clsx(className, 'p-3', 'mx-auto', 'd-flex', 'justify-content-center')
  );

  async function startEdit() {
    if ($board.owner && (await checkBoardPassword($board, $password))) {
      let decrypted;
      try {
        decrypted = await decrypt($board.ice_breaking, $password);
      } catch {
        return;
      }
      iceBreakingEditMode = true;
      newIceBreakingText = decrypted;
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
    newIceBreakingText = $board.ice_breaking || '';
    try {
      const decrypted = await decrypt(newIceBreakingText, $password);
      showIceBreaking = decrypted !== '';
    } catch {
      showIceBreaking = newIceBreakingText !== '';
    }
  });
</script>

{#if showIceBreaking}
  <div
    class={classes}
    role="button"
    tabindex="0"
    onclick={startEdit}
    onkeypress={null}
  >
    {#if iceBreakingEditMode}
      <Input
        autofocus
        bind:value={newIceBreakingText}
        onsubmit={submitEdit}
        oncancel={cancelEdit}
        onblur={submitEdit}
        class="p-0 text-center border-0"
      />
    {:else}
      <span class="fw-bold text-nowrap me-1">{$_('splash.icebreaking')}:</span>
      <span data-name="ice-breaker-message">
        <EncryptedText bind:text={$board.ice_breaking} />
      </span>
    {/if}
  </div>
{/if}
