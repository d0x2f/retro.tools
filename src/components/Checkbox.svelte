<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let checked = false;
  export let label = '';
  export let addon = false;
  export let id = 'id-' + Math.floor(Math.random() * 10000);

  $: wrapperClasses = clsx(className, 'custom-checkbox', 'custom-control');

  $: directClasses = clsx(className, { 'form-check-input': !addon });
</script>

{#if label}
  <div class={wrapperClasses}>
    <input
      {id}
      type="checkbox"
      class="custom-control-input"
      {disabled}
      {label}
      bind:checked
      on:input />
    <label class="custom-control-label" for={id}>{label}</label>
  </div>
{:else}
  <input
    {id}
    type="checkbox"
    class={directClasses}
    {disabled}
    bind:checked
    on:input />
{/if}
