import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart2, PieChart, TrendingUp, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-linear-to-tr from-blue-500 to-cyan-400 p-2 rounded-lg">
                                    <BarChart2 className="w-6 h-6 text-white" />
                                </div>
                            </motion.div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                                just data
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link to="/dashboards" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Log In
                            </Link>
                            <Link to="/dashboards">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-950 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        The Future of Analytics is Here
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold tracking-tight mb-8"
                    >
                        Data Intelligence, <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-b from-blue-400 to-cyan-300">
                            Simplified for Everyone.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed"
                    >
                        Transform raw numbers into actionable insights in seconds.
                        Designed for founders, analysts, and managers who need
                        clarity, not complexity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/dashboards" className="w-full sm:w-auto">
                            <button className="w-full group relative px-8 py-3.5 bg-blue-600 rounded-xl font-semibold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                                Start Building Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">
                            View Demo
                        </button>
                    </motion.div>

                    {/* Hero Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-20 relative mx-auto max-w-5xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent z-10" />
                        <div className="rounded-xl bg-slate-900 border border-white/10 p-2 shadow-2xl">
                            <div className="rounded-lg overflow-hidden bg-slate-950 aspect-video relative grid place-items-center">
                                {/* Abstract Configurator UI Mockup */}
                                <div className="absolute inset-0 flex">
                                    <div className="w-64 border-r border-white/5 p-4 space-y-4 hidden md:block">
                                        <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
                                        <div className="space-y-2 pt-4">
                                            <div className="h-4 bg-white/5 rounded w-full" />
                                            <div className="h-4 bg-white/5 rounded w-5/6" />
                                            <div className="h-4 bg-white/5 rounded w-4/6" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col gap-6">
                                        <div className="flex gap-4">
                                            <div className="flex-1 h-32 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
                                                <TrendingUp className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <div className="flex-1 h-32 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                                                <PieChart className="w-8 h-8 text-cyan-400" />
                                            </div>
                                            <div className="flex-1 h-32 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center justify-center">
                                                <BarChart2 className="w-8 h-8 text-purple-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
                                            {/* Faux Graph */}
                                            <div className="absolute bottom-0 left-0 right-0 h-3/4 flex items-end justify-between px-8 pb-8 gap-2">
                                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        whileInView={{ height: `${h}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-t"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to turn complex datasets into clear, persuasive stories.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Lightning Fast"
                            description="Process thousands of rows instantly. Our optimized engine handles heavy lifting right in your browser."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            title="Secure by Design"
                            description="Your data never leaves your device until you choose to share it. Enterprise-grade security for everyone."
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-pink-400" />}
                            title="Team Collaboration"
                            description="Share dashboards with a single click. Comment, annotate, and drive decisions together."
                        />
                    </div>
                </div>
            </section>

            {/* Target Audience Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Built for <span className="text-blue-400">Founders</span>,<br />
                                Loved by <span className="text-cyan-400">Analysts</span>.
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Whether you are pitching to VCs or optimizing quarterly budgets,
                                Just Data gives you the visual edge you need without the steep learning curve.
                            </p>

                            <div className="space-y-4">
                                <CheckItem text="Drag-and-drop interface for rapid prototyping" />
                                <CheckItem text="Export to PDF, PNG, or interactive web links" />
                                <CheckItem text="Pre-built templates for SaaS, E-commerce, and Finance" />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 translate-y-8">
                                    <StatCard value="2.5x" label="Faster Reporting" />
                                    <StatCard value="10k+" label="Charts Created" />
                                </div>
                                <div className="space-y-4">
                                    <StatCard value="100%" label="Data Privacy" />
                                    <StatCard value="24/7" label="Support Access" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to see your data differently?</h2>
                    <p className="text-xl text-slate-300 mb-10">Join thousands of data-driven professionals today.</p>
                    <Link to="/dashboards">
                        <button className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl">
                            Get Started for Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg">just data</span>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2024 Just Data Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-colors"
    >
        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 border border-white/10">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
);

const CheckItem = ({ text }) => (
    <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
        </div>
        <span className="text-slate-300">{text}</span>
    </div>
);

const StatCard = ({ value, label }) => (
    <div className="p-6 rounded-2xl bg-slate-800/80 backdrop-blur border border-white/10 text-center">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
    </div>
);

export default LandingPage;
