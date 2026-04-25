<script>
  import { createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  import clsx from "clsx";

  let {
    class: className = "",
    disabled = false,
    checked = $bindable(false),
    label = "",
    addon = false,
    id = "id-" + Math.floor(Math.random() * 10000),
  } = $props();

  let wrapperClasses = $derived(
    clsx(className, "custom-checkbox", "custom-control"),
  );

  let directClasses = $derived(clsx(className, { "form-check-input": !addon }));
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
      oninput={bubble("input")}
    />
    <label class="custom-control-label" for={id}>{label}</label>
  </div>
{:else}
  <input
    {id}
    type="checkbox"
    class={directClasses}
    {disabled}
    bind:checked
    oninput={bubble("input")}
  />
{/if}
