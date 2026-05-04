<script>
  import { onMount } from 'svelte';
  import clsx from 'clsx';

  import { QRCode } from '../qrcode.js';

  let {
    class: className = '',
    text,
    width,
    height,
    colorDark = '#000000',
    colorLight = '#ffffff',
  } = $props();

  onMount(() => {
    new QRCode('qrcode', {
      text,
      width,
      height,
      colorDark,
      colorLight,
      correctLevel: QRCode.CorrectLevel.M,
    });
  });

  let classes = $derived(clsx(className, 'card', 'card-body'));
</script>

<div data-name="qr-code" class={classes}>
  <div id="qrcode"></div>
</div>
