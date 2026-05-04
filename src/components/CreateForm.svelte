<script>
  import { _ } from "svelte-i18n";
  import { slide } from "svelte/transition";
  import { UploadIcon } from "svelte-feather-icons";
  import { load as loadYaml } from "js-yaml";

  import { Icons, BoardTemplates } from "../data.js";
  import { colorMode, darkMode, password } from "../store.js";
  import { encrypt } from "../encryption.js";
  import { createRank, createBoard } from "../api.js";

  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import Checkbox from "./Checkbox.svelte";
  import Select from "./Select.svelte";
  import Spinner from "./Spinner.svelte";

  let { onerror, oncreated } = $props();

  let boardName = $state("");
  let templateKey = $state("dropAddKeepImprove");
  let customTemplate = $state(null);
  let fileInput = $state(null);
  let iceBreakingQuestion = $state("");
  let passwordDisabled = $state(true);
  let showPassword = $state(false);
  let createBusy = $state(false);
  let optionsExpanded = $state(false);

  const validColors = new Set([
    "red",
    "green",
    "blue",
    "yellow",
    "cyan",
    "plain",
  ]);
  const validIcons = new Set(Object.keys(Icons));

  function parseYamlTemplate(content) {
    const doc = loadYaml(content);
    const columns =
      doc != null && typeof doc === "object" && "columns" in doc
        ? doc.columns
        : null;
    if (!Array.isArray(columns)) throw new Error("missing columns");
    const ranks = columns.map((col, i) => ({
      name: String(col.key ?? col.name ?? ""),
      icon: validIcons.has(col.icon) ? col.icon : "plus",
      color: validColors.has(col.color) ? col.color : "plain",
      position: i,
    }));
    return { name: "board.template.custom.name", ranks };
  }

  function handleFileImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = parseYamlTemplate(e.target.result);
        if (template.ranks.length === 0) {
          onerror?.({ message: "error.invalid_template" });
          return;
        }
        customTemplate = template;
        templateKey = "custom";
      } catch (err) {
        onerror?.({ message: "error.invalid_template", err });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  async function createFromTemplate(template) {
    let [boardNameEncrypted, encryptionTest, iceBreakingQuestionEncrypted] =
      await Promise.all([
        encrypt(boardName, $password),
        encrypt("encryptionTest", $password),
        encrypt(iceBreakingQuestion, $password),
      ]);
    let board = await createBoard(
      boardNameEncrypted,
      { encryptionTest },
      iceBreakingQuestionEncrypted,
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
      const template =
        templateKey === "custom" && customTemplate
          ? customTemplate
          : BoardTemplates[templateKey];
      const board = await createFromTemplate(template);
      oncreated?.(board.id);
    } catch (err) {
      onerror?.({ message: "error.creating_board", err });
      createBusy = false;
    }
  }
</script>

<div data-name="create-form">
  <div class="d-flex">
    <Input
      data-name="board-name-input"
      placeholder={$_("splash.board_name_example")}
      class="h-100"
      bind:value={boardName}
      onsubmit={newBoard}
    />
    <div class="flex-grow-0 flex-shrink-0">
      <Button
        class="ms-2"
        color={$darkMode ? "secondary" : "primary"}
        textColor={$colorMode}
        onclick={newBoard}
        disabled={createBusy}
        data-name="create-button"
      >
        <div class="d-flex">
          {#if createBusy}
            <div class="d-block icon">
              <Spinner size="sm" color={$colorMode} />
            </div>
          {:else}{$_("splash.create")}{/if}
        </div>
      </Button>
    </div>
  </div>
  <Button
    color={$colorMode}
    textColor="body"
    data-name="more-settings-button"
    class="text-start mt-2 w-100"
    onclick={() => (optionsExpanded = !optionsExpanded)}
  >
    <div class:rotate-90={optionsExpanded} class="transition d-inline-block">
      ▸
    </div>
    {$_("splash.settings")}
  </Button>
  {#if optionsExpanded}
    <div in:slide out:slide>
      <p class="my-1 small">{$_("splash.template")}</p>
      <div class="d-flex gap-2">
        <Select bind:value={templateKey}>
          {#each Object.entries(BoardTemplates) as [key, template] (key)}
            <option value={key}>{$_(template.name)}</option>
          {/each}
          {#if customTemplate}
            <option value="custom">{$_("board.template.custom.name")}</option>
          {/if}
        </Select>
        <input
          type="file"
          accept=".yaml,.yml"
          class="d-none"
          bind:this={fileInput}
          onchange={handleFileImport}
        />
        <Button
          color={$colorMode}
          textColor="body"
          onclick={() => fileInput.click()}
          title={$_("splash.import_template")}
        >
          <UploadIcon size="1x" />
        </Button>
      </div>
      <p class="my-1 small">{$_("general.encryption")}</p>
      <div class="input-group">
        <div class="input-group-text">
          <Checkbox
            addon
            data-name="encrypt-board-checkbox"
            oninput={(i) => (passwordDisabled = !i.target.checked)}
          />
        </div>
        <Input
          data-name="board-password-input"
          type={showPassword ? "text" : "password"}
          placeholder={$_("general.password")}
          bind:disabled={passwordDisabled}
          bind:value={$password}
        />
        <Button
          color="secondary"
          textColor="white-50"
          onclick={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
            <Icons.eye />
          {:else}
            <Icons.eyeOff />
          {/if}
        </Button>
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

<style>
  .transition {
    transition: 0.15s transform ease-in-out !important;
  }
  .rotate-90 {
    transform: translate(0px, 2px) rotate(90deg);
  }
</style>
