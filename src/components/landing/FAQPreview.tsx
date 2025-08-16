import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What is this investment platform about?",
    answer: "We offer a professional investment opportunity in the gold trading market through a structured, fixed-tenure program that provides monthly profit returns. Our platform is designed for investors seeking stable income without managing trades themselves.",
    type: "text"
  },
  {
    question: "How much profit can I earn each month?",
    type: "table",
    data: {
      headers: ["Investment Amount", "Monthly Profit", "Investment Tenure"],
      rows: [
        ["$50 – $500", "4% – 4.5%", "6 months"],
        ["$501 – $5,000", "4.8% – 5.2%", "6 months"],
        ["$5,001 – $50,000", "5% – 5.5%", "9 months"]
      ],
      notes: [
        "Profits are credited between the 10th–15th of each month",
        "Percentages indicate the monthly return on your investment",
        "Higher investment amounts unlock better profit rates"
      ]
    }
  },
  {
    question: "Can I withdraw my original investment anytime?",
    answer: "The original investment is locked for the selected tenure. However, early withdrawal is available with the following conditions:\n\n• 10% early exit fee on the invested amount\n\n• 30–45 business days for processing\n\n• Deductions for payment gateway and administrative services will apply",
    type: "text"
  },
  {
    question: "Is my investment safe?",
    answer: "We follow a zero-risk investment strategy. With over 17 years of trading experience, we have developed a deep understanding of market conditions, allowing us to minimize risk and protect investor capital. We do not speculate—we invest with precision and purpose.",
    type: "text"
  },
  {
    question: "How do I deposit funds?",
    answer: "Deposits can be made through:\n\n• Crypto wallets (USDT, BTC, ETH, etc.)\n\n• Secure third-party payment gateways (coming soon)\n\nEach transaction is encrypted and securely processed.",
    type: "text"
  }
];

const ProfitTable = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              {data.headers.map((header, index) => (
                <th key={index} className="p-3 text-left border border-white/10">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-3 border border-white/10">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ul className="space-y-2 text-sm text-gray-400 pl-4">
        {data.notes.map((note, index) => (
          <li key={index} className="list-disc">{note}</li>
        ))}
      </ul>
    </div>
  );
};

const FAQPreview = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg text-gray-400"
          >
            Get answers to the most common questions about our platform
          </motion.p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="glass border-white/10">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 overflow-hidden"
                    >
                      {faq.type === 'table' ? (
                        <ProfitTable data={faq.data} />
                      ) : (
                        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline" className="glass">
            <Link to="/faq">
              View All FAQs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQPreview;