<script>
  import Icon from 'fa-svelte';

  import { cards } from '../store.js';
  import Card from './Card.svelte';

  export let rank;
  export let color;
  export let icon;
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .rank {
    position: relative;
    flex: 0 0 16em;
  }

  h1 {
    display: inline-block;
    text-align: center;
    margin: 0;
    font-size: 1em;
  }

  .header {
    text-align: center;
    font-size: 80%;
    padding-bottom: 0.5em;
  }

  .no-cards {
    color: darken($background, 20%);
    text-align: center;
    padding-top: 2em;
    overflow: auto;
  }

  .icon {
    font-size: 120%;
  }

  .negative {
    color: $negative;
    .rankbar {
      background-color: $negative;
    }
  }

  .primary {
    color: $primary;
    .rankbar {
      background-color: $primary;
    }
  }

  .secondary {
    color: $secondary;
    .rankbar {
      background-color: $secondary;
    }
  }
  .rankbar {
    height: 0.2em;
    background: black;
    margin-top: 1em;
    border-radius: 0.2em;
  }

  @media screen and (max-width: 1024px) {
    .header {
      display: none;
    }
  }
</style>

<div class="rank">
  <div class="header {color}">
    <div class="icon">
      <Icon {icon} />
    </div>
    <h1>{rank.name}</h1>
    <div class="rankbar" />
  </div>
  <div class="cards">
    {#if $cards}
      {#each $cards as card}
        {#if card.rank_id == rank.id}
          <Card bind:card {color} />
        {/if}
      {/each}
    {/if}
    {#if !$cards || $cards.length === 0}
      <div class="no-cards">Nothing...</div>
    {/if}
  </div>
</div>
