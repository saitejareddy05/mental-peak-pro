import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, BarChart3, User, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ScoreEntry {
  date: string;
  phq9: number;
  gad7: number;
  overallRisk: 'low' | 'medium' | 'high';
  notes?: string;
}

interface User {
  id: string;
  name: string;
  role: 'student' | 'counselor' | 'admin' | 'volunteer';
}

interface ScoreDashboardProps {
  user: User;
}

// Mock data for demonstration
const generateMockData = (): ScoreEntry[] => {
  const data: ScoreEntry[] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7)); // Weekly data points
    
    const phq9 = Math.floor(Math.random() * 27); // 0-27 range
    const gad7 = Math.floor(Math.random() * 21); // 0-21 range
    
    let overallRisk: 'low' | 'medium' | 'high' = 'low';
    if (phq9 >= 15 || gad7 >= 15) overallRisk = 'high';
    else if (phq9 >= 10 || gad7 >= 10) overallRisk = 'medium';
    
    data.push({
      date: date.toISOString().split('T')[0],
      phq9,
      gad7,
      overallRisk,
      notes: i % 3 === 0 ? 'Regular check-in' : undefined
    });
  }
  
  return data;
};

// Admin aggregate data
const generateAggregateData = () => {
  return {
    totalUsers: 1247,
    activeThisWeek: 892,
    riskDistribution: [
      { name: 'Low Risk', value: 65, color: '#22c55e' },
      { name: 'Medium Risk', value: 25, color: '#eab308' },
      { name: 'High Risk', value: 10, color: '#ef4444' }
    ],
    weeklyTrends: Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      averagePhq9: 8 + Math.random() * 6,
      averageGad7: 7 + Math.random() * 5,
      totalScreenings: 50 + Math.floor(Math.random() * 100)
    }))
  };
};

export const ScoreDashboard = ({ user }: ScoreDashboardProps) => {
  const [personalData, setPersonalData] = useState<ScoreEntry[]>([]);
  const [aggregateData, setAggregateData] = useState(generateAggregateData());
  
  useEffect(() => {
    // Load or generate mock data
    const stored = localStorage.getItem(`scores_${user.id}`);
    if (stored) {
      setPersonalData(JSON.parse(stored));
    } else {
      const mockData = generateMockData();
      setPersonalData(mockData);
      localStorage.setItem(`scores_${user.id}`, JSON.stringify(mockData));
    }
  }, [user.id]);

  const getCurrentRisk = () => {
    if (personalData.length === 0) return 'low';
    return personalData[personalData.length - 1].overallRisk;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-yellow-50';
      default: return 'bg-green-500 text-green-50';
    }
  };

  const getTrend = (data: ScoreEntry[], field: 'phq9' | 'gad7') => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3).map(d => d[field]);
    const earlier = data.slice(-6, -3).map(d => d[field]);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const diff = recentAvg - earlierAvg;
    if (diff > 2) return 'increasing';
    if (diff < -2) return 'decreasing';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-600" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isAdmin ? 'Analytics Dashboard' : 'Your Wellness Journey'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Institution-wide mental health insights' : 'Track your mental health progress over time'}
          </p>
        </div>
        <Badge className={getRiskBadgeColor(getCurrentRisk())}>
          {getCurrentRisk().toUpperCase()} RISK
        </Badge>
      </div>

      {isAdmin ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aggregateData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aggregateData.activeThisWeek}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((aggregateData.activeThisWeek / aggregateData.totalUsers) * 100)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {aggregateData.riskDistribution.find(r => r.name === 'High Risk')?.value}%
                  </div>
                  <p className="text-xs text-muted-foreground">Requiring attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Weekly Screenings</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(aggregateData.weeklyTrends.reduce((sum, w) => sum + w.totalScreenings, 0) / aggregateData.weeklyTrends.length)}
                  </div>
                  <p className="text-xs text-muted-foreground">Per week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={aggregateData.riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {aggregateData.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Screening Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={aggregateData.weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalScreenings" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={aggregateData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="averagePhq9" stroke="#ef4444" name="Avg PHQ-9" strokeWidth={2} />
                    <Line type="monotone" dataKey="averageGad7" stroke="#f59e0b" name="Avg GAD-7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest PHQ-9 Score</CardTitle>
                  {getTrendIcon(getTrend(personalData, 'phq9'))}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getRiskColor(getCurrentRisk())}`}>
                    {personalData.length > 0 ? personalData[personalData.length - 1].phq9 : 0}/27
                  </div>
                  <p className="text-xs text-muted-foreground">Depression screening</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest GAD-7 Score</CardTitle>
                  {getTrendIcon(getTrend(personalData, 'gad7'))}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getRiskColor(getCurrentRisk())}`}>
                    {personalData.length > 0 ? personalData[personalData.length - 1].gad7 : 0}/21
                  </div>
                  <p className="text-xs text-muted-foreground">Anxiety screening</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personalData.length}</div>
                  <p className="text-xs text-muted-foreground">Screenings completed</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={personalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, name === 'phq9' ? 'PHQ-9' : 'GAD-7']}
                    />
                    <Line type="monotone" dataKey="phq9" stroke="#ef4444" name="PHQ-9" strokeWidth={2} />
                    <Line type="monotone" dataKey="gad7" stroke="#f59e0b" name="GAD-7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getTrend(personalData, 'phq9') === 'decreasing' && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <TrendingDown className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Positive Progress</h4>
                        <p className="text-sm text-green-700">Your depression scores have been improving recently. Keep up the great work!</p>
                      </div>
                    </div>
                  )}
                  
                  {getTrend(personalData, 'gad7') === 'increasing' && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Attention Needed</h4>
                        <p className="text-sm text-yellow-700">Your anxiety levels have been rising. Consider reaching out to a counselor.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Regular Check-ins</h4>
                      <p className="text-sm text-blue-700">You've completed {personalData.length} screenings. Consistent monitoring helps track your wellness journey.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};