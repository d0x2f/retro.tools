<script>
  export let placeholder = "";
  export let text;
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  textarea {
    width: 100%;
    height: 100%;
    border: 0.1em solid darken($background, 10%);
    border-radius: 0.5em;
    resize: none;
    box-sizing: border-box;
    padding: 1em;
    font-size: 120%;
  }
</style>

<textarea {placeholder} bind:value={text} />
