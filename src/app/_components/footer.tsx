import Container from "@/app/_components/container";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row items-center justify-between">
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-center lg:text-left text-gray-700 dark:text-gray-300">
            "Nada definido, siempre creciendo."
          </h3>

          <div className="flex space-x-6 mt-5 lg:mt-0">
            <a
              href="https://github.com/rodacato/notdefined-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-accent-green transition"
            >
              <FaGithub className="text-2xl" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/rodacato"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-accent-green transition"
            >
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </a>

            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-accent-green transition">
              📖 Blog
            </a>
          </div>
        </div>

        {/* Copyright dinámico */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          © {new Date().getFullYear()} NotDefined.dev — Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
