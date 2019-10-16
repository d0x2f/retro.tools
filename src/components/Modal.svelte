<script>
  import { createEventDispatcher } from 'svelte';
  import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

  import Button from './Button.svelte';

  const dispatch = createEventDispatcher();
</script>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    width: calc(100vw - 4em);
    max-width: 32em;
    max-height: calc(100vh - 4em);
    overflow: auto;
    transform: translate(-50%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: white;
    z-index: 2;
  }

  .buttons {
    text-align: right;
    display: block;
    margin-top: 1em;
  }

  .button {
    display: inline-block;
    width: 5em;
  }
</style>

<div class="modal-background" on:click={() => dispatch('close')} />

<div class="modal">
  <slot />
  <div class="buttons">
    <div class="button">
      <Button
        on:click={() => dispatch('close')}
        icon={faTimes}
        label="cancel"
        color="negative" />
    </div>
    <div class="button">
      <Button
        on:click={() => dispatch('accept')}
        icon={faCheck}
        label="done"
        color="primary" />
    </div>
  </div>
</div>
