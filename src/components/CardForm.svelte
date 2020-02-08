<script>
  import { Input } from 'sveltestrap';

  import { ranks } from '../store.js';
  import { getRankDetails } from '../data.js';

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
  {#each $ranks as rank (rank.id)}
    <input
      readonly={undefined}
      type="radio"
      class="d-none m-1"
      id={rank.id}
      bind:group={rankId}
      value={rank.id} />
    <label
      for={rank.id}
      class="myshadow w-100 justify-content-around text-center text-uppercase {rankId == rank.id ? getRankDetails(rank).classes.selected : 'text-secondary'}">
      <div class="icon d-inline-block">
        <svelte:component this={getRankDetails(rank).icon} />
      </div>
      <br />
      {rank.name}
    </label>
  {/each}
</div>
