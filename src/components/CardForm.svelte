<script>
  import Icon from 'fa-svelte';
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import { Input } from 'sveltestrap';

  import { ranks } from '../store.js';

  export let comment;
  export let rankId;

  let tabs = {
    mad: {
      selected: 'text-danger',
      deselected: 'text-secondary',
      icon: faFrown,
    },
    sad: {
      selected: 'text-primary',
      deselected: 'text-secondary',
      icon: faMeh,
    },
    glad: {
      selected: 'text-success',
      deselected: 'text-secondary',
      icon: faSmile,
    },
  };
</script>

<style>

</style>

<div class="mb-1">
  <Input
    type="textarea"
    placeholder="We need more snacks..."
    bind:value={comment} />
</div>

<div class="w-100 mt-3 d-flex">
  {#each $ranks as rank}
    <input
      type="radio"
      class="d-none m-1"
      id={rank.id}
      bind:group={rankId}
      value={rank.id} />
    <label
      for={rank.id}
      class="w-100 justify-content-around text-center {rankId == rank.id ? tabs[rank.name.toLowerCase()].selected : tabs[rank.name.toLowerCase()].deselected}">
      <div class="icon">
        <Icon icon={tabs[rank.name.toLowerCase()].icon} />
      </div>
      {rank.name}
    </label>
  {/each}
</div>
