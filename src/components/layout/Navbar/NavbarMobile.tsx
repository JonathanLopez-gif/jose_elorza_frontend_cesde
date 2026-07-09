import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

export function NavbarMobile() {
    return (
        <div className="flex h-16 items-center justify-between lg:hidden">
            <Logo showSubtitle={false} />

            <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de navegación"
            >
                <Menu className="h-6 w-6" />
            </Button>
        </div>
    );
}