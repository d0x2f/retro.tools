<script>
  export let placeholder = '';
  export let text;
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  input {
    width: 100%;
    border: 0.1em solid darken($background, 10%);
    border-radius: 0.2em;
    resize: none;
    box-sizing: border-box;
    padding: 0.2em;
    font-size: 100%;
  }

  input:focus {
    border: 0.1em solid $primary;
  }
</style>

<input type="text" {placeholder} bind:value={text} />
