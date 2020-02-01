<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    CustomInput,
    Card,
  } from 'sveltestrap';
  import { fly } from 'svelte/transition';
  import ClipboardJS from 'clipboard';

  import QRCode from './QRCode.svelte';

  import { board, settings } from '../store.js';
  import { Icons } from '../data.js';
  import { getCSVUrl } from '../api.js';

  export let nav;

  let optionsOpen = false;
  let showQR = false;

  new ClipboardJS('button');
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

  .on-top {
    z-index: 1040;
  }

  .qrcode {
    z-index: 1040;
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .home-link {
    cursor: pointer;
  }
</style>

{#if showQR}
  <div
    class="shadow-lg d-none d-md-block qrcode m-1"
    in:fly={{ x: -200, duration: 500 }}
    out:fly={{ x: -200, duration: 500 }}>
    <Card class="p-1" body>
      <QRCode
        text="{location.origin}/{$board.id}"
        colorDark="#007bff"
        width="200"
        height="200" />
    </Card>
  </div>
{/if}

<div class="shadow-sm on-top bg-white">
  <div class="row justify-content-between pt-1">
    <div
      class="col text-primary text-uppercase font-weight-bold h5 pt-1 ml-2
      home-link"
      on:click={nav.navigate('/')}>
      retro.tools
    </div>
    <div class="col text-center text-secondary d-none d-md-block pt-1">
      {$board.name}
    </div>
    <div class="col d-flex mb-1 mr-1 justify-content-end">
      <Dropdown
        size="sm"
        bind:isOpen={optionsOpen}
        toggle={() => (optionsOpen = !optionsOpen)}>
        <DropdownToggle color="primary">
          <div class="icon">
            <Icons.ellispses />
          </div>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            toggle={false}
            disabled={!$board.owner}
            on:click={() => ($board.cards_open = !$board.cards_open)}>
            <CustomInput
              type="checkbox"
              label="New Cards Allowed"
              bind:checked={$board.cards_open} />
          </DropdownItem>
          <DropdownItem
            toggle={false}
            disabled={!$board.owner}
            on:click={() => ($board.voting_open = !$board.voting_open)}>
            <CustomInput
              type="checkbox"
              label="Voting Allowed"
              bind:checked={$board.voting_open} />
          </DropdownItem>
          <DropdownItem
            toggle={false}
            on:click={() => ($settings.sorted = !$settings.sorted)}>
            <CustomInput
              type="checkbox"
              label="Sort by Votes"
              bind:checked={$settings.sorted} />
          </DropdownItem>
          <DropdownItem
            toggle={false}
            on:click={() => (showQR = !showQR)}
            class="d-none d-md-block">
            <CustomInput
              type="checkbox"
              label="Show QR Code"
              bind:checked={showQR} />
          </DropdownItem>
          <DropdownItem href={getCSVUrl($board)}>
            <div class="d-inline-block smaller-icon">
              <Icons.download />
            </div>
            Download CSV
          </DropdownItem>
          <DropdownItem data-clipboard-text="{location.origin}/{$board.id}">
            <div class="d-inline-block smaller-icon">
              <Icons.link />
            </div>
            Copy Link
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
  <div class="text-secondary d-md-none px-3 text-center">{$board.name}</div>
</div>
