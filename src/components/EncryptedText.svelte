<script>
  import { _ } from 'svelte-i18n';

  import { password, board } from '../store.js';
  import { decrypt, checkBoardPassword } from '../encryption.js';

  export let text;
</script>

{#if text}
  {#await decrypt(text, $password)}
    …
  {:then string}
    {#await checkBoardPassword($board, $password)}
      …
    {:then decrypted}
      {#if !decrypted}{$_('general.encrypted')}{:else}{string}{/if}
    {/await}
  {/await}
{/if}

<style>
</style>
