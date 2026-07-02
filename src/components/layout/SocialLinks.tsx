import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

import { cn } from "@/lib/utils";

interface SocialLinksProps {
    className?: string;
    iconClassName?: string;
}

const socialLinks = [
    {
        name: "Instagram",
        href: "#",
        icon: Instagram,
    },
    {
        name: "Facebook",
        href: "#",
        icon: Facebook,
    },
    {
        name: "LinkedIn",
        href: "#",
        icon: Linkedin,
    },
    {
        name: "YouTube",
        href: "#",
        icon: Youtube,
    },
];

export function SocialLinks({
    className,
    iconClassName,
}: SocialLinksProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="rounded-full p-2 transition-colors hover:bg-muted"
                >
                    <Icon className={cn("h-5 w-5", iconClassName)} />
                </a>
            ))}
        </div>
    );
}