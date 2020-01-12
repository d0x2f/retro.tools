<script>
  import Icon from 'fa-svelte';
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import TextArea from './TextArea.svelte';

  import { ranks } from '../store.js';

  export let comment;
  export let rankId;

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

  .ranks {
    width: 100%;
    border-radius: 0.5em;
    display: flex;
  }

  input[type='radio'] {
    display: none;
    margin: 10px;
  }

  input[type='radio'] + label {
    display: inline-block;
    flex: 1 1;
    margin: -2px;
    padding: 4px 12px;
    text-align: center;
  }

  input[type='radio']:checked + label {
    border-bottom: 2px solid #4f81e5;
  }

  .negative {
    color: $negative;
  }

  .primary {
    color: $primary;
  }

  .secondary {
    color: $secondary;
  }
</style>

<div class="comment">
  <TextArea bind:text={comment} placeholder="This meeting is boring..." />
</div>

<div class="ranks">
  {#each $ranks as rank}
    <input type="radio" id={rank.id} bind:group={rankId} value={rank.id} />
    <label for={rank.id} class={tabs[rank.name.toLowerCase()].color}>
      <div class="icon">
        <Icon icon={tabs[rank.name.toLowerCase()].icon} />
      </div>
      {rank.name}
    </label>
  {/each}
</div>
