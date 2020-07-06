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
  import { _ } from 'svelte-i18n';

  import QRCode from './QRCode.svelte';
  import LocaleSelect from './LocaleSelect.svelte';
  import Input from './Input.svelte';
  import EncryptedText from './EncryptedText.svelte';

  import { board, password, sorted } from '../store.js';
  import { Icons } from '../data.js';
  import { getCSVUrl } from '../api.js';
  import { decrypt, encrypt } from '../crypto.js';

  export let nav;

  let optionsOpen = false;
  let showQR = false;
  let editMode = false;
  let newBoardName = '';

  new ClipboardJS('button');

  async function startEdit() {
    if ($board.owner) {
      editMode = true;
      newBoardName = await decrypt($board.name, $password);
    }
  }

  function cancelEdit() {
    editMode = false;
  }

  async function submitEdit() {
    $board.name = await encrypt(newBoardName, $password);
    editMode = false;
  }
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
    class="shadow-lg d-none d-lg-block qrcode m-1"
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

    <div
      class="col text-center text-secondary d-none d-lg-block pt-1"
      on:click={startEdit}>
      {#if editMode}
        <Input
          autofocus
          bind:value={newBoardName}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit}
          class="text-center" />
      {:else}
        <EncryptedText bind:text={$board.name} />
      {/if}
    </div>
    <div class="col d-flex mb-1 mr-1 justify-content-end">
      <div class="mr-1">
        <LocaleSelect />
      </div>
      <div>
        <Dropdown
          size="sm"
          bind:isOpen={optionsOpen}
          toggle={() => (optionsOpen = !optionsOpen)}>
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
              <CustomInput
                type="checkbox"
                label={$_('board.options.new_cards_allowed')}
                bind:checked={$board.cards_open} />
            </DropdownItem>
            <DropdownItem
              toggle={false}
              disabled={!$board.owner}
              on:click={() => ($board.voting_open = !$board.voting_open)}>
              <CustomInput
                type="checkbox"
                label={$_('board.options.voting_allowed')}
                bind:checked={$board.voting_open} />
            </DropdownItem>
            <DropdownItem toggle={false} on:click={() => ($sorted = !$sorted)}>
              <CustomInput
                type="checkbox"
                label={$_('board.options.sort_by_votes')}
                bind:checked={$sorted} />
            </DropdownItem>
            <DropdownItem
              toggle={false}
              on:click={() => (showQR = !showQR)}
              class="d-none d-lg-block">
              <CustomInput
                type="checkbox"
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
      </div>
    </div>
  </div>
  <div class="text-secondary d-lg-none px-3 text-center">
    <EncryptedText bind:text={$board.name} />
  </div>
</div>
