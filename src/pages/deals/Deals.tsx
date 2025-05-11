
import { useState } from "react";
import { useMasroufi } from "@/lib/MasroufiContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, MapPin, Search, Calendar, ExternalLink, Star, Filter } from "lucide-react";

const Deals = () => {
  const { user, deals } = useMasroufi();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const locations = Array.from(new Set(deals.map(deal => deal.location)));
  const categories = Array.from(new Set(deals.map(deal => deal.category)));
  
  const filteredDeals = deals.filter(deal => {
    let matches = true;
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      matches = matches && (
        deal.title.toLowerCase().includes(searchLower) ||
        deal.description.toLowerCase().includes(searchLower) ||
        (deal.provider?.toLowerCase() || "").includes(searchLower) ||
        (deal.merchant?.toLowerCase() || "").includes(searchLower)
      );
    }
    
    if (locationFilter !== "all") {
      matches = matches && deal.location === locationFilter;
    }
    
    if (categoryFilter !== "all") {
      matches = matches && deal.category === categoryFilter;
    }
    
    return matches;
  });

  // Group deals by category for the "By Category" tab
  const dealsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredDeals.filter(deal => deal.category === category);
    return acc;
  }, {} as Record<string, typeof deals>);
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Deals & Discounts</h1>
          <p className="text-muted-foreground">
            Special offers and discounts for your financial wellness
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-masroufi-primary/20 to-masroufi-secondary/20 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <h2 className="text-xl font-bold">Save While You Learn</h2>
            <p className="mt-2">
              Discover exclusive student discounts and offers on everything from tech to food. 
              Masroufi helps you spend wisely with curated deals just for you.
            </p>
          </div>
          <div className="flex justify-end items-center">
            <Button className="bg-masroufi-primary hover:bg-masroufi-primary/90">
              Explore All Deals
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search deals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                location && <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Category</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Deals</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.length > 0 ? (
              filteredDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No deals found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.filter(deal => deal.featured).length > 0 ? (
              filteredDeals
                .filter(deal => deal.featured)
                .map(deal => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No featured deals currently available</h3>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ending-soon" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals
              .filter(deal => {
                // Filter deals ending within the next 7 days
                const endDate = new Date(deal.validUntil || deal.expiryDate);
                const now = new Date();
                const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
                return daysLeft <= 7 && daysLeft > 0;
              })
              .map(deal => <DealCard key={deal.id} deal={deal} />)
            }
          </div>
        </TabsContent>
        
        <TabsContent value="by-category" className="mt-4 space-y-8">
          {Object.entries(dealsByCategory).map(([category, deals]) => (
            deals.length > 0 && (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                </div>
              </div>
            )
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DealCardProps {
  deal: any; // Using any type here, but would use proper type in real app
}

const DealCard = ({ deal }: DealCardProps) => {
  const endDate = new Date(deal.validUntil || deal.expiryDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 bg-cover bg-center"
        style={{ 
          backgroundImage: deal.image ? `url(${deal.image})` : 'linear-gradient(to right, #4CAF50, #2196F3)' 
        }}
      >
        {deal.featured && (
          <Badge className="m-2 bg-yellow-500">Featured</Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{deal.title}</CardTitle>
          <Badge variant={deal.discount.includes("%") ? "default" : "outline"}>
            {deal.discount}
          </Badge>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>{deal.merchant || deal.provider}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {deal.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{deal.description}</p>
        <div className="mt-3 flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {daysLeft > 0 ? (
            <span>Expires in {daysLeft} days</span>
          ) : (
            <span>Expired</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        {deal.couponCode && (
          <div className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {deal.couponCode}
          </div>
        )}
        <Button variant="outline" size="sm" className="ml-auto" asChild>
          <a href={deal.link || deal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <span>View Deal</span> <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Deals;
