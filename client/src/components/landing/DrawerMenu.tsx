import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: "PLATFORM",
    items: [
      { label: "HOW IT WORKS", href: "/#how-it-works" },
      { label: "FIND TUTORS", href: "/#tutors" },
      { label: "OFFERS", href: "/#offers" },
    ],
  },
  {
    title: "CAREERS",
    items: [
      { label: "BECOME A TUTOR", href: "/careers/tutors" },
      { label: "JOIN OUR TEAM", href: "/careers/team" },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { label: "HELP CENTER", href: "/help" },
      { label: "CONTACT US", href: "/contact" },
      { label: "PRIVACY", href: "/privacy" },
    ],
  },
];

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="drawer-backdrop"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-brand-navy z-50 overflow-y-auto"
            data-testid="drawer-menu"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
                    <span className="text-white font-black text-lg">E</span>
                  </div>
                  <span className="text-white font-extrabold text-lg tracking-tight">
                    EDUBRIDGE
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                  data-testid="button-close-drawer"
                >
                  <X className="w-5 h-5 text-white" strokeWidth={2} />
                </motion.button>
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-10">
                Bridging the gap between academic rigor and student success across the UAE with world-class mentors.
              </p>

              <div className="space-y-8">
                {menuSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + sectionIndex * 0.1 }}
                  >
                    <h3 className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <motion.a
                          key={item.label}
                          href={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                          className="block text-white font-semibold text-base hover:text-brand-blue transition-colors"
                          data-testid={`link-drawer-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {item.label}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
