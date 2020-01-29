<script>
  import { onMount } from 'svelte';

  export let text;
  export let width;
  export let height;
  export let colorDark = '#000000';
  export let colorLight = '#ffffff';

  onMount(() => {
    /* eslint-disable no-undef */
    new QRCode('qrcode', {
      text,
      width,
      height,
      colorDark,
      colorLight,
      correctLevel: QRCode.CorrectLevel.M,
    });
  });
</script>

<div id="qrcode" />
