import { motion } from "framer-motion";

interface AboutSectionProps {
    id?: string; // ← Add this line
    heading: string;
    subheading: string;
    description: React.ReactNode[]; // supports JSX like <p>...</p>
    stats: {
        label: string;
        value: string;
        color: string;
    }[];
}

export const AboutSection = ({
    id = "about",
    heading,
    subheading,
    description,
    stats
}: AboutSectionProps) => {
    return (
        <section
            id={id}
            className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden"
        >
            {/* Floating elements (can be extracted too if needed) */}
            {/* ...same motion.divs for animation... */}

            <div className="container mx-auto px-4 relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
                        {heading}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">{subheading}</p>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                >
                    <div className="flex flex-col items-center">
                        <motion.div
                            className="text-8xl mb-6 relative"
                            animate={{
                                textShadow: [
                                    "0 0 5px rgba(6, 182, 212, 0.2)",
                                    "0 0 20px rgba(6, 182, 212, 0.6)",
                                    "0 0 5px rgba(6, 182, 212, 0.2)"
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            👨‍💻
                        </motion.div>

                        <div className="w-full max-w-2xl text-center">
                            {description.map((para, i) => (
                                <div key={i}>
                                    {para}
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="text-center p-4 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className={`text-3xl font-bold text-${stat.color} mb-2`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300">{stat.label}</div>
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300`}
                                    ></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};