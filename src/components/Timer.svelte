<script>
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  import { board, colorMode } from "../store.js";
  import Button from "./Button.svelte";

  export let canControl = false;

  let intervalId = null;
  let displayMs = 0;

  $: timerEndAt = $board.data?.timer_end_at ?? null;
  $: timerDuration = $board.data?.timer_duration ?? 10;
  $: isRunning = timerEndAt !== null && Date.now() < timerEndAt;
  $: isExpired = timerEndAt !== null && !isRunning;

  function getRemainingMs() {
    if (timerEndAt === null) return timerDuration * 60 * 1000;
    return Math.max(0, timerEndAt - Date.now());
  }

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Restart or stop the interval whenever the timer end timestamp changes.
  // Using a named function keeps reactive dependencies explicit for the linter.
  $: updateInterval(timerEndAt);

  function updateInterval(endAt) {
    clearInterval(intervalId);
    if (endAt !== null && Date.now() < endAt) {
      tick();
      intervalId = setInterval(tick, 1000);
    } else if (endAt !== null) {
      displayMs = 0;
    } else {
      displayMs = timerDuration * 60 * 1000;
    }
  }

  function tick() {
    displayMs = Math.max(0, timerEndAt - Date.now());
    if (displayMs <= 0) clearInterval(intervalId);
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
    $board = {
      ...$board,
      data: {
        ...$board.data,
        timer_end_at: Date.now() + timerDuration * 60 * 1000,
      },
    };
  }

  function stopTimer() {
    $board = {
      ...$board,
      data: { ...$board.data, timer_end_at: null },
    };
  }

  function resetTimer() {
    $board = {
      ...$board,
      data: { ...$board.data, timer_end_at: null },
    };
  }

  function setDuration(mins) {
    $board = {
      ...$board,
      data: { ...$board.data, timer_duration: mins },
    };
  }
</script>

<div
  class="timer-widget card p-2"
  class:timer-warning={colorState === "warning"}
  class:timer-danger={colorState === "danger"}
  data-name="timer-widget"
>
  <div class="timer-display text-center fw-bold font-monospace fs-2 lh-1 py-1">
    {#if isExpired && displayMs === 0}
      <span class="text-danger">{$_("board.timer.times_up")}</span>
    {:else}
      {formatTime(displayMs)}
    {/if}
  </div>

  {#if canControl}
    <div class="d-flex justify-content-center align-items-center gap-1 mt-2">
      <small class="text-secondary me-1"
        >{$_("board.timer.duration_label")}:</small
      >
      {#each [5, 10, 15, 20] as mins (mins)}
        <button
          class="btn btn-sm"
          class:btn-primary={timerDuration === mins}
          class:btn-outline-secondary={timerDuration !== mins}
          disabled={isRunning}
          on:click={() => setDuration(mins)}
        >
          {mins}
        </button>
      {/each}
      <small class="text-secondary ms-1">{$_("board.timer.minutes")}</small>
    </div>

    <div class="d-flex justify-content-center gap-2 mt-2">
      {#if !isRunning}
        <Button size="sm" color="success" on:click={startTimer}>
          {$_("board.timer.start")}
        </Button>
      {:else}
        <Button size="sm" color="warning" on:click={stopTimer}>
          {$_("board.timer.stop")}
        </Button>
      {/if}
      <Button
        size="sm"
        color={$colorMode}
        disabled={isRunning}
        on:click={resetTimer}
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
</style>
