
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Loader2, CreditCard, Wallet } from 'lucide-react';

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

const TransferDialog = ({ open, onOpenChange, memberId }: TransferDialogProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState(memberId || '');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bankAccount' | 'd17Card'>('bankAccount');
  const { toast } = useToast();
  const { user } = useMasroufi();

  const selectedMember = mockFamilyMembers.find(m => m.id === selectedMemberId);
  const isChildRecipient = selectedMember?.role === 'child';

  const handleTransfer = async () => {
    if (!selectedMemberId || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a member and enter a valid amount",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock transfer process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const memberName = mockFamilyMembers.find(m => m.id === selectedMemberId)?.name;
      
      toast({
        title: "Transfer Complete",
        description: `Successfully sent ${amount} TND to ${memberName} via ${paymentMethod === 'bankAccount' ? 'bank account' : 'D17 card'}`,
      });
      
      setAmount(0);
      setNote('');
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Send money to a family member
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="member">Family Member</Label>
            <Select 
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger id="member">
                <SelectValue placeholder="Select Family Member" />
              </SelectTrigger>
              <SelectContent>
                {mockFamilyMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedMemberId && (
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'bankAccount' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPaymentMethod('bankAccount')}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Bank Account
                </Button>
                {isChildRecipient && (
                  <Button
                    type="button"
                    variant={paymentMethod === 'd17Card' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('d17Card')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    D17 Card
                  </Button>
                )}
              </div>
              {isChildRecipient && paymentMethod === 'd17Card' && (
                <p className="text-xs text-muted-foreground">
                  The funds will be transferred directly to the child's D17 card.
                </p>
              )}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (TND)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="100"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              placeholder="Allowance for this week"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Transfer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
