<script>
  import { onMount } from "svelte";
  import clsx from "clsx";

  import { QRCode } from "../qrcode.js";

  let className = "";
  export { className as class };
  export let text;
  export let width;
  export let height;
  export let colorDark = "#000000";
  export let colorLight = "#ffffff";

  onMount(() => {
    new QRCode("qrcode", {
      text,
      width,
      height,
      colorDark,
      colorLight,
      correctLevel: QRCode.CorrectLevel.M,
    });
  });

  $: classes = clsx(className, "card", "card-body");
</script>

<div data-name="qr-code" class={classes}>
  <div id="qrcode" />
</div>
