<script>
  import { run } from "svelte/legacy";

  import clsx from "clsx";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { board, password } from "../store.js";
  import { decrypt, encrypt, checkBoardPassword } from "../encryption.js";

  import Input from "./Input.svelte";
  import EncryptedText from "./EncryptedText.svelte";

  let showIceBreaking = $state(false);
  let iceBreakingEditMode = $state(false);
  let newIceBreakingText = $state("");

  let classes = $state("");

  let { class: className = "" } = $props();

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
    newIceBreakingText = $board.ice_breaking || "";
    showIceBreaking = (await decrypt(newIceBreakingText, $password)) !== "";
  });

  run(() => {
    classes = clsx(
      className,
      "p-3",
      "mx-auto",
      "d-flex",
      "justify-content-center",
    );
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
        on:submit={submitEdit}
        on:cancel={cancelEdit}
        on:blur={submitEdit}
        class="p-0 text-center border-0"
      />
    {:else}
      <span class="fw-bold text-nowrap me-1">{$_("splash.icebreaking")}:</span>
      <span data-name="ice-breaker-message">
        <EncryptedText bind:text={$board.ice_breaking} />
      </span>
    {/if}
  </div>
{/if}
