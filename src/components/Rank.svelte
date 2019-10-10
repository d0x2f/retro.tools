<script>
  import { onMount } from "svelte";
  import Icon from "fa-svelte";
  import { faTimesCircle, faEdit } from "@fortawesome/free-regular-svg-icons";

  import Card from "./Card.svelte";

  export let id;
  export let name = "Untitled";
  export let color = "grey";

  let cards = [];

  onMount(async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/boards/kMwWp5Ef1JaITphF/ranks/${id}/cards`,
      {
        credentials: "include"
      }
    );
    cards = await response.json();
  });
</script>

<style>
  .rank {
    position: relative;
    flex: 1 1 10em;
  }

  h1 {
    display: inline-block;
    text-align: center;
    margin-top: 1em;
    font-size: 1em;
  }

  .header {
    text-align: center;
  }

  .input {
    padding: 0 0.8em;
    display: flex;
  }

  .icons {
    padding: 0 1em;
  }

  input {
    background-color: rgba(255, 255, 255, 0.5);
    border: 0;
    padding: 1em;
  }

  input[type="text"] {
    flex: 2;
  }

  input[type="button"] {
    cursor: pointer;
    margin-left: 0.2em;
    width: 4em;
  }

  input[type="button"]:hover {
    background-color: #ddddddff;
  }

  .icons {
    position: absolute;
    right: 0px;
    font-size: 1em;
    margin: 1em 0 0 0;
  }

  .icons > span {
    padding-left: 0.2em;
    cursor: pointer;
  }

  .icons > span:hover {
    color: #000000ff;
  }
</style>

<div class="rank" style="background-color: {color};">
  <div class="header">
    <div class="icons">
      <span class="edit">
        <Icon icon={faEdit} />
      </span>
      <span class="close">
        <Icon icon={faTimesCircle} />
      </span>
    </div>
    <h1>{name}</h1>
  </div>
  <div class="input">
    <input type="text" placeholder="Type your card text here" />
    <input type="button" value="Add" />
  </div>
  <div class="cards">
    {#each cards as card}
      <Card id={card.id} text={card.description} />
    {/each}
  </div>
</div>
