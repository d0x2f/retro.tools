<script>
  import { onMount } from "svelte";
  import Icon from "fa-svelte";
  import { faFrown, faMeh, faSmile } from "@fortawesome/free-regular-svg-icons";

  import { board, ranks, cards } from "../store.js";
  import Card from "./Card.svelte";

  import { getCards, createCard, deleteRank } from "../api.js";

  export let rank;
  export let color;

  let cardText = "";
  let icon;

  switch (rank.name.toLowerCase()) {
    case "mad":
      icon = faFrown;
      break;
    case "sad":
      icon = faMeh;
      break;
    case "glad":
    default:
      icon = faSmile;
      break;
  }

  async function newCard() {
    const id = Math.ceil(Math.random() * 10000);
    cards.append({
      description: cardText,
      id,
      name: "Card",
      rank_id: rank.id,
      uncommitted: true
    });
    const card = await createCard($board.id, rank.id, cardText);
    cards.replace(id, card);
  }

  async function doDeleteRank() {
    ranks.update(ranks => {
      ranks.splice($ranks.indexOf(rank), 1);
      return ranks;
    });
    await deleteRank($board.id, rank.id);
  }

  onMount(async () => cards.set(rank.id, await getCards($board.id, rank.id)));
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .rank {
    position: relative;
    flex: 0 0 16em;
  }

  h1 {
    display: inline-block;
    text-align: center;
    margin: 0;
    font-size: 1em;
  }

  .header {
    text-align: center;
    font-size: 80%;
    padding-bottom: 0.5em;
  }

  .no-cards {
    color: #aaa;
    text-align: center;
    padding-top: 2em;
  }

  .icon {
    font-size: 120%;
  }

  .mad {
    border-bottom: 4px solid $mad;
    color: $mad;
  }

  .sad {
    border-bottom: 4px solid $sad;
    color: $sad;
  }

  .glad {
    border-bottom: 4px solid $glad;
    color: $glad;
  }
</style>

<div class="rank">
  <div class="header {rank.name.toLowerCase()}">
    <div class="icon">
      <Icon {icon} />
    </div>
    <h1>{rank.name}</h1>
  </div>
  <div class="cards">
    {#if $cards[rank.id]}
      {#each $cards[rank.id] as card}
        <Card {card} />
      {/each}
    {/if}
    {#if !$cards[rank.id] || $cards[rank.id].length === 0}
      <div class="no-cards">Nothing...</div>
    {/if}
  </div>
</div>
