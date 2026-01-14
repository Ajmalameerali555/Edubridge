import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { DrawerMenu } from "./DrawerMenu";

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20"
                data-testid="button-hamburger-menu"
              >
                <Menu className="w-5 h-5 text-white" strokeWidth={2} />
              </motion.button>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-brand-ink tracking-tight leading-none">
                  EduBridge
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand-muted tracking-[0.2em] leading-none">
                  LEARNING
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-brand-blue text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-blue/25 transition-shadow hover:shadow-xl hover:shadow-brand-blue/30"
              data-testid="button-get-started-nav"
            >
              GET STARTED
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
