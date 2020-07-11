<script>
  import { _ } from 'svelte-i18n';

  import { password, board } from '../store.js';
  import { decrypt, checkBoardPassword } from '../crypto.js';

  export let text;
</script>

<style>

</style>

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
