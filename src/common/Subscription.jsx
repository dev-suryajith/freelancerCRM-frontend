import React, { useState } from 'react';
import Header from './Header';
import { motion } from "framer-motion";
import { CheckCircle, Star, Users, Zap, Briefcase, TrendingUp, ChevronDown, ChevronUp, X } from "lucide-react";

function Subscription() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly
    const [expandedFeature, setExpandedFeature] = useState(null);

    const plans = [
        {
            name: "Solo",
            price: "Free",
            monthlyPrice: 0,
            yearlyPrice: 0,
            description: "Perfect for just starting out with 1-2 clients.",
            features: [
                "Up to 2 active clients",
                "3 projects maximum",
                "Basic task management",
                "Invoice templates (2/month)",
                "Email notifications",
                "Community support",
                "7-day data retention"
            ],
            bestFor: "Freelancers just getting started",
            icon: <Users className="w-6 h-6" />,
            ctaText: "Get Started",
            ctaVariant: "outline"
        },
        {
            name: "Freelancer",
            price: "$12/mo",
            monthlyPrice: 12,
            yearlyPrice: 120, // $10/mo equivalent with annual discount
            description: "For established freelancers managing multiple clients.",
            features: [
                "Up to 10 active clients",
                "Unlimited projects",
                "Advanced task & time tracking",
                "Unlimited invoicing & estimates",
                "Client portal access",
                "Contract templates",
                "Email & chat support",
                "Expense tracking",
                "Basic reporting & analytics",
                "30-day data retention",
                "Calendar integration"
            ],
            bestFor: "Full-time freelancers with regular clients",
            popular: true,
            icon: <Zap className="w-6 h-6" />,
            ctaText: "Get Started",
            ctaVariant: "primary"
        },
        {
            name: "Professional",
            price: "$29/mo",
            monthlyPrice: 29,
            yearlyPrice: 290, // $24/mo equivalent
            description: "Scale your freelance business with advanced tools.",
            features: [
                "Up to 25 active clients",
                "Everything in Freelancer plan",
                "Custom branding on invoices & proposals",
                "Automated payment reminders",
                "Advanced reporting & client insights",
                "Time tracking with screenshots (optional)",
                "Project templates & workflows",
                "Priority support (24-hour response)",
                "Recurring invoices & subscriptions",
                "Client feedback & approval system",
                "90-day data retention",
                "API access",
                "Tax calculation assistance"
            ],
            bestFor: "High-earning freelancers and small agencies",
            icon: <TrendingUp className="w-6 h-6" />,
            ctaText: "Get Started",
            ctaVariant: "primary"
        },
        {
            name: "Agency",
            price: "$59/mo",
            monthlyPrice: 59,
            yearlyPrice: 590, // $49/mo equivalent
            description: "For growing agencies and team collaboration.",
            features: [
                "Unlimited clients",
                "Everything in Professional plan",
                "Team member seats (up to 3 included)",
                "Client rate cards & service catalogs",
                "Advanced project profitability tracking",
                "Proposal tracking & e-signatures",
                "Custom workflow automation",
                "White-label client portal",
                "Advanced financial reporting",
                "Dedicated account manager",
                "Unlimited data retention",
                "Bulk operations",
                "Multi-currency support",
                "VIP support (4-hour response)",
                "Onboarding assistance"
            ],
            bestFor: "Freelancer teams and small agencies",
            icon: <Briefcase className="w-6 h-6" />,
            ctaText: "Get Started",
            ctaVariant: "secondary"
        }
    ];

    const featuresComparison = [
        { name: "Active Clients", solo: "2", freelancer: "10", professional: "25", agency: "Unlimited" },
        { name: "Projects", solo: "3 max", freelancer: "Unlimited", professional: "Unlimited", agency: "Unlimited" },
        { name: "Invoicing", solo: "Basic", freelancer: "Unlimited", professional: "Advanced", agency: "Enterprise" },
        { name: "Client Portal", solo: "❌", freelancer: "✅", professional: "✅", agency: "White-label" },
        { name: "Time Tracking", solo: "Basic", freelancer: "Advanced", professional: "Premium", agency: "Premium" },
        { name: "Support", solo: "Community", freelancer: "Email/Chat", professional: "Priority 24h", agency: "VIP 4h" },
        { name: "Team Members", solo: "1", freelancer: "1", professional: "1", agency: "3 included" },
    ];

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const toggleFeatureDetail = (featureIndex) => {
        setExpandedFeature(expandedFeature === featureIndex ? null : featureIndex);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
            <Header />

            <div className="px-6 py-16 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    >
                        Simple Pricing for Every Freelancer
                    </motion.h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Choose the perfect plan to manage your clients, projects, and finances.
                        No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
                        <button
                            className={`px-6 py-3 rounded-full font-medium transition-all ${billingCycle === 'monthly'
                                    ? 'bg-linear-to-r from-blue-600 to-purple-600'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly Billing
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-[1.02] ${plan.popular
                                    ? 'border-blue-500/50 relative shadow-2xl shadow-blue-500/20'
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="flex items-center gap-1 px-4 py-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium">
                                        <Star size={14} /> Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        {plan.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-3xl font-bold mb-2">
                                    ${plan.monthlyPrice}
                                </h4>
                                <p className="text-gray-300 text-sm">{plan.description}</p>
                                <p className="text-sm text-gray-400 mt-2">Best for: {plan.bestFor}</p>
                            </div>

                            <ul className="space-y-3 mb-8 grow">
                                {plan.features.slice(0, 5).map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}

                                {plan.features.length > 5 && (
                                    <button
                                        onClick={() => toggleFeatureDetail(index)}
                                        className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                                    >
                                        {expandedFeature === index ? (
                                            <>Show less <ChevronUp size={16} /></>
                                        ) : (
                                            <>+{plan.features.length - 5} more features <ChevronDown size={16} /></>
                                        )}
                                    </button>
                                )}

                                {expandedFeature === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3 pt-2"
                                    >
                                        {plan.features.slice(5).map((feature, idx) => (
                                            <li key={idx + 5} className="flex items-start gap-2">
                                                <CheckCircle className="text-green-400 shrink-0 mt-1" size={18} />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </motion.div>
                                )}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                        : plan.name === "Solo"
                                            ? 'bg-gray-700 hover:bg-gray-600'
                                            : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                            >
                                {plan.ctaText}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Features Comparison Table */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-10">Compare All Features</h3>
                    <div className="bg-gray-900/50 shadow-2xl shadow-blue-900 rounded-2xl border border-blue-800 overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left p-6 font-semibold">Features</th>
                                        {plans.map((plan, idx) => (
                                            <th key={idx} className="text-center p-6 font-semibold">
                                                <div className="flex flex-col items-center">
                                                    {plan.icon}
                                                    <span className="mt-2">{plan.name}</span>
                                                    {plan.popular && (
                                                        <span className="text-xs text-blue-400 mt-1">Most Popular</span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuresComparison.map((feature, idx) => (
                                        <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-medium">{feature.name}</td>
                                            <td className="p-4 text-center">{feature.solo}</td>
                                            <td className="p-4 text-center">{feature.freelancer}</td>
                                            <td className="p-4 text-center">{feature.professional}</td>
                                            <td className="p-4 text-center">{feature.agency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subscription;