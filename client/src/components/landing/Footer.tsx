import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-brand-navy py-10 sm:py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-lg tracking-tight leading-none">
                EduBridge
              </span>
              <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] leading-none">
                LEARNING
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 text-white/50 text-sm">
            <a href="#" className="hover:text-white transition-colors" data-testid="link-footer-privacy">
              PRIVACY
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-footer-contact">
              CONTACT US
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-footer-help">
              HELP CENTER
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
