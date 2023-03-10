<script>
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { board, password } from '../store.js';
  import { checkBoardPassword } from '../encryption.js';
  import { Icons } from '../data.js';

  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Spinner from './Spinner.svelte';

  let showPassword = false;
  let checkBusy = false;
  let inputPassword = '';
  let inputBox;

  const dispatch = createEventDispatcher();

  async function checkPassword() {
    checkBusy = true;
    if (await checkBoardPassword($board, inputPassword)) {
      password.set(inputPassword);
      dispatch('accepted');
      return;
    }
    inputBox.classList.add('animate__shakeX');
    setTimeout(() => {
      inputBox.classList.remove('animate__shakeX');
      inputPassword = '';
      checkBusy = false;
    }, 500);
  }
</script>

<div class="d-flex justify-content-center w-100 h-100">
  <div class="d-flex flex-column justify-content-center">
    <div bind:this={inputBox} class="box h-50 animate__animated">
      <p class="text-primary mb-1">{$_('general.password')}</p>
      <div class="input-group">
        <Input
          readonly={undefined}
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          bind:value={inputPassword}
        />
        <div class="input-group-append">
          <Button on:click={() => (showPassword = !showPassword)}>
            {#if showPassword}
              <Icons.eye />
            {:else}
              <Icons.eyeOff />
            {/if}
          </Button>
        </div>
      </div>
      <div class="text-right">
        <Button
          class="mt-1"
          color="primary"
          on:click={checkPassword}
          disabled={checkBusy}
        >
          <div class="d-flex">
            <div class="d-block unlock-icon">
              {#if checkBusy}
                <Spinner size="sm" color="light" />
              {:else}
                <Icons.unlock size="100%" />
              {/if}
            </div>
            {$_('board.unlock')}
          </div>
        </Button>
      </div>
    </div>
  </div>
</div>

<style>
  .box {
    width: 20em;
  }

  .unlock-icon {
    width: 1em;
    height: 1em;
    margin-top: -1px;
    margin-right: 4px;
  }
</style>
