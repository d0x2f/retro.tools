<script>
  import { _ } from 'svelte-i18n';
  import { fly } from 'svelte/transition';
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from 'sveltestrap';

  import { Icons } from '../data.js';
  import { board, sorted } from '../store.js';
  import { getCSVUrl } from '../api.js';

  import QRCode from './QRCode.svelte';
  import ReadonlyCheckbox from './ReadonlyCheckbox.svelte';

  let isOpen = false;
  let showQR = false;

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.6em;
    margin-top: -1px;
  }

  .smaller-icon {
    width: 1.25em;
    height: 1.25em;
    margin-top: -4px;
  }

  .qrcode {
    z-index: 1040;
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>

<Dropdown size="sm" bind:isOpen toggle={() => (isOpen = !isOpen)}>
  <DropdownToggle color="primary">
    <div class="icon">
      <Icons.menu />
    </div>
  </DropdownToggle>
  <DropdownMenu right>
    <DropdownItem
      toggle={false}
      disabled={!$board.owner}
      on:click={() => ($board.cards_open = !$board.cards_open)}>
      <ReadonlyCheckbox
        label={$_('board.options.new_cards_allowed')}
        bind:checked={$board.cards_open}
        on:click={preventDefault} />
    </DropdownItem>
    <DropdownItem
      toggle={false}
      disabled={!$board.owner}
      on:click={() => ($board.voting_open = !$board.voting_open)}>
      <ReadonlyCheckbox
        label={$_('board.options.voting_allowed')}
        bind:checked={$board.voting_open} />
    </DropdownItem>
    <DropdownItem toggle={false} on:click={() => ($sorted = !$sorted)}>
      <ReadonlyCheckbox
        label={$_('board.options.sort_by_votes')}
        bind:checked={$sorted} />
    </DropdownItem>
    <DropdownItem
      toggle={false}
      class="d-none d-lg-block"
      on:click={() => (showQR = !showQR)}>
      <ReadonlyCheckbox
        label={$_('board.options.show_qr_code')}
        bind:checked={showQR} />
    </DropdownItem>
    <DropdownItem href={getCSVUrl($board)}>
      <div class="d-inline-block smaller-icon">
        <Icons.download />
      </div>
      {$_('board.options.download_csv')}
    </DropdownItem>
    <DropdownItem data-clipboard-text="{location.origin}/{$board.id}">
      <div class="d-inline-block smaller-icon">
        <Icons.link />
      </div>
      {$_('board.options.copy_link')}
    </DropdownItem>
  </DropdownMenu>
</Dropdown>

{#if showQR}
  <div
    class="shadow-lg d-none d-lg-block qrcode m-1"
    in:fly={{ x: -200, duration: 500 }}
    out:fly={{ x: -200, duration: 500 }}>
    <QRCode
      class="p-1"
      text="{location.origin}/{$board.id}"
      colorDark="#007bff"
      width="200"
      height="200" />
  </div>
{/if}
