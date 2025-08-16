import { motion } from "framer-motion";
import { ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const faqCategories = [
  {
    category: "Platform Overview",
    faqs: [
      {
        question: "What is this investment platform about?",
        answer: "We offer a professional investment opportunity in the gold trading market through a structured, fixed-tenure program that provides monthly profit returns. Our platform is designed for investors seeking stable income without managing trades themselves."
      },
      {
        question: "What makes this platform unique?",
        answer: "We follow a 0 (zero) risk-taking strategy based on decades of insight. Gold is the future of currencies. As global fiat currencies decline in real value, gold continues to rise. It's not just an investment—it's your shield against currency collapse."
      }
    ]
  },
  {
    category: "Investment Plans",
    faqs: [
      {
        question: "How much profit can I earn each month?",
        answer: (
          <div className="space-y-4">
            <p>Profit depends on your selected investment plan:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="p-3 text-left border border-border">Investment Amount</th>
                    <th className="p-3 text-left border border-border">Monthly Profit</th>
                    <th className="p-3 text-left border border-border">Investment Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-border">$50 – $500</td>
                    <td className="p-3 border border-border">4% – 4.5%</td>
                    <td className="p-3 border border-border">6 months</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="p-3 border border-border">$501 – $5,000</td>
                    <td className="p-3 border border-border">4.8% – 5.2%</td>
                    <td className="p-3 border border-border">6 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-border">$5,001 – $50,000</td>
                    <td className="p-3 border border-border">5% – 5.5%</td>
                    <td className="p-3 border border-border">9 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Profit is credited to your account between the 10th–15th of each month.</p>
          </div>
        )
      },
      {
        question: "Is there any risk involved?",
        answer: "No. We apply a zero-risk trading model, developed through 17 years of real market experience. Our approach focuses on safety, growth, and financial consistency."
      },
      {
        question: "How is investor protection ensured?",
        answer: "We are in the process of partnering with financial auditors, payment security providers, and investor verification services to enhance your confidence. Your satisfaction and peace of mind are our highest priorities."
      }
    ]
  },
  {
    category: "Deposits & Withdrawals",
    faqs: [
      {
        question: "How do I deposit funds?",
        answer: "Deposits can be made through:\n\n• Crypto wallets (USDT, BTC, ETH, etc.)\n\n• Secure third-party payment gateways (coming soon)\n\nEach transaction is encrypted and securely processed."
      },
      {
        question: "Can I withdraw my original investment anytime?",
        answer: "The original investment is locked for the selected tenure. However, early withdrawal is available with the following conditions:\n\n• 10% early exit fee on the invested amount\n\n• 30–45 business days for processing\n\n• Deductions for payment gateway and administrative services will apply"
      },
      {
        question: "When and how can I withdraw profits?",
        answer: "Your profit is automatically added to your account balance between the 10th–15th of each month.\n\nYou can withdraw your monthly profits anytime after they appear in your account, using your preferred withdrawal method (e.g., crypto wallets, or others as configured)."
      },
      {
        question: "Will I receive confirmation of my investment?",
        answer: "Yes. As soon as your deposit is received, your investment balance is automatically updated in your account dashboard. No manual confirmation is needed.\n\nInside your dashboard, you can view:\n\n• Your total invested amount\n\n• Active plan & profit rate\n\n• Monthly profit credited\n\n• Withdrawal history"
      }
    ]
  },
  {
    category: "Referral Program",
    faqs: [
      {
        question: "Do you offer a referral program?",
        answer: "Yes! We offer a generous multi-level referral program that rewards users for inviting others to invest on the platform."
      },
      {
        question: "How much can I earn from referrals?",
        answer: "You will earn a 2% referral bonus from every direct deposit made by your referred users.\n\nFor example:\n\nIf you refer 10 people who each deposit $1,000, you will earn $200 (2% of $10,000).\n\nThere is no limit on how many people you can refer or how much you can earn!"
      },
      {
        question: "How and when can I withdraw referral earnings?",
        answer: "Referral bonuses are added to your account automatically after your referral completes a successful deposit.\n\nYou can withdraw referral earnings:\n\n• Once your referral bonus balance reaches $30\n\n• By submitting a withdrawal request\n\n• After verification by our payment department, your bonus will be sent directly to your crypto wallet\n\nProcessing time follows the same schedule and conditions as regular withdrawals."
      },
      {
        question: "Is there a second-level referral bonus (chain system)?",
        answer: "Yes! We also reward you with a 0.5% bonus from deposits made by your second-level referrals — that is, users invited by your referrals.\n\nThis means:\n\n• You earn 2% from your direct referrals\n\n• Plus 0.5% from their referrals (your second-level)\n\nIt's a powerful way to build passive income by growing your network."
      }
    ]
  },
  {
    category: "Support & Assistance",
    faqs: [
      {
        question: "How can I contact support?",
        answer: "Our support team is available 7 days a week to assist with any questions or concerns.\n\nYou can contact us via:\n\n• WhatsApp (for fast responses)\n\n• Email (replies within 24 hours)\n\n• Live Chat (coming soon)\n\nSupport contact details are available on our Contact Us page and inside your account dashboard."
      },
      {
        question: "What kind of help can I get from support?",
        answer: "We're here to assist you with:\n\n• Deposit and withdrawal inquiries\n\n• Account or login issues\n\n• Referral bonus updates\n\n• Plan-related questions\n\n• Verification and technical assistance\n\nYour satisfaction is our priority."
      },
      {
        question: "Do you support all countries and languages?",
        answer: "✅ Yes! We welcome investors from all countries without restriction.\n🌐 Our support team can communicate in any language using real-time translation tools, so you will always receive clear and helpful responses."
      }
    ]
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Header */}
      <div className="container px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to all your questions about our gold investment platform
          </p>
        </motion.div>
      </div>

      {/* FAQ Content */}
      <div className="container px-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const key = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <Card key={faqIndex} className="glass border-border">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                        >
                          <h3 className="text-lg font-semibold pr-4 text-foreground">
                            {faq.question}
                          </h3>
                          <ChevronDown
                            className={`w-5 h-5 flex-shrink-0 transition-transform text-muted-foreground ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="text-muted-foreground leading-relaxed">
                              {typeof faq.answer === 'string' ? (
                                <p className="whitespace-pre-line">{faq.answer}</p>
                              ) : (
                                faq.answer
                              )}
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <Card className="glass border-border">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you 7 days a week. Get in touch with us through email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                
                <Button variant="outline" className="glass border-border">
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;