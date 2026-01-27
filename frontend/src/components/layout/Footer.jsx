export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Top */}
        <p className="mb-8 text-sm">
          Questions? Call 000-800-040-1843
        </p>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 md:grid-cols-4">

          <FooterLink text="FAQ" />
          <FooterLink text="Help Centre" />
          <FooterLink text="Account" />
          <FooterLink text="Media Centre" />

          <FooterLink text="Investor Relations" />
          <FooterLink text="Jobs" />
          <FooterLink text="Ways to Watch" />
          <FooterLink text="Terms of Use" />

          <FooterLink text="Privacy" />
          <FooterLink text="Cookie Preferences" />
          <FooterLink text="Corporate Information" />
          <FooterLink text="Contact Us" />

          <FooterLink text="Speed Test" />
          <FooterLink text="Legal Notices" />
          <FooterLink text="Only on Netflix" />
        </div>

        {/* Language */}
        <div className="mt-10">
          <select className="rounded border border-white/30 bg-black px-4 py-2 text-sm">
            <option>English</option>
            <option>தமிழ்</option>
            <option>हिन्दी</option>
          </select>
        </div>

        {/* Bottom */}
        <p className="mt-6 text-xs">
          Netflix Clone © {new Date().getFullYear()} — Built by Adhith
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ text }) {
  return (
    <a href="#" className="hover:underline">
      {text}
    </a>
  );
}
