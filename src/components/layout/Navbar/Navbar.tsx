import { Container } from '@/components/layout/Container'
import { NavbarDesktop } from './NavbarDesktop'
import { NavbarMobile } from './NavbarMobile'

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-[#1a3a5c]/08 bg-[#f7f5f1]/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <Container className="max-w-[1280px] px-6 lg:px-10">
        <NavbarDesktop />
        <NavbarMobile />
      </Container>
    </nav>
  )
}
