<script>
  export let code;

  code = code.split('-')[0];
</script>

<style>
  .flag {
    width: 2em;
  }
</style>

<img class="flag" src="/flags/{code}.svg" alt="Language flag for '{code}'" />
