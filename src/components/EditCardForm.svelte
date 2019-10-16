<script>
  import TextArea from './TextArea.svelte';

  export let comment;
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .comment {
    margin-bottom: 1em;
    height: 5em;
  }

  h1 {
    margin-bottom: 1em;
    font-family: 'Work Sans', sans-serif;
    text-transform: uppercase;
    color: $primary;
  }
</style>

<h1>Modify Card</h1>

<div class="comment">
  <TextArea bind:text={comment} placeholder="This meeting is boring..." />
</div>
