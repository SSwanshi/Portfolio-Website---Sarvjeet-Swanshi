import { motion } from 'framer-motion';

interface FooterProps {
  name: string;
  title: string;
  year?: number;
  socialLinks: { label: string; url: string }[];
}

export const Footer = ({ name, title, year = new Date().getFullYear(), socialLinks }: FooterProps) => {
  return (
    <footer className="py-12 bg-black border-t border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-white">
              {name}
            </h3>
            <p className="text-gray-400 mt-2">{title}</p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map(({ label, url }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-gray-400">
          <p>&copy; {year} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};