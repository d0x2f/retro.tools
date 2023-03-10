<script>
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { slide } from "svelte/transition";

  import { Icons, BoardTemplates } from "../data.js";
  import { password } from "../store.js";
  import { encrypt } from "../encryption.js";
  import { createRank, createBoard } from "../api.js";

  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import Checkbox from "./Checkbox.svelte";
  import Select from "./Select.svelte";
  import Spinner from "./Spinner.svelte";

  const dispatch = createEventDispatcher();
  let boardName = "";
  let templateKey = "dropAddKeepImprove";
  let iceBreakingQuestion = "";
  let passwordDisabled = true;
  let showPassword = false;
  let createBusy = false;
  let optionsExpanded = false;

  async function createFromTemplate(template) {
    let [boardNameEncrypted, encryptionTest] = await Promise.all([
      encrypt(boardName, $password),
      encrypt("encryptionTest", $password),
    ]);
    let board = await createBoard(
      boardNameEncrypted,
      { encryptionTest },
      iceBreakingQuestion
    );
    for (const rank of template.ranks) {
      await createRank(board.id, rank.name, rank.position, {
        icon: rank.icon,
        color: rank.color,
      });
    }
    return board;
  }

  async function newBoard() {
    createBusy = true;
    if (passwordDisabled) {
      password.set("");
    }
    try {
      const board = await createFromTemplate(BoardTemplates[templateKey]);
      dispatch("created", board.id);
    } catch (err) {
      dispatch("error", { message: "error.creating_board", err });
      createBusy = false;
    }
  }
</script>

<div data-name="create-form" class="text-dark">
  <div class="d-flex">
    <Input
      data-name="board-name-input"
      placeholder={$_("splash.board_name_example")}
      bind:value={boardName}
    />
    <div class="flex-grow-0 flex-shrink-0">
      <Button
        class="ml-2"
        color="primary"
        on:click={newBoard}
        disabled={createBusy}
        data-name="create-button"
      >
        <div class="d-flex">
          {#if createBusy}
            <div class="d-block icon">
              <Spinner size="sm" color="light" />
            </div>
          {:else}{$_("splash.create")}{/if}
        </div>
      </Button>
    </div>
  </div>
  <Button
    color="light"
    data-name="more-settings-button"
    class="text-left mt-2 w-100"
    on:click={() => (optionsExpanded = !optionsExpanded)}
  >
    {#if optionsExpanded}▾{:else}▸{/if}
    {$_("splash.settings")}
  </Button>
  {#if optionsExpanded}
    <div in:slide out:slide>
      <p class="my-1 small">{$_("splash.template")}</p>
      <Select bind:value={templateKey}>
        {#each Object.entries(BoardTemplates) as [key, template]}
          <option value={key}>{$_(template.name)}</option>
        {/each}
      </Select>
      <p class="my-1 small">{$_("general.encryption")}</p>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <Checkbox
              addon
              on:input={(i) => (passwordDisabled = !i.target.checked)}
            />
          </div>
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={$_("general.password")}
          bind:disabled={passwordDisabled}
          bind:value={$password}
        />
        <div class="input-group-append">
          <Button on:click={() => (showPassword = !showPassword)}>
            {#if showPassword}
              <Icons.eye />
            {:else}
              <Icons.eyeOff />
            {/if}
          </Button>
        </div>
      </div>
      <p class="my-1 small">{$_("splash.icebreaking")}</p>
      <Input
        data-name="ice-breaker-question-input"
        placeholder={$_("splash.icebreaking_example")}
        bind:value={iceBreakingQuestion}
      />
    </div>
  {/if}
</div>
