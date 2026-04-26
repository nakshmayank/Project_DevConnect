
function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400">
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-lg">
            DevConnect
          </span>
          <span className="text-sm text-zinc-500">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* RIGHT SECTION - SOCIAL LINKS */}
        <div className="flex items-center gap-6">

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2h3.308l-7.227 8.261L23 22h-6.828l-5.35-7.008L4.78 22H1.472l7.73-8.835L1 2h6.999l4.838 6.404L18.244 2z" />
            </svg>
          </a>

          {/* Meta (Facebook) */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zm4.25 5.5A4.75 4.75 0 1112 17a4.75 4.75 0 010-9.5zm5.5-.75a1.25 1.25 0 11-1.25 1.25A1.25 1.25 0 0117.5 6.75z" />
            </svg>
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;