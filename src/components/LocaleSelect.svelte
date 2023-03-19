<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from "sveltestrap";
  import { _, locale, locales, dictionary } from "svelte-i18n";
  import moment from "moment";
  import { colorMode } from "../store";
  import clsx from "clsx";

  export let size = "";

  let className = "";
  export { className as class };

  let localesOpen = false;

  $: classes = clsx(className);

  function setLocale(l) {
    locale.set(l);
    moment.locale(l);
    window.localStorage.setItem("locale", l);
  }
</script>

<Dropdown
  bind:isOpen={localesOpen}
  toggle={() => (localesOpen = !localesOpen)}
  class={classes}
>
  <DropdownToggle
    caret
    data-name="locale-select-button"
    color={$colorMode}
    class="text-body h-100"
    {size}
  >
    {#if $locale in $dictionary}
      {$_("language." + $locale)}
    {:else}{$_("language.en")}{/if}
  </DropdownToggle>
  <DropdownMenu right class="mw-0">
    {#each $locales.sort() as locale}
      <DropdownItem
        data-name="locale-select-{locale}"
        toggle={true}
        on:click={() => setLocale(locale)}
      >
        {$_("language." + locale)}
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
