<script>
  import ClipboardJS from "clipboard";
  import { _ } from "svelte-i18n";
  import { fly } from "svelte/transition";
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from "sveltestrap";

  import { Icons } from "../data.js";
  import { board, colorMode, darkMode, ranks, sorted } from "../store.js";
  import { createRank, getCSVUrl } from "../api.js";

  import QRCode from "./QRCode.svelte";
  import ReadonlyCheckbox from "./ReadonlyCheckbox.svelte";
  import { createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";

  let isOpen = false;
  let showQR = false;

  new ClipboardJS("button");

  const dispatch = createEventDispatcher();

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function error(message, err) {
    dispatch("error", { message, err });
  }

  async function addRank() {
    try {
      await createRank(
        $board.id,
        "general.untitled",
        Math.max(...$ranks.map((r) => r.position)) + 1,
        {
          color: "plain",
          icon: "plus",
        }
      );
    } catch (err) {
      error("error.network", err);
    }
  }

  // async function doDeleteBoard() {
  //   try {
  //     await deleteBoard($board.id);
  //     navigate("/");
  //   } catch (err) {
  //     error("error.board_delete", err);
  //   }
  // }
</script>

<Dropdown bind:isOpen toggle={() => (isOpen = !isOpen)}>
  <DropdownToggle data-name="menu-button" color={$colorMode}>
    <div class="icon" class:text-body={$darkMode} class:text-white={$darkMode}>
      <Icons.menu class="align-top" size="100%" />
    </div>
  </DropdownToggle>
  <DropdownMenu right>
    {#if $board.owner}
      <DropdownItem
        data-name="add-column-button"
        on:click={addRank}
        disabled={$ranks.length >= 6}
      >
        <div class="d-inline-block icon position-relative" style="top: 4px">
          <Icons.plus class="align-top" size="1x" />
        </div>
        {$_("board.options.new_column")}
      </DropdownItem>
      <DropdownItem divider />
    {/if}
    <DropdownItem
      data-name="cards-open-button"
      toggle={false}
      disabled={!$board.owner}
      on:click={() => ($board.cards_open = !$board.cards_open)}
    >
      <ReadonlyCheckbox
        label={$_("board.options.new_cards_allowed")}
        bind:checked={$board.cards_open}
        on:click={preventDefault}
      />
    </DropdownItem>
    <DropdownItem
      data-name="voting-open-button"
      toggle={false}
      disabled={!$board.owner}
      on:click={() => ($board.voting_open = !$board.voting_open)}
    >
      <ReadonlyCheckbox
        label={$_("board.options.voting_allowed")}
        bind:checked={$board.voting_open}
      />
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem
      data-name="sort-button"
      toggle={false}
      on:click={() => ($sorted = !$sorted)}
    >
      <ReadonlyCheckbox
        label={$_("board.options.sort_by_votes")}
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
        label={$_("board.options.show_qr_code")}
        bind:checked={showQR}
      />
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem data-name="download-csv-button" href={getCSVUrl($board)}>
      <div class="d-inline-block icon position-relative" style="top: 2px">
        <Icons.download class="align-top" size="1x" />
      </div>
      {$_("board.options.download_csv")}
    </DropdownItem>
    <DropdownItem
      data-name="copy-link-button"
      data-clipboard-text="{location.origin}/{$board.id}"
    >
      <div class="d-inline-block icon position-relative" style="top: 3px">
        <Icons.link size="1x" class="align-top" />
      </div>
      {$_("board.options.copy_link")}
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
      {$_("general.feedback")}
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
      {$_("general.donate")}
    </DropdownItem>
    <!-- {#if $board.owner}
      <DropdownItem divider />
      <DropdownItem data-name="delete=baord-button" on:click={doDeleteBoard}>
        <div
          class="d-inline-block icon text-danger position-relative"
          style="top: -3px"
        >
          <Icons.delete size="1x" />
        </div>
        {$_("board.delete")}
      </DropdownItem>
    {/if} -->
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
</style>
