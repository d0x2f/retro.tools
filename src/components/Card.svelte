<script>
  import Icon from "fa-svelte";
  import {
    faTimesCircle,
    faEdit,
    faHeart
  } from "@fortawesome/free-regular-svg-icons";

  export let id;
  export let text = "";
</script>

<style>
  .card {
    margin: 1em;
    padding: 1em;
    text-align: left;
    font-size: 0.8em;
    background-color: #ffffffcc;
    border-radius: 4px;
    min-height: 1em;
    display: flex;
  }

  .votes {
    flex: 0 0 5em;
  }

  .votes > .heart {
    cursor: pointer;
    font-size: 1.3em;
  }

  .votes > .number {
    font-size: 1.5em;
    margin-left: 0.4em;
  }

  .text {
    flex: 1 1 2em;
  }

  .icons {
    flex: 0 0 3em;
    font-size: 1em;
  }

  .icons > span {
    padding-left: 0.2em;
    cursor: pointer;
  }

  .icons > span:hover {
    color: #000000ff;
  }
</style>

<div class="card">
  <div class="votes">
    <span class="heart">
      <Icon icon={faHeart} />
    </span>
    <span class="number">4</span>
  </div>
  <span class="text">{text}</span>
  <div class="icons">
    <span class="edit">
      <Icon icon={faEdit} />
    </span>
    <span class="delete">
      <Icon icon={faTimesCircle} />
    </span>
  </div>
</div>
