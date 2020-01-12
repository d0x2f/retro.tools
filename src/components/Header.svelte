<script>
  import { SettingsIcon } from 'svelte-feather-icons';

  import { board, settings } from '../store.js';
  import Switch from './Switch.svelte';

  let showMobileSettings = false;
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .box {
    position: relative;
    background-color: $background;
    color: $primary;
    box-shadow: 0 0 0.4em darken($background, 20%);
    line-height: 1.5;
  }

  .header {
    padding: 0.4em 0;
    text-align: left;
    font-weight: 700;
    font-size: 1em;
    height: 2.3em;
    padding-left: 1em;
    text-transform: uppercase;
  }

  .settings {
    position: absolute;
    right: 1.5em;
    top: 0.75em;
    font-size: 0.7em;
  }

  .mobile {
    display: none;
  }

  .mobile-settings {
    display: none;
  }

  .horizontal {
    display: inline-block;
    margin-left: 1.8em;
  }

  @media screen and (max-width: 1024px) {
    .header {
      text-align: center;
    }

    .settings {
      display: none;
    }

    .mobile {
      display: block;
      position: absolute;
      width: 1.4em;
      right: 0.4em;
      top: 0.4em;
      z-index: 100;
      cursor: pointer;
    }

    .mobile-settings {
      display: block;
      font-size: 90%;
    }

    .horizontal {
      margin-left: 1em;
      width: 100%;
    }
  }
</style>

<div class="box fixed-top">
  <div class="header">retrograde</div>
  <div
    class="mobile"
    on:click={() => (showMobileSettings = !showMobileSettings)}>
    <SettingsIcon />
  </div>
  {#if showMobileSettings}
    <div class="mobile-settings">
      {#if $board.owner}
        <div class="horizontal">
          <Switch text="Voting" bind:checked={$board.voting_open} />
        </div>
        <div class="horizontal">
          <Switch text="Cards Allowed" bind:checked={$board.cards_open} />
        </div>
      {/if}
      <div class="horizontal">
        <Switch text="Sort by Votes" bind:checked={$settings.sorted} />
      </div>
    </div>
  {/if}
  <div class="settings">
    {#if $board.owner}
      <div class="horizontal">
        <Switch text="Voting" bind:checked={$board.voting_open} />
      </div>
      <div class="horizontal">
        <Switch text="Cards Allowed" bind:checked={$board.cards_open} />
      </div>
    {/if}
    <div class="horizontal">
      <Switch text="Sort by Votes" bind:checked={$settings.sorted} />
    </div>
  </div>
</div>
