<script>
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import TextArea from './TextArea.svelte';
  import Radio from './Radio.svelte';

  import { ranks } from '../store.js';

  export let comment;
  export let type;

  let tabs = {
    mad: {
      color: 'negative',
      icon: faFrown,
    },
    sad: {
      color: 'primary',
      icon: faMeh,
    },
    glad: {
      color: 'secondary',
      icon: faSmile,
    },
  };
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .comment {
    margin-bottom: 1em;
    height: 5em;
  }

  h1 {
    margin-bottom: 1em;
    font-family: 'Work Sans', sans-serif;
    text-transform: uppercase;
    color: $primary;
  }

  .ranks {
    width: 100%;
    border-radius: 0.5em;
    display: flex;
  }
</style>

<h1>New Card</h1>

<div class="comment">
  <TextArea bind:text={comment} placeholder="This meeting is boring..." />
</div>

<div class="ranks">
  {#each $ranks as rank}
    <Radio
      bind:group={type}
      value={rank.id}
      label={rank.name}
      icon={tabs[rank.name.toLowerCase()].icon || faMeh}
      color={tabs[rank.name.toLowerCase()].color || 'primary'}
      style="flex: 1 0 0;" />
  {/each}
</div>
