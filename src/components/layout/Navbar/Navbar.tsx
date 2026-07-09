import { Container } from "@/components/layout/Container";

import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80" aria-label="Main navigation">
            <Container>
                <NavbarDesktop />
                <NavbarMobile />
            </Container>
        </nav>
    );
}