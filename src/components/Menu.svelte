<script>
  import ClipboardJS from 'clipboard';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { fly } from 'svelte/transition';
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from '@sveltestrap/sveltestrap';

  import { Icons } from '../data.js';
  import {
    board,
    cards,
    colorMode,
    darkMode,
    password,
    ranks,
    sorted,
  } from '../store.js';
  import { createRank } from '../api.js';
  import { decrypt } from '../encryption.js';
  import { dump as dumpYaml } from 'js-yaml';

  import QRCode from './QRCode.svelte';
  import Timer from './Timer.svelte';
  import ReadonlyCheckbox from './ReadonlyCheckbox.svelte';
  import { navigate } from 'svelte-routing';

  let { onerror } = $props();

  let isOpen = $state(false);
  let showQR = $state(false);
  let showTimer = $state(false);

  // Auto-show timer widget for all participants when a timer is active or expired
  $effect(() => {
    if ($board.data?.timer_end_at != null) showTimer = true;
  });

  let clipboard;
  onMount(() => {
    clipboard = new ClipboardJS('[data-clipboard-text]');
    return () => clipboard.destroy();
  });

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function error(message, err) {
    onerror?.({ message, err });
  }

  function csvEscape(value) {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  async function downloadTemplate() {
    const sortedRanks = [...$ranks].sort((a, b) => a.position - b.position);
    const columns = sortedRanks.map((rank) => {
      const name = $_(rank.name);
      const col = { name, icon: rank.data.icon, color: rank.data.color };
      if (name !== rank.name) col.key = rank.name;
      return col;
    });
    const yaml = dumpYaml({ columns });
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const boardName = await decrypt($board.name, $password);
    a.download = `retro-tools-${boardName}-template.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadCSV() {
    const rankMap = Object.fromEntries($ranks.map((r) => [r.id, r]));
    const rows = await Promise.all(
      $cards.map(async (card) => {
        const rank = rankMap[card.column];
        const column = rank ? $_(rank.name) : '';
        const author = await decrypt(card.author, $password);
        const text = await decrypt(card.text, $password);
        const createdAt = card.created_at.toISOString();
        return [column, author, text, createdAt, card.votes]
          .map(csvEscape)
          .join(',');
      })
    );
    const csv = ['column,author,text,created_at,votes', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `${await decrypt($board.name, $password)}-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function addRank() {
    try {
      await createRank(
        $board.id,
        'general.untitled',
        Math.max(...$ranks.map((r) => r.position)) + 1,
        {
          color: 'plain',
          icon: 'plus',
        }
      );
    } catch (err) {
      error('error.network', err);
    }
  }
</script>

<Dropdown bind:isOpen toggle={() => (isOpen = !isOpen)}>
  <DropdownToggle data-name="menu-button" color={$colorMode}>
    <div class="icon" class:text-body={$darkMode} class:text-white={$darkMode}>
      <Icons.menu class="align-top" size="100%" />
    </div>
  </DropdownToggle>
  <DropdownMenu right>
    {#if $board.owner || $board.open_permission}
      <DropdownItem
        data-name="add-column-button"
        on:click={addRank}
        disabled={$ranks.length >= 6}
      >
        <div class="d-inline-block icon position-relative" style="top: 4px">
          <Icons.plus class="align-top" size="1x" />
        </div>
        {$_('board.options.new_column')}
      </DropdownItem>
      <DropdownItem divider />
    {/if}
    <DropdownItem
      data-name="cards-open-button"
      toggle={false}
      disabled={!$board.owner && !$board.open_permission}
      on:click={() => ($board.cards_open = !$board.cards_open)}
    >
      <ReadonlyCheckbox
        label={$_('board.options.new_cards_allowed')}
        bind:checked={$board.cards_open}
      />
    </DropdownItem>
    <DropdownItem
      data-name="voting-open-button"
      toggle={false}
      disabled={!$board.owner && !$board.open_permission}
      on:click={() => ($board.voting_open = !$board.voting_open)}
    >
      <ReadonlyCheckbox
        label={$_('board.options.voting_allowed')}
        bind:checked={$board.voting_open}
      />
    </DropdownItem>
    <DropdownItem
      data-name="obscure-cards-button"
      toggle={false}
      disabled={!$board.owner && !$board.open_permission}
      on:click={() =>
        ($board = {
          ...$board,
          data: { ...$board.data, obscure_cards: !$board.data.obscure_cards },
        })}
    >
      <ReadonlyCheckbox
        label={$_('board.options.obscure_cards')}
        checked={!!$board.data?.obscure_cards}
      />
    </DropdownItem>
    {#if $board.owner}
      <DropdownItem
        data-name="anyone-is-owner-button"
        toggle={false}
        on:click={() => ($board.open_permission = !$board.open_permission)}
      >
        <ReadonlyCheckbox
          label={$_('board.options.open_permission')}
          bind:checked={$board.open_permission}
        />
      </DropdownItem>
    {/if}
    <DropdownItem divider />
    <DropdownItem
      data-name="sort-button"
      toggle={false}
      on:click={() => ($sorted = !$sorted)}
    >
      <ReadonlyCheckbox
        label={$_('board.options.sort_by_votes')}
        bind:checked={$sorted}
      />
    </DropdownItem>
    <DropdownItem
      data-name="show-qr-button"
      toggle={false}
      class="d-none d-lg-block"
      on:click={() => (showQR = !showQR)}
    >
      <ReadonlyCheckbox
        label={$_('board.options.show_qr_code')}
        bind:checked={showQR}
      />
    </DropdownItem>
    <DropdownItem
      data-name="show-timer-button"
      toggle={false}
      on:click={() => (showTimer = !showTimer)}
    >
      <ReadonlyCheckbox
        label={$_('board.options.show_timer')}
        bind:checked={showTimer}
      />
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem data-name="download-csv-button" on:click={downloadCSV}>
      <div class="d-inline-block icon position-relative" style="top: 2px">
        <Icons.download class="align-top" size="1x" />
      </div>
      {$_('board.options.download_csv')}
    </DropdownItem>
    <DropdownItem
      data-name="download-template-button"
      on:click={downloadTemplate}
    >
      <div class="d-inline-block icon position-relative" style="top: 2px">
        <Icons.columns class="align-top" size="1x" />
      </div>
      {$_('board.options.download_template')}
    </DropdownItem>
    <DropdownItem
      data-name="copy-link-button"
      data-clipboard-text="{location.origin}/{$board.id}"
    >
      <div class="d-inline-block icon position-relative" style="top: 3px">
        <Icons.link size="1x" class="align-top" />
      </div>
      {$_('board.options.copy_link')}
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem
      data-name="feedback-button"
      target="_blank"
      href="https://docs.google.com/forms/d/e/1FAIpQLSdaMyFE4tSe2834TNlpnPcn8W9ijViZ_Bsl_bvBqFOwtxG4jA/viewform?usp=sf_link"
    >
      <div class="d-inline-block icon position-relative" style="top: -2px">
        <Icons.externalLink size="1x" />
      </div>
      {$_('general.feedback')}
    </DropdownItem>
    <DropdownItem
      data-name="donate-button"
      target="_blank"
      href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=FJMVB9QFZQ79J&amp;source=url"
    >
      <div
        class="d-inline-block icon text-danger position-relative"
        style="top: -2px"
      >
        <Icons.heart size="1x" />
      </div>
      {$_('general.donate')}
    </DropdownItem>
  </DropdownMenu>
</Dropdown>

{#if showQR}
  <div
    class="shadow-lg d-none d-lg-block qrcode m-1"
    in:fly={{ x: -200, duration: 500 }}
    out:fly={{ x: -200, duration: 500 }}
  >
    <QRCode
      class="p-1"
      text="{location.origin}/{$board.id}"
      colorDark="#007bff"
      width="200"
      height="200"
    />
  </div>
{/if}

{#if showTimer}
  <div
    class="timer-overlay m-1"
    in:fly={{ y: 100, duration: 400 }}
    out:fly={{ y: 100, duration: 400 }}
  >
    <Timer canControl={$board.owner || $board.open_permission} />
  </div>
{/if}

<style>
  .icon {
    width: 1.5em;
    height: 1.6em;
  }

  .qrcode {
    z-index: 1040;
    position: fixed;
    left: 0;
    bottom: 0;
  }

  .timer-overlay {
    z-index: 1040;
    position: fixed;
    right: 0;
    bottom: 0;
  }

  @media (max-width: 992px) {
    .timer-overlay {
      bottom: 4rem;
    }
  }
</style>
