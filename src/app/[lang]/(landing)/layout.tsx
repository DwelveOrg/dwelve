import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

/**
 * The chrome every public page shares.
 *
 * The footer used to be the last element of `page.tsx`, which was fine while the
 * home page was the site. It belongs here now for the same reason the navbar
 * does: it is the site's map, and a reader who reaches the bottom of the terms
 * of service needs it at least as much as one who reaches the bottom of the
 * pitch.
 */
export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="landing-shell-bg font-sans min-h-screen text-muted-foreground">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
