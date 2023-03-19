<script>
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import { dictionary, _ } from "svelte-i18n";
  import { ButtonGroup, Button as SSButton } from "sveltestrap";

  import { updateRank } from "../api";
  import { ColumnIcons, Icons } from "../data";
  import { activeRankOptions, board, colorMode, colors } from "../store";
  import Input from "./Input.svelte";

  let className = "";
  export { className as class };

  export let rank;

  $: classes = clsx(className, "d-flex flex-column");

  let rankName = new Set(Object.keys($dictionary.en)).has(rank.name)
    ? $_(rank.name)
    : rank.name;

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch("error", { message, err });
  }

  async function doUpdate() {
    try {
      await updateRank($board.id, { ...rank, name: rankName });
    } catch (err) {
      error("error.network", err);
    }
  }
</script>

<div class={classes}>
  <Input
    type="text"
    bind:value={rankName}
    class="m-1"
    on:blur={doUpdate}
    on:submit={() => {
      $activeRankOptions = "";
      doUpdate();
    }}
  />
  <ButtonGroup class="w-100 m-1">
    {#each Object.entries($colors) as [name, color]}
      <SSButton
        style="background-color: {color};"
        on:click={() => {
          rank.data.color = name;
          doUpdate();
        }}
      >
        {#if rank.data.color == name}
          <div style="color: {color};" class="invert"><Icons.check /></div>
        {/if}
      </SSButton>
    {/each}
  </ButtonGroup>
  {#each ColumnIcons as row}
    <div class="w-100 mx-1 d-flex justify-content-around w-100 my-1">
      {#each row as name}
        <div
          on:keypress={null}
          on:click={() => {
            rank.data.icon = name;
            doUpdate();
          }}
          style="color: {$colors[rank.data.color]}"
          class:text-body={rank.data.icon !== name}
          class="p-1"
        >
          <svelte:component this={Icons[name]} />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .invert {
    filter: brightness(0.5);
  }
</style>
