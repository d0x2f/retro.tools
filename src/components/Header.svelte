<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    CustomInput,
  } from 'sveltestrap';

  import { board, settings } from '../store.js';
  import { Icons } from '../data.js';
  import { getCSVUrl } from '../api.js';

  let optionsOpen = false;
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
    margin-top: -1px;
  }

  .smaller-icon {
    width: 1.25em;
    height: 1.25em;
  }
</style>

<div class="shadow-sm">
  <div class="d-flex justify-content-between pt-1">
    <div class="text-primary text-uppercase font-weight-bold h5 pt-1 px-3">
      retro.tools
    </div>
    <div class="text-secondary d-none d-md-block pt-1">{$board.name}</div>
    <div class="d-md-flex mb-1 mr-1">
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
            on:click={() => ($board.voting_open = !$board.voting_open)}>
            <CustomInput
              type="checkbox"
              label="Voting"
              bind:checked={$board.voting_open} />
          </DropdownItem>
          <DropdownItem
            toggle={false}
            disabled={!$board.owner}
            on:click={() => ($board.cards_open = !$board.cards_open)}>
            <CustomInput
              type="checkbox"
              label="Cards Allowed"
              bind:checked={$board.cards_open} />
          </DropdownItem>
          <DropdownItem
            toggle={false}
            on:click={() => ($settings.sorted = !$settings.sorted)}>
            <CustomInput
              type="checkbox"
              label="Sort by Votes"
              bind:checked={$settings.sorted} />
          </DropdownItem>
          <DropdownItem href={getCSVUrl($board)}>
            <div class="smaller-icon d-inline-block">
              <Icons.download />
            </div>
            Download CSV
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
  <div class="text-secondary d-md-none px-3 text-center">{$board.name}</div>
</div>
