<script>
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let color = 'secondary';

  let classes = '';
  let data = '';

  $: classes = clsx(className, 'btn', `btn-${color}`);
  $: data = filterDataKeys($$props);
</script>

<button {...data} class={classes} {disabled} on:click {value}>
  <slot />
</button>
