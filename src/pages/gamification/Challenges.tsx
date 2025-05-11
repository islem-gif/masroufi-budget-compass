
import { useState, useEffect } from 'react';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Target, Zap, TrendingUp, Download, Star, Trophy, Gift, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample challenges for the app
const sampleChallenges = [
  {
    id: "1",
    title: "Budget Master",
    description: "Stay under your monthly budget for 3 consecutive categories",
    points: 300,
    progress: 2,
    goal: 3,
    difficulty: "medium",
    category: "budget",
    icon: "TrendingUp",
    status: "in-progress"
  },
  {
    id: "2",
    title: "Savings Champion",
    description: "Save 15% of your income this month",
    points: 500,
    progress: 12,
    goal: 15,
    difficulty: "hard",
    category: "saving",
    icon: "Target",
    status: "in-progress"
  },
  {
    id: "3",
    title: "Expense Tracker",
    description: "Record all expenses for 7 consecutive days",
    points: 200,
    progress: 7,
    goal: 7,
    difficulty: "easy",
    category: "tracking",
    icon: "Zap",
    status: "completed"
  },
  {
    id: "4",
    title: "Goal Achiever",
    description: "Create and fund a financial goal",
    points: 250,
    progress: 1,
    goal: 1,
    difficulty: "easy",
    category: "goals",
    icon: "Award",
    status: "completed"
  },
  {
    id: "5",
    title: "Debt Reducer",
    description: "Pay more than the minimum on a debt for 3 months",
    points: 450,
    progress: 0,
    goal: 3,
    difficulty: "medium",
    category: "debt",
    icon: "Download",
    status: "not-started"
  },
  {
    id: "6",
    title: "Financial Scholar",
    description: "Read 3 financial education articles",
    points: 150,
    progress: 1,
    goal: 3,
    difficulty: "easy",
    category: "education",
    icon: "Star",
    status: "in-progress"
  }
];

// Sample achievements for the gamification system
const sampleAchievements = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first financial challenge",
    badge: "🎯",
    level: "bronze",
    unlocked: true,
    date: "2023-04-15"
  },
  {
    id: "2",
    title: "Budget Wizard",
    description: "Successfully stay within budget for all categories for one month",
    badge: "🧙‍♂️",
    level: "silver",
    unlocked: true,
    date: "2023-04-28"
  },
  {
    id: "3",
    title: "Saving Star",
    description: "Save over 20% of your income in one month",
    badge: "⭐",
    level: "gold", 
    unlocked: false,
    date: null
  },
  {
    id: "4", 
    title: "Financial Guru",
    description: "Complete 10 financial challenges",
    badge: "👑",
    level: "platinum",
    unlocked: false,
    date: null
  }
];

// Sample rewards that can be redeemed with points
const sampleRewards = [
  {
    id: "1",
    title: "Premium Dashboard",
    description: "Access to advanced financial insights and analysis tools",
    cost: 500,
    category: "feature",
    available: true
  },
  {
    id: "2",
    title: "Custom Budget Categories",
    description: "Create your own fully customized budget categories",
    cost: 300,
    category: "feature",
    available: true
  },
  {
    id: "3",
    title: "10% Coffee Shop Discount",
    description: "Get 10% off at participating coffee shops",
    cost: 200,
    category: "discount",
    available: true,
    partner: "Various Coffee Shops"
  },
  {
    id: "4",
    title: "Financial Advisor Session",
    description: "30-minute session with a financial advisor",
    cost: 1000,
    category: "service",
    available: false,
    comingSoon: true
  }
];

const Challenges = () => {
  const { user } = useMasroufi();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(750);
  const [level, setLevel] = useState(2);
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [achievements, setAchievements] = useState(sampleAchievements);
  const [rewards, setRewards] = useState(sampleRewards);
  
  // Calculate the experience needed for the next level
  const nextLevelXp = level * 500;
  const currentXp = userPoints % nextLevelXp;
  const xpProgress = (currentXp / nextLevelXp) * 100;
  
  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.status !== "completed") {
      // Update challenge status
      setChallenges(
        challenges.map(c => 
          c.id === challengeId ? { ...c, status: "completed", progress: c.goal } : c
        )
      );
      
      // Add points
      setUserPoints(userPoints + challenge.points);
      
      // Show toast notification
      toast({
        title: "Challenge Completed! 🎉",
        description: `You earned ${challenge.points} points for completing "${challenge.title}"`,
      });
    }
  };
  
  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      if (reward.cost <= userPoints) {
        // Deduct points
        setUserPoints(userPoints - reward.cost);
        
        // Update reward status (in a real app, we would track redeemed rewards)
        setRewards(
          rewards.map(r => 
            r.id === rewardId ? { ...r, available: false, redeemed: true } : r
          )
        );
        
        // Show toast notification
        toast({
          title: "Reward Redeemed!",
          description: `You've successfully redeemed "${reward.title}"`,
        });
      } else {
        toast({
          title: "Not Enough Points",
          description: `You need ${reward.cost - userPoints} more points to redeem this reward`,
          variant: "destructive"
        });
      }
    }
  };
  
  useEffect(() => {
    // Check for level up
    const newLevel = Math.floor(userPoints / 500) + 1;
    if (newLevel > level) {
      toast({
        title: "Level Up! 🎊",
        description: `You've reached level ${newLevel}!`,
      });
      setLevel(newLevel);
    }
  }, [userPoints, level]);

  // Get the appropriate icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "TrendingUp": return TrendingUp;
      case "Target": return Target;
      case "Zap": return Zap;
      case "Award": return Award;
      case "Download": return Download;
      case "Star": return Star;
      default: return Trophy;
    }
  };

  // Helper function to determine badge background color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };
  
  // Helper function to determine achievement badge color
  const getAchievementColor = (level: string) => {
    switch (level) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-gray-400";
      case "gold": return "bg-yellow-400";
      case "platinum": return "bg-indigo-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Savings Challenges</h1>
          <p className="text-muted-foreground">
            Complete challenges to earn points and rewards
          </p>
        </div>
      </div>
      
      {/* User Progress */}
      <Card className="bg-gradient-to-r from-masroufi-primary/20 to-masroufi-secondary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-masroufi-primary/20 border-2 border-masroufi-primary">
                <span className="text-2xl font-bold">{level}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium">
                  {user?.firstName} {user?.lastName}
                </h3>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{userPoints} points</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm mb-1">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
              <p className="text-xs text-center mt-1">
                {currentXp} / {nextLevelXp} XP to next level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => {
              const IconComponent = getIconComponent(challenge.icon);
              const progress = (challenge.progress / challenge.goal) * 100;
              const isCompleted = challenge.status === "completed";
              
              return (
                <Card key={challenge.id} className={isCompleted ? "border-green-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-masroufi-primary" />
                        {challenge.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {challenge.progress}/{challenge.goal}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{challenge.points} pts</span>
                    </div>
                    {!isCompleted && (
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteChallenge(challenge.id)}
                        disabled={challenge.status === "not-started"}
                      >
                        {challenge.status === "not-started" ? "Start" : "Complete"}
                      </Button>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isLocked = !achievement.unlocked;
              
              return (
                <Card key={achievement.id} className={isLocked ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-full 
                            ${isLocked ? "bg-gray-200" : getAchievementColor(achievement.level)}`}
                        >
                          {isLocked ? <Lock className="h-4 w-4" /> : <span>{achievement.badge}</span>}
                        </div>
                        {achievement.title}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {achievement.level}
                      </Badge>
                    </div>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t pt-3 justify-between">
                    {achievement.unlocked ? (
                      <span className="text-sm text-muted-foreground">
                        Unlocked on {new Date(achievement.date!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Lock className="h-3 w-3 mr-1" /> Locked
                      </span>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const canRedeem = userPoints >= reward.cost && reward.available;
              
              return (
                <Card key={reward.id} className={!reward.available ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{reward.cost}</span>
                      </div>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                    {reward.partner && (
                      <Badge variant="outline" className="mt-2">
                        Partner: {reward.partner}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Badge variant="outline" className="capitalize">
                      {reward.category}
                    </Badge>
                    
                    {reward.comingSoon ? (
                      <Badge variant="outline">Coming Soon</Badge>
                    ) : (
                      <Button 
                        size="sm"
                        disabled={!canRedeem}
                        onClick={() => handleRedeemReward(reward.id)}
                      >
                        {canRedeem ? "Redeem" : userPoints < reward.cost ? "Not Enough Points" : "Redeemed"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
