<script>
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  import { board, colorMode } from "../store.js";
  import Button from "./Button.svelte";

  export let canControl = false;

  let intervalId = null;
  let displayMs = 0;
  let isRunning = false;
  let isExpired = false;

  $: timerEndAt = $board.data?.timer_end_at ?? null;
  $: timerDuration = $board.data?.timer_duration ?? 10;
  $: timerRemainingMs = $board.data?.timer_remaining_ms ?? null;

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  $: updateInterval(timerEndAt, timerRemainingMs, timerDuration);

  function updateInterval(endAt, remainingMs, duration) {
    clearInterval(intervalId);
    if (endAt !== null && Date.now() < endAt) {
      isRunning = true;
      isExpired = false;
      tick();
      intervalId = setInterval(tick, 1000);
    } else if (endAt !== null) {
      isRunning = false;
      isExpired = true;
      displayMs = 0;
    } else {
      isRunning = false;
      isExpired = false;
      displayMs = remainingMs !== null ? remainingMs : duration * 60 * 1000;
    }
  }

  function tick() {
    displayMs = Math.max(0, timerEndAt - Date.now());
    if (displayMs <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      isExpired = true;
    }
  }

  $: colorState =
    isRunning || isExpired
      ? displayMs <= 30000
        ? "danger"
        : displayMs <= 120000
          ? "warning"
          : "normal"
      : "normal";

  onDestroy(() => clearInterval(intervalId));

  function startTimer() {
    const startFrom =
      timerRemainingMs !== null ? timerRemainingMs : timerDuration * 60 * 1000;
    $board = {
      ...$board,
      data: {
        ...$board.data,
        timer_end_at: Date.now() + startFrom,
        timer_remaining_ms: null,
      },
    };
  }

  function stopTimer() {
    $board = {
      ...$board,
      data: {
        ...$board.data,
        timer_end_at: null,
        timer_remaining_ms: Math.max(0, timerEndAt - Date.now()),
      },
    };
  }

  function resetTimer() {
    $board = {
      ...$board,
      data: {
        ...$board.data,
        timer_end_at: null,
        timer_remaining_ms: null,
      },
    };
  }

  function setDuration(e) {
    const mins = parseInt(e.target.value, 10);
    if (!isNaN(mins) && mins > 0) {
      $board = {
        ...$board,
        data: {
          ...$board.data,
          timer_duration: mins,
          timer_remaining_ms: null,
        },
      };
    }
  }
</script>

<div
  class="timer-widget card p-2"
  class:timer-warning={colorState === "warning"}
  class:timer-danger={colorState === "danger"}
  data-name="timer-widget"
>
  <div
    class="timer-display text-center fw-bold font-monospace fs-2 lh-1 py-1"
    data-name="timer-display"
  >
    {#if isExpired && displayMs === 0}
      <span class="text-danger" data-name="timer-times-up"
        >{$_("board.timer.times_up")}</span
      >
    {:else}
      {formatTime(displayMs)}
    {/if}
  </div>

  {#if canControl}
    {#if !isRunning}
      <div class="d-flex justify-content-center align-items-center gap-2 mt-2">
        <small class="text-secondary">{$_("board.timer.duration_label")}:</small
        >
        <input
          type="number"
          class="form-control form-control-sm text-center"
          style="width: 5rem;"
          min="1"
          max="999"
          value={timerDuration}
          on:change={setDuration}
          data-name="timer-duration-input"
        />
        <small class="text-secondary">{$_("board.timer.minutes")}</small>
      </div>
    {/if}

    <div class="d-flex justify-content-center gap-2 mt-2">
      {#if !isRunning}
        <Button
          size="sm"
          color="success"
          on:click={startTimer}
          data-name="timer-start-button"
        >
          {$_("board.timer.start")}
        </Button>
      {:else}
        <Button
          size="sm"
          color="warning"
          on:click={stopTimer}
          data-name="timer-stop-button"
        >
          {$_("board.timer.stop")}
        </Button>
      {/if}
      <Button
        size="sm"
        color={$colorMode}
        disabled={isRunning}
        on:click={resetTimer}
        data-name="timer-reset-button"
      >
        {$_("board.timer.reset")}
      </Button>
    </div>
  {/if}
</div>

<style>
  .timer-widget {
    min-width: 200px;
    transition:
      background-color 0.5s ease,
      border-color 0.5s ease;
  }

  .timer-warning {
    border-color: #e3b23c !important;
    background-color: rgba(227, 178, 60, 0.15) !important;
  }

  .timer-danger {
    border-color: #dc3545 !important;
    background-color: rgba(220, 53, 69, 0.15) !important;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  input[type="number"]::-webkit-inner-spin-button {
    display: none;
  }
</style>
