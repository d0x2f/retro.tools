<script>
  export let text = 'Placeholder text';
  export let checked = false;

  let id = Math.floor(Math.random() * 10000);
</script>

<style>

</style>

<div class="custom-control custom-switch mr-3 ml-1 text-nowrap">
  <input
    type="checkbox"
    class="custom-control-input"
    id="switch-{id}"
    bind:checked />
  <label class="custom-control-label" for="switch-{id}">{text}</label>
</div>
