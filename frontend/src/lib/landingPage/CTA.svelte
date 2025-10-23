<script>
    import { Button } from "@/components/ui/button";
    import { ArrowRight } from "@lucide/svelte";

</script>
<section class="py-20 sm:py-32 bg-secondary text-secondary-foreground">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center space-y-8">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
                Ready to transform your scheduling?
            </h2>
            <p class="text-lg text-secondary-foreground/80 leading-relaxed">
                Join thousands of professionals who have streamlined their calendar management with TailorCal. Start your
                free trial today—no credit card required.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default">
                Start Free Trial
                <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
            <Button
                size="lg"
                variant="outline"
                class="border-secondary-foreground/20 text-secondary-foreground hover:bg-primary-foreground/10 hover:text-secondary-foreground/70 bg-transparent"
            >
                Contact Sales
            </Button>
            </div>
        </div>
    </div>
</section>