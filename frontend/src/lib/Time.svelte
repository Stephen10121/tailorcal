<script lang="ts">
    let { date, useAMPM }: { date: Date, useAMPM: boolean } = $props();

    let hour = $state("");
    let minute = $state("");
    let isAM = $state(true);

    $effect(() => {
        if (useAMPM) {
            let tempHour = date.getHours();
            if (tempHour > 12) {
                hour = String(date.getHours() - 12);
            } else {
                hour = String(date.getHours());
            }
            if (tempHour < 1) {
                hour = "12"
            }
            isAM = tempHour < 12 || tempHour === 24;
        } else {
            hour = String(date.getHours()).padStart(2, "0");
        }
        minute = String(date.getMinutes()).padStart(2, "0");
    });
</script>

{hour}:{minute} {#if useAMPM}{#if isAM}AM{:else}PM{/if}{/if}