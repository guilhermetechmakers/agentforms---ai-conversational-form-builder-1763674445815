import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, MessageSquare, BarChart3 } from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents..." className="pl-8" />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Agent
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent List */}
      <h2 className="text-xl font-semibold mt-8">Your Agents</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <BotIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="inline-flex items-center rounded-full border border-transparent bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Active
                </span>
              </div>
              <CardTitle className="mt-4">Customer Support Agent {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Handles general inquiries and support tickets for the main product line.
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>234 sessions</span>
                <span>Updated 2d ago</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function BotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}
