import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Mail, User, MessageSquare, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from '@emailjs/browser'; // Uncomment when you install EmailJS

type ButtonProps = {
    label: string;
    variant?: "primary" | "outline";
    onClick?: () => void;
};

type ContactSectionProps = {
    heading: string;
    description: string;
    buttons: ButtonProps[];
    sectionId?: string;
};

type ToastType = 'success' | 'error';

type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

const ContactSection = ({
    heading,
    description,
    buttons,
    sectionId = "contact",
}: ContactSectionProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const showToast = (type: ToastType, message: string) => {
        const id = Date.now().toString();
        const newToast: Toast = { id, type, message };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove toast after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const EMAILJS_CONFIG = {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            showToast('error', "Please fill in all fields.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('error', "Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        try {
            const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

            if (!serviceId || !templateId || !publicKey) {
                throw new Error("Missing EmailJS configuration values");
            }

            // Uncomment this when you have EmailJS installed and configured
            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: "your-email@example.com", // Your destination email
                },
                publicKey
            );

            // Simulate API call for demo (remove this when using EmailJS)
            await new Promise(resolve => setTimeout(resolve, 2000));

            showToast('success', "Thank you for your message! We'll get back to you soon.");
            setFormData({ name: "", email: "", message: "" });
            setIsFormOpen(false);
        } catch (error) {
            console.error('EmailJS Error:', error);
            showToast('error', "Sorry, there was an error sending your message. Please try again or contact us directly.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = (button: ButtonProps) => {
        if (button.label.toLowerCase().includes("get in touch")) {
            setIsFormOpen(true);
        } else if (button.onClick) {
            button.onClick();
        }
    };

    const ToastContainer = () => (
        <div className="fixed top-20 right-4 z-[60] space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm min-w-[300px] ${
                            toast.type === 'success'
                                ? 'bg-green-900/90 border-green-500/50 text-green-100'
                                : 'bg-red-900/90 border-red-500/50 text-red-100'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                        
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-300 hover:text-white transition-colors p-1 flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            <section id={sectionId} className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
                            {heading}
                        </h2>
                        <p className="text-xl text-gray-300 mb-12">{description}</p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            {buttons.map((button, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleButtonClick(button)}
                                    className={
                                        button.variant === "primary"
                                            ? "px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                                            : "px-8 py-4 border-2 border-purple-500 text-purple-400 font-semibold rounded-full hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                                    }
                                >
                                    {button.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFormOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                    Get in Touch
                                </h3>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your Email"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-4 text-gray-400" size={20} />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Your Message"
                                        rows={4}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsFormOpen(false)}
                                        disabled={isLoading}
                                        className={`flex-1 py-3 border-2 font-semibold rounded-lg transition-all duration-300 ${isLoading
                                                ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                                                : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className={`flex-1 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${isLoading
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send Message
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Container */}
            <ToastContainer />
        </>
    );
};

export default ContactSection;