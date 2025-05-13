
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Loader2, CreditCard, Wallet, Plus } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId?: string;
}

// Mock family members for UI demonstration
const mockFamilyMembers = [
  {
    id: "1",
    name: "Amine Ben Salah",
    email: "amine@example.com",
    role: "parent",
    avatar: null,
    allowance: 200,
    restrictions: ["games", "clothing"],
    lastTransaction: "2023-05-08"
  },
  {
    id: "2",
    name: "Yasmine Ben Salah",
    email: "yasmine@example.com",
    role: "child",
    avatar: null,
    allowance: 50,
    restrictions: ["electronics"],
    lastTransaction: "2023-05-10"
  }
];

// Schéma de validation pour le formulaire de transfert
const transferSchema = z.object({
  memberId: z.string().min(1, { message: "Veuillez sélectionner un membre de la famille" }),
  amount: z.number().min(1, { message: "Le montant doit être supérieur à 0" }),
  note: z.string().optional(),
  paymentMethod: z.enum(["bankAccount", "d17Card", "creditCard"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
});

const TransferDialog = ({ open, onOpenChange, memberId }: TransferDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const { toast } = useToast();
  const { user } = useMasroufi();

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      memberId: memberId || '',
      amount: 0,
      note: '',
      paymentMethod: 'bankAccount',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    },
  });

  useEffect(() => {
    if (memberId) {
      form.setValue('memberId', memberId);
    }
  }, [memberId, form]);

  useEffect(() => {
    const paymentMethod = form.watch('paymentMethod');
    setShowCardDetails(paymentMethod === 'creditCard');
  }, [form.watch('paymentMethod')]);

  const selectedMember = mockFamilyMembers.find(m => m.id === form.watch('memberId'));
  const isChildRecipient = selectedMember?.role === 'child';

  const handleTransfer = async (values: z.infer<typeof transferSchema>) => {
    setIsLoading(true);

    try {
      // Simuler le processus de transfert
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const memberName = mockFamilyMembers.find(m => m.id === values.memberId)?.name;
      
      let successMessage = `Transfert de ${values.amount} TND à ${memberName} `;
      
      if (values.paymentMethod === 'bankAccount') {
        successMessage += 'via votre compte bancaire';
      } else if (values.paymentMethod === 'd17Card') {
        successMessage += 'via la carte D17';
      } else if (values.paymentMethod === 'creditCard') {
        successMessage += 'via votre carte bancaire ****' + values.cardNumber?.slice(-4);
      }
      
      toast({
        title: "Transfert réussi",
        description: successMessage,
      });
      
      form.reset({
        memberId: '',
        amount: 0,
        note: '',
        paymentMethod: 'bankAccount',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Échec du transfert",
        description: "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfert d'argent</DialogTitle>
          <DialogDescription>
            Envoyez de l'argent à un membre de la famille
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTransfer)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membre de la famille</FormLabel>
                  <Select 
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un membre de la famille" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockFamilyMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch('memberId') && (
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Méthode de paiement</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === 'bankAccount' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => field.onChange('bankAccount')}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Compte bancaire
                      </Button>
                      
                      <Button
                        type="button"
                        variant={field.value === 'creditCard' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => field.onChange('creditCard')}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Carte bancaire
                      </Button>
                      
                      {isChildRecipient && (
                        <Button
                          type="button"
                          variant={field.value === 'd17Card' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => field.onChange('d17Card')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Carte D17
                        </Button>
                      )}
                    </div>
                    
                    {isChildRecipient && field.value === 'd17Card' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Les fonds seront transférés directement sur la carte D17 de l'enfant.
                      </p>
                    )}
                    
                    {field.value === 'bankAccount' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Les fonds seront débités de votre compte bancaire Masroufi.
                      </p>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {showCardDetails && (
              <div className="border p-4 rounded-lg space-y-3">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de la carte</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          maxLength={19}
                          onChange={(e) => {
                            // Format card number with spaces after every 4 digits
                            const value = e.target.value.replace(/\s/g, '');
                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'expiration</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field} 
                            maxLength={5}
                            onChange={(e) => {
                              // Format expiry date as MM/YY
                              const value = e.target.value.replace(/\//g, '');
                              if (value.length <= 2) {
                                field.onChange(value);
                              } else {
                                field.onChange(value.substring(0, 2) + '/' + value.substring(2));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardCVC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field} 
                            maxLength={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (TND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optionnelle)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Argent de poche pour cette semaine"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Transférer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
