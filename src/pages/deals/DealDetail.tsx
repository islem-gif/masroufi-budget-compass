
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Calendar, MapPin, Share, ExternalLink, User, Wallet } from 'lucide-react';

const DealDetail = () => {
  const { id } = useParams();
  const { deals } = useMasroufi();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const deal = deals.find(d => d.id === id);
  
  useEffect(() => {
    // Generate QR code using a placeholder service
    // In a real app, this would be handled server-side
    if (deal?.couponCode) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deal.couponCode)}`;
      setQrCode(qrCodeUrl);
    }
  }, [deal]);
  
  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">Deal not found</h2>
        <p className="text-muted-foreground mb-6">The deal you're looking for doesn't exist or has expired.</p>
        <Button onClick={() => navigate('/deals')}>Back to deals</Button>
      </div>
    );
  }
  
  const endDate = new Date(deal.validUntil || deal.expiryDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isExpired = daysLeft <= 0;
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/deals')}
      >
        Back to deals
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div 
            className="h-60 bg-cover bg-center"
            style={{ 
              backgroundImage: deal.image ? `url(${deal.image})` : 'linear-gradient(to right, #4CAF50, #2196F3)' 
            }}
          >
            {deal.featured && (
              <Badge className="m-2 bg-yellow-500">Featured</Badge>
            )}
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{deal.title}</CardTitle>
              <Badge variant={deal.discount.includes("%") ? "default" : "outline"} className="text-lg px-3 py-1">
                {deal.discount}
              </Badge>
            </div>
            <CardDescription className="flex items-center justify-between">
              <span className="font-medium text-base">{deal.merchant || deal.provider}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {deal.location}
              </span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{deal.description}</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-b py-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {isExpired ? (
                    <span className="text-red-500">Expired</span>
                  ) : (
                    `Valid until ${endDate.toLocaleDateString()}`
                  )}
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>This offer cannot be combined with other promotions.</li>
                <li>Valid for students with valid ID only.</li>
                <li>Limited to one redemption per person.</li>
                <li>The merchant reserves the right to modify or cancel the promotion.</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={deal.link || deal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Visit website <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            {!isExpired && (
              <Button>Redeem Now</Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Discount Code</CardTitle>
            <CardDescription>
              Use this coupon code or show the QR code at checkout
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {deal.couponCode && (
              <>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-center">
                  <p className="font-mono text-lg font-bold">{deal.couponCode}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  {qrCode ? (
                    <div className="p-4 bg-white rounded-md">
                      <img src={qrCode} alt="QR Code" width={200} height={200} />
                    </div>
                  ) : (
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-[200px] h-[200px] rounded-md"></div>
                  )}
                  <p className="text-sm text-center mt-2 text-muted-foreground">Scan this QR code to redeem</p>
                </div>
              </>
            )}
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">How to redeem</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Show this screen to the cashier</li>
                <li>Let them scan the QR code or enter the coupon code</li>
                <li>Verify the discount has been applied before paying</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-4">
            <div className="flex items-center gap-2 text-sm w-full">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Available for student accounts</span>
            </div>
            <div className="flex items-center gap-2 text-sm w-full">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>Average savings: {deal.discount}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DealDetail;
