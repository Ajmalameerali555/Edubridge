import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-brand-navy py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight leading-none">
                EduBridge
              </span>
              <span className="text-white/35 text-[10px] sm:text-xs font-bold tracking-[0.2em] leading-none mt-0.5">
                LEARNING
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10 text-white/45 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors duration-300" data-testid="link-footer-privacy">
              PRIVACY
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300" data-testid="link-footer-contact">
              CONTACT US
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300" data-testid="link-footer-help">
              HELP CENTER
            </a>
          </div>
        </motion.div>

        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/[0.06]">
          <div className="flex items-center justify-center">
            <div className="w-8 h-1 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
