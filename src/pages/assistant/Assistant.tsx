
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMasroufi } from '@/lib/MasroufiContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour! Je suis votre assistant financier Masroufi. Comment puis-je vous aider aujourd'hui?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, transactions, categories, budgets } = useMasroufi();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    // Generate context about the user's financial situation
    const userContext = generateUserContext();

    try {
      const { data, error } = await supabase.functions.invoke('finance-assistant', {
        body: { prompt: prompt.trim(), userContext },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.",
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        variant: 'destructive',
        title: "Erreur de l'assistant",
        description: "Impossible de communiquer avec l'assistant. Veuillez réessayer plus tard.",
      });

      // Add fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Je suis désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const generateUserContext = () => {
    if (!user) return "";

    // Calculate total expenses and incomes
    const expenseTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const incomeTotal = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get top expense categories
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          expensesByCategory[category.name] = (expensesByCategory[category.name] || 0) + t.amount;
        }
      });

    // Format to sorted array of [category, amount]
    const topExpenses = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Get budget status
    const budgetStatus = budgets.map(b => {
      const category = categories.find(c => c.id === b.categoryId);
      return {
        category: category?.name || 'Unknown',
        spent: b.spent,
        limit: b.amount,
        percentage: Math.round((b.spent / b.amount) * 100)
      };
    });

    // Compile context
    return `
      User: ${user.firstName} ${user.lastName}
      Currency: ${user.currency}
      Total Monthly Expenses: ${expenseTotal} ${user.currency}
      Total Monthly Income: ${incomeTotal} ${user.currency}
      Balance: ${incomeTotal - expenseTotal} ${user.currency}
      Top Expense Categories: ${topExpenses.map(([cat, amount]) => `${cat}: ${amount} ${user.currency}`).join(', ')}
      Budget Status: ${budgetStatus.map(b => `${b.category}: ${b.spent}/${b.limit} (${b.percentage}%)`).join(', ')}
    `;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSampleQuestions = () => [
    "Comment puis-je économiser 50€ ce mois-ci ?",
    "Pourquoi mes dépenses en alimentation sont si élevées ?",
    "Comment optimiser mon budget pour les 3 prochains mois ?",
    "Quelles sont mes catégories de dépenses les plus importantes ?",
    "Comment éviter les frais bancaires inutiles ?"
  ];

  const handleSampleQuestion = (question: string) => {
    setPrompt(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Assistant Financier</h1>
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Assistant Masroufi
          </CardTitle>
          <CardDescription>
            Posez des questions sur vos finances pour obtenir des conseils personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-7rem)]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'assistant' ? '' : 'flex-row-reverse'
                  }`}
                >
                  <Avatar className="mt-0.5">
                    {message.sender === 'assistant' ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.sender === 'assistant'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground ml-auto'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'assistant'
                          ? 'text-secondary-foreground/70'
                          : 'text-primary-foreground/70'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {messages.length === 1 && (
            <div className="my-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" /> Questions suggérées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getSampleQuestions().map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 text-left"
                    onClick={() => handleSampleQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Posez votre question ici..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!prompt.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Assistant;
