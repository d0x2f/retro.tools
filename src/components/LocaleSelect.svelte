<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from 'sveltestrap';
  import { _, locale, locales } from 'svelte-i18n';
  import moment from 'moment';

  import Flag from './Flag.svelte';

  let localesOpen = false;

  function setLocale(l) {
    locale.set(l);
    moment.locale(l);
    window.localStorage.setItem('locale', l);
  }
</script>

<Dropdown
  size="sm"
  bind:isOpen={localesOpen}
  toggle={() => (localesOpen = !localesOpen)}>
  <DropdownToggle caret data-name="locale-select-button" color="light">
    {$locale}
  </DropdownToggle>
  <DropdownMenu right class="mw-0">
    {#each $locales.sort() as locale}
      <DropdownItem
        data-name="locale-select-{locale}"
        toggle={true}
        on:click={() => setLocale(locale)}>
        {locale}
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
