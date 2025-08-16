import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  text: string;
  isBot: boolean;
  isLoading?: boolean;
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your crypto investment assistant. How can I help you today?",
      isBot: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_KEY = "AIzaSyB919Gn6FrOpRVk0vGKsiJ4bQY1RtC178c";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to detect if question is related to our platform
  const isPlatformQuestion = (question: string) => {
    const platformKeywords = [
      'investment', 'plan', 'profit', 'withdraw', 'deposit', 
      'referral', 'bonus', 'platform', 'gold', 'crypto',
      'tenure', 'monthly', 'earn', 'safe', 'risk', 'support'
    ];
    return platformKeywords.some(keyword => 
      question.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const generateResponse = async (userMessage: string) => {
    try {
      const loadingMessageId = messages.length + 2;
      setMessages(prev => [
        ...prev,
        {
          id: loadingMessageId,
          text: "",
          isBot: true,
          isLoading: true
        }
      ]);

      let prompt;
      
      if (isPlatformQuestion(userMessage)) {
        // For platform-related questions, use the FAQ context
        prompt = `
        You are a customer support assistant for a gold investment platform.
        The user has asked a question about our platform. Please provide a specific
        answer based EXCLUSIVELY on the following FAQ information. Do not use any
        external knowledge. If the question isn't covered in the FAQ, say:
        "I don't have that specific information, but our support team can help. Please contact us via WhatsApp or email."

        FAQ CONTENT:
        ${JSON.stringify(faqContent)}

        USER QUESTION: "${userMessage}"

        Respond in a friendly, professional tone with 1-3 sentences maximum.
        `;
      } else {
        // For general questions, use Gemini's general knowledge
        prompt = `
        You are a helpful AI assistant. The user has asked a general question.
        Please provide a helpful answer in 1-3 sentences. Be friendly and concise.

        USER QUESTION: "${userMessage}"
        `;
      }

     const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }),
  }
);


      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm sorry, I couldn't process your request. Please try again later.";

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessageId),
        {
          id: loadingMessageId,
          text: botResponse,
          isBot: true
        }
      ]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== messages.length + 2),
        {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting to the knowledge base. Please try again later.",
          isBot: true
        }
      ]);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    generateResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // FAQ content
  const faqContent = [
    {
      question: "What is this investment platform about?",
      answer: "We offer a professional investment opportunity in the gold trading market through a structured, fixed-tenure program that provides monthly profit returns. Our platform is designed for investors seeking stable income without managing trades themselves."
    },
    {
      question: "How much profit can I earn each month?",
      answer: "Profit depends on your selected investment plan:\n\n• $50 – $500: 4% – 4.5% monthly (6 months)\n• $501 – $5,000: 4.8% – 5.2% monthly (6 months)\n• $5,001 – $50,000: 5% – 5.5% monthly (9 months)\n\nProfit is credited between the 10th–15th of each month."
    },
    {
      question: "Can I withdraw my original investment anytime?",
      answer: "The original investment is locked for the selected tenure. Early withdrawal is available with:\n\n• 10% early exit fee\n• 30–45 business days processing\n• Payment gateway deductions apply"
    },
    {
      question: "Is my investment safe?",
      answer: "We follow a zero-risk investment strategy with 17 years of trading experience. We minimize risk and protect investor capital through precise, non-speculative investments."
    },
    {
      question: "How do I deposit funds?",
      answer: "Deposits can be made through:\n\n• Crypto wallets (USDT, BTC, ETH)\n• Secure payment gateways (coming soon)\nAll transactions are encrypted and secure."
    },
    {
      question: "When and how can I withdraw profits?",
      answer: "Monthly profits are automatically added to your account between the 10th–15th. You can withdraw profits anytime after they appear using your preferred withdrawal method."
    },
    {
      question: "Is there any risk involved?",
      answer: "No. We use a zero-risk trading model developed through 17 years of real market experience, focusing on safety and consistent growth."
    },
    {
      question: "Will I receive confirmation of my investment?",
      answer: "Yes. Your dashboard updates automatically when we receive your deposit. You can view:\n\n• Total invested amount\n• Active plan & profit rate\n• Monthly profits\n• Withdrawal history"
    },
    {
      question: "How is investor protection ensured?",
      answer: "We're partnering with financial auditors and security providers to enhance confidence. Your satisfaction is our top priority."
    },
    {
      question: "What makes this platform unique?",
      answer: "Our zero-risk strategy and decades of gold market insight make us unique. Gold is a shield against currency decline - not just an investment."
    },
    {
      question: "Do you offer a referral program?",
      answer: "Yes! We have a generous multi-level referral program that rewards you for inviting others."
    },
    {
      question: "How much can I earn from referrals?",
      answer: "Earn 2% from direct referrals' deposits. Example: Refer 10 people who each deposit $1,000 → you earn $200. No limits on earnings!"
    },
    {
      question: "How and when can I withdraw referral earnings?",
      answer: "Referral bonuses are added automatically after successful deposits. Withdraw when:\n\n• Your balance reaches $30\n• After submitting a request\n• Following payment verification\nProcessing time matches regular withdrawals."
    },
    {
      question: "Is there a second-level referral bonus?",
      answer: "Yes! Earn 0.5% from your referrals' referrals (second-level). This means 2% from direct referrals plus 0.5% from their network."
    },
    {
      question: "How can I contact support?",
      answer: "Our support is available 7 days a week via:\n\n• WhatsApp (fastest)\n• Email (24hr response)\n• Live Chat (coming soon)\n\nContact details are in your dashboard."
    },
    {
      question: "What kind of help can I get from support?",
      answer: "We assist with:\n\n• Deposits/withdrawals\n• Account issues\n• Referral bonuses\n• Plan questions\n• Verification help"
    },
    {
      question: "Do you support all countries and languages?",
      answer: "✅ Yes! We welcome global investors without restrictions.\n🌐 Support communicates in any language using translation tools."
    }
  ];

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
      >
        <Button
          onClick={toggleChat}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full button-gradient shadow-lg hover:shadow-xl transition-shadow"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 w-72 sm:w-80 z-40 max-w-[calc(100vw-2rem)]"
          >
            <Card className="glass border-white/20 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="truncate">Gold Assistant</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-auto animate-pulse flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="h-56 sm:h-64 overflow-y-auto space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-primary/20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[75%] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                          message.isBot
                            ? 'bg-white/10 text-gray-200'
                            : 'bg-primary text-white'
                        }`}
                      >
                        {message.isLoading ? (
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="button-gradient px-2 sm:px-3"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                <div className="text-[10px] sm:text-xs text-gray-500 text-center">
                  Powered by Gemini AI • Available 24/7
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;