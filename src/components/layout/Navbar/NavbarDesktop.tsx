import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { CTA } from "@/constants/cta";

import { Navigation } from "./Navigation";

export function NavbarDesktop() {
    return (
        <div className="hidden h-20 items-center justify-between lg:flex">
            <Logo />

            <Navigation />

            <Button size="lg">
                {CTA.bookAppointment}
            </Button>
        </div>
    );
}