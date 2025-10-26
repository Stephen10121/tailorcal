<script lang="ts">
    let { date }: { date: Date } = $props();
</script>

{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} {date.getDate()} {date.getFullYear()} {date.getHours()}:{date.getMinutes()}