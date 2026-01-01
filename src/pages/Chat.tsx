import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  MoreVertical,
  Image,
  Paperclip,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "prestador";
  time: string;
  read: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o João, vou realizar a manutenção do seu box amanhã às 14h. Está confirmado?",
      sender: "prestador",
      time: "10:30",
      read: true,
    },
    {
      id: "2",
      text: "Oi João! Sim, está confirmado. Estarei em casa.",
      sender: "user",
      time: "10:32",
      read: true,
    },
    {
      id: "3",
      text: "Perfeito! Preciso de acesso ao banheiro e uma tomada próxima. Pode providenciar?",
      sender: "prestador",
      time: "10:33",
      read: true,
    },
    {
      id: "4",
      text: "Claro, sem problemas! Tem tomada do lado do box mesmo.",
      sender: "user",
      time: "10:35",
      read: true,
    },
    {
      id: "5",
      text: "Ótimo! Então nos vemos amanhã. Qualquer dúvida é só chamar! 👍",
      sender: "prestador",
      time: "10:36",
      read: true,
    },
  ]);

  const prestador = {
    name: "João Souza",
    status: "online",
    avatar: null,
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simula resposta do prestador
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Recebi sua mensagem! Vou verificar e já te respondo.",
        sender: "prestador",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="mobile-container min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {prestador.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate">
                {prestador.name}
              </h1>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full" />
                Online
              </p>
            </div>
          </div>

          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Phone className="w-5 h-5 text-primary" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {/* Data */}
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
            Hoje
          </span>
        </div>

        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-white text-foreground rounded-bl-md shadow-sm"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div
                className={`flex items-center justify-end gap-1 mt-1 ${
                  message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                <span className="text-[10px]">{message.time}</span>
                {message.sender === "user" && (
                  message.read ? (
                    <CheckCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Image className="w-5 h-5 text-muted-foreground" />
          </button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!newMessage.trim()}
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
