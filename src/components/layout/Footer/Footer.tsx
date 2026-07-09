import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";
import { BRAND } from "@/constants/brand";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-muted/30">
            <Container className="py-12">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="space-y-4">
                        <Logo />

                        <p className="max-w-md text-sm text-muted-foreground">
                            {BRAND.description}
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    © {year} {BRAND.name}. Todos los derechos reservados.
                </div>
            </Container>
        </footer>
    );
}