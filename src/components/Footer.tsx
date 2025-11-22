export function Footer() {
  return (
    <footer className="py-8 border-t border-[#00D9FF]/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            © 2025 AuraGen. Powered by Wikipedia.
          </div>
          <nav className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-[#00D9FF] transition-colors text-sm"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#00D9FF] transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#00D9FF] transition-colors text-sm"
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
