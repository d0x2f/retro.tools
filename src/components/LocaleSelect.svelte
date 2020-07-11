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
  <DropdownToggle color="light">
    <Flag code={$locale} />
  </DropdownToggle>
  <DropdownMenu right>
    {#each $locales.sort() as locale}
      <DropdownItem toggle={true} on:click={() => setLocale(locale)}>
        <Flag code={locale} />
        {$_('language.' + locale)}
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
