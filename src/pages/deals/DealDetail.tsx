
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Calendar, MapPin, Share, ExternalLink, User, Wallet } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const DealDetail = () => {
  const { id } = useParams();
  const { deals } = useMasroufi();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  
  const deal = deals.find(d => d.id === id);
  
  useEffect(() => {
    const generateQrCode = async () => {
      if (deal?.couponCode) {
        setQrLoading(true);
        try {
          // Générer le code QR en utilisant un service fiable avec HTTPS
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deal.couponCode)}&format=png`;
          
          // Vérifier si l'URL est accessible
          const response = await fetch(qrCodeUrl, { method: 'HEAD' });
          if (response.ok) {
            setQrCode(qrCodeUrl);
          } else {
            throw new Error("Impossible de générer le code QR");
          }
        } catch (error) {
          console.error("Erreur lors de la génération du code QR:", error);
          setQrCode(null);
        } finally {
          setQrLoading(false);
        }
      } else {
        setQrCode(null);
        setQrLoading(false);
      }
    };
    
    generateQrCode();
  }, [deal]);
  
  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">Offre non trouvée</h2>
        <p className="text-muted-foreground mb-6">L'offre que vous recherchez n'existe pas ou a expiré.</p>
        <Button onClick={() => navigate('/deals')}>Retour aux offres</Button>
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
        Retour aux offres
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
              <Badge className="m-2 bg-yellow-500">En vedette</Badge>
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
                    <span className="text-red-500">Expiré</span>
                  ) : (
                    `Valable jusqu'au ${endDate.toLocaleDateString()}`
                  )}
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share className="h-4 w-4" />
                <span>Partager</span>
              </Button>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Conditions générales</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Cette offre ne peut pas être combinée avec d'autres promotions.</li>
                <li>Valable uniquement pour les étudiants avec une carte d'identité valide.</li>
                <li>Limité à un usage par personne.</li>
                <li>Le marchand se réserve le droit de modifier ou d'annuler la promotion.</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={deal.link || deal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Visiter le site <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            {!isExpired && (
              <Button>Utiliser maintenant</Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Code de réduction</CardTitle>
            <CardDescription>
              Utilisez ce code promo ou présentez le QR code à la caisse
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {deal.couponCode && (
              <>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-center">
                  <p className="font-mono text-lg font-bold">{deal.couponCode}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  {qrLoading ? (
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-[200px] h-[200px] rounded-md"></div>
                  ) : qrCode ? (
                    <div className="p-4 bg-white rounded-md">
                      <AspectRatio ratio={1} className="w-[200px] h-[200px] relative">
                        <img 
                          src={qrCode} 
                          alt="Code QR" 
                          className="w-full h-full object-contain rounded-md"
                          onError={() => {
                            console.error("Erreur lors du chargement de l'image QR");
                            setQrCode(null);
                          }}
                        />
                      </AspectRatio>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md text-center w-[200px] h-[200px] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Impossible de générer le code QR</p>
                    </div>
                  )}
                  <p className="text-sm text-center mt-2 text-muted-foreground">Scannez ce QR code pour utiliser l'offre</p>
                </div>
              </>
            )}
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Comment utiliser</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Présentez cet écran au caissier</li>
                <li>Laissez-les scanner le code QR ou entrer le code de réduction</li>
                <li>Vérifiez que la remise a été appliquée avant de payer</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-4">
            <div className="flex items-center gap-2 text-sm w-full">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Disponible pour les comptes étudiants</span>
            </div>
            <div className="flex items-center gap-2 text-sm w-full">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>Économie moyenne: {deal.discount}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DealDetail;
