<script>
  import { _ } from "svelte-i18n";

  import { password, passwordValid } from "../store.js";
  import { decrypt } from "../encryption.js";

  let { text } = $props();
</script>

{#if text}
  {#await decrypt(text, $password)}
    …
  {:then string}
    {#if $passwordValid === null}…{:else if $passwordValid}{string}{:else}{$_(
        "general.encrypted",
      )}{/if}
  {/await}
{/if}
