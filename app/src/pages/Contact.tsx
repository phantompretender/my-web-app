import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Leaf, User, Mail, MessageSquare, Tag } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Velvet Rose Garden Guide. Ask me about our blooms, care tips, or placing an order.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    chatMutation.mutate({
      message: userMessage,
      history: messages,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-borderMuted shadow-card flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-borderMuted/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-rose-cream flex items-center justify-center">
          <Leaf size={16} className="text-rose-deep" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Ask Our Garden Guide</p>
          <p className="text-xs text-foreground/40">AI Virtual Receptionist</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-rose-cream text-foreground"
                  : "bg-rose-pink/60 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-rose-pink/60 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-rose-coral rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-rose-coral rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-rose-coral rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-borderMuted/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about our flowers..."
            className="flex-1 h-10 px-3 rounded-lg border border-borderMuted text-sm focus:outline-none focus:border-rose-coral transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="w-10 h-10 bg-rose-deep text-white rounded-lg flex items-center justify-center hover:bg-rose-deep/90 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent successfully");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl lg:text-5xl text-rose-deep mb-4">
            Get in Touch
          </h1>
          <p className="text-foreground/60 mb-12 max-w-xl">
            Whether you're planning a special event, seeking care advice, or simply want to say hello — we'd love to hear from you.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-1/2"
          >
            {submitted ? (
              <div className="bg-rose-cream rounded-xl p-8 text-center">
                <p className="font-serif text-2xl text-rose-deep mb-2">Thank you</p>
                <p className="text-foreground/60">Your message has been sent. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                    <User size={14} />
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-borderMuted bg-white text-sm focus:outline-none focus:border-rose-coral transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                    <Mail size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-borderMuted bg-white text-sm focus:outline-none focus:border-rose-coral transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                    <Tag size={14} />
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-borderMuted bg-white text-sm focus:outline-none focus:border-rose-coral transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-1.5">
                    <MessageSquare size={14} />
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-borderMuted bg-white text-sm focus:outline-none focus:border-rose-coral transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full h-12 bg-rose-deep text-white font-sans font-medium rounded-lg hover:bg-rose-deep/90 transition-colors disabled:opacity-50"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* AI Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <AIChat />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
