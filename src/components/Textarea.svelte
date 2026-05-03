<script>
  import { run, createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  import { createEventDispatcher } from "svelte";
  import { autoresize as autoresizer } from "svelte-textarea-autoresize";
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let {
    value = $bindable(""),
    placeholder = "",
    autoresize = false,
    autofocus = false,
    minWidth = "0px",
    class: className = "",
    ...rest
  } = $props();

  const dispatch = createEventDispatcher();
  let element = $state();
  let classes = $state();
  let data = $state({});

  function keyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (value.length > 0) {
        dispatch("submit", {
          text: value,
        });
      }
      event.preventDefault();
    } else if (event.key === "Escape") {
      dispatch("cancel");
    }
  }

  // This snippet ensures that the input box returns to a single line
  // when it's cleared via svelte reactively.
  run(() => {
    if (element && value.length == 0) {
      element.value = "";
      element.dispatchEvent(new Event("input"));
    }

    classes = clsx(className, "form-control");
  });

  function use(el) {
    if (autoresize) autoresizer(el);
    if (autofocus) el.focus();
  }

  run(() => {
    data = filterDataKeys(rest);
  });
</script>

<textarea
  {...data}
  rows="1"
  style="min-width: {minWidth}"
  bind:this={element}
  use:use
  onfocus={bubble("focus")}
  onblur={bubble("blur")}
  onkeydown={keyDown}
  class={classes}
  bind:value
  {placeholder}
></textarea>

<style>
  textarea {
    resize: none;
    overflow: hidden;
    padding: 8px;
    box-sizing: border-box;
    outline: none;
  }

  textarea:focus {
    transition: border-color 0.5s;
  }
</style>
