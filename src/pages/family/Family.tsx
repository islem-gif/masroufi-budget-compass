
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Users, Send, Eye, EyeOff, Lock, ShieldCheck, DollarSign } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

// Mock transactions between family members
const mockFamilyTransactions = [
  {
    id: "1",
    from: "1",
    to: "2",
    amount: 50,
    date: "2023-05-10T14:30:00Z",
    note: "Weekly allowance",
    status: "completed"
  },
  {
    id: "2",
    from: "1",
    to: "2",
    amount: 20,
    date: "2023-05-08T10:15:00Z",
    note: "School supplies",
    status: "completed"
  },
  {
    id: "3",
    from: "2",
    to: "1",
    amount: 5,
    date: "2023-05-07T16:45:00Z",
    note: "Payback for candy",
    status: "completed"
  }
];

const Family = () => {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferNote, setTransferNote] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  
  const handleInviteMember = () => {
    if (inviteEmail) {
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
      setInviteEmail("");
      setShowInviteDialog(false);
    }
  };
  
  const handleTransfer = () => {
    if (selectedMemberId && transferAmount > 0) {
      const memberName = mockFamilyMembers.find(m => m.id === selectedMemberId)?.name;
      toast({
        title: "Transfer Complete",
        description: `Successfully sent ${transferAmount} TND to ${memberName}`,
      });
      setTransferAmount(0);
      setTransferNote("");
      setShowTransferDialog(false);
    }
  };
  
  const startTransfer = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowTransferDialog(true);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Family Finance Management</h1>
          <p className="text-muted-foreground">Manage family accounts, allowances, and transfers</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Invite Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Family Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to connect family accounts for shared financial management.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input 
                    id="email" 
                    placeholder="example@email.com" 
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Member Role</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="role-parent" name="role" defaultChecked />
                      <Label htmlFor="role-parent">Parent/Guardian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="role-child" name="role" />
                      <Label htmlFor="role-child">Child</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                <Button onClick={handleInviteMember}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" /> Transfer Money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Money</DialogTitle>
                <DialogDescription>
                  Send money to a family member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="member">Family Member</Label>
                  <select 
                    id="member"
                    className="w-full p-2 border rounded-md"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                  >
                    <option value="" disabled>Select Family Member</option>
                    {mockFamilyMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (TND)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={transferAmount || ''}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="Allowance for this week"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
                <Button onClick={handleTransfer}>Transfer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Family Members</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="parental">Parental Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFamilyMembers.map(member => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || ""} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={member.role === "parent" ? "default" : "outline"} className="capitalize">
                      {member.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Allowance:</span>
                      <span className="font-medium">{member.allowance} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Transaction:</span>
                      <span>{new Date(member.lastTransaction).toLocaleDateString()}</span>
                    </div>
                    {member.restrictions.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Restricted Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.restrictions.map(restriction => (
                            <Badge key={restriction} variant="outline" className="capitalize">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> Activity
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => startTransfer(member.id)}
                    className="flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" /> Send Money
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Family Transfers</CardTitle>
              <CardDescription>Transaction history between family members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFamilyTransactions.map(transaction => {
                  const fromMember = mockFamilyMembers.find(m => m.id === transaction.from);
                  const toMember = mockFamilyMembers.find(m => m.id === transaction.to);
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-masroufi-primary/10 flex items-center justify-center">
                          <Send className="h-5 w-5 text-masroufi-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            <span>{fromMember?.name}</span> <span className="text-muted-foreground">→</span> <span>{toMember?.name}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                          {transaction.note && (
                            <p className="text-xs italic mt-1">{transaction.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount} TND</p>
                        <Badge variant="outline" className="capitalize text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parental" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Parental Controls</CardTitle>
              <CardDescription>Manage spending limits and restrictions for child accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockFamilyMembers.filter(m => m.role === "child").map(member => (
                <div key={member.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <Badge variant="outline">Child Account</Badge>
                  </div>
                  
                  <div className="space-y-4 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Spending Limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          className="w-24" 
                          defaultValue={member.allowance}
                        />
                        <span>TND/month</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>Require Approval for Purchases</span>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        <span>Hide Transaction Details</span>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Restricted Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["games", "clothing", "electronics", "entertainment", "food", "other"].map(category => {
                        const isRestricted = member.restrictions.includes(category);
                        return (
                          <div key={category} className="flex items-center gap-2 border rounded-md px-3 py-1">
                            <Switch defaultChecked={isRestricted} />
                            <span className="capitalize">{category}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Controls</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Family;
