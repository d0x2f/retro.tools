<script>
  import { Input } from 'sveltestrap';
  import * as Icons from 'svelte-feather-icons';

  import { ranks } from '../store.js';

  export let comment;
  export let rankId;
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
  }
</style>

<div class="mb-1">
  <Input
    readonly={undefined}
    type="textarea"
    placeholder="We need more snacks..."
    bind:value={comment} />
</div>

<div class="w-100 mt-3 d-flex">
  {#each $ranks as rank}
    <input
      readonly={undefined}
      type="radio"
      class="d-none m-1"
      id={rank.id}
      bind:group={rankId}
      value={rank.id} />
    <label
      for={rank.id}
      class="w-100 justify-content-around text-center {rankId == rank.id ? rank.data.selected : 'text-secondary'}">
      <div class="icon d-inline-block">
        <svelte:component this={Icons[rank.data.icon]} />
      </div>
      <br />
      {rank.name}
    </label>
  {/each}
</div>
