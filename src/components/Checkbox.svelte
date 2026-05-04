<script>
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let {
    class: className = "",
    disabled = false,
    checked = $bindable(false),
    label = "",
    addon = false,
    id = "id-" + Math.floor(Math.random() * 10000),
    oninput,
    ...rest
  } = $props();

  let wrapperClasses = $derived(
    clsx(className, "custom-checkbox", "custom-control"),
  );

  let directClasses = $derived(clsx(className, { "form-check-input": !addon }));

  let data = $derived(filterDataKeys(rest));
</script>

{#if label}
  <div class={wrapperClasses}>
    <input
      {id}
      {...data}
      type="checkbox"
      class="custom-control-input"
      {disabled}
      {label}
      bind:checked
      {oninput}
    />
    <label class="custom-control-label" for={id}>{label}</label>
  </div>
{:else}
  <input
    {id}
    {...data}
    type="checkbox"
    class={directClasses}
    {disabled}
    bind:checked
    {oninput}
  />
{/if}
