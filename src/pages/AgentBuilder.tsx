import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Save, Play, MessageSquare, Upload } from "lucide-react";

export default function AgentBuilder() {
  const [activeTab, setActiveTab] = useState("schema");

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Untitled Agent</h1>
            <p className="text-sm text-muted-foreground">Draft - Last saved just now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="gap-2 bg-green-500 hover:bg-green-600 text-white border-none">
            <Play className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border bg-card shadow-sm overflow-hidden">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="p-2 border-b bg-muted/30">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start bg-background border">
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                  <TabsTrigger value="persona">Persona</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="visuals">Visuals</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="flex-1 p-6">
                {activeTab === "schema" && <SchemaEditor />}
                {activeTab === "persona" && <PersonaEditor />}
                {activeTab === "knowledge" && <KnowledgeEditor />}
                {activeTab === "visuals" && <VisualsEditor />}
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={40} minSize={30}>
           <div className="h-full flex flex-col bg-muted/10">
              <div className="p-3 border-b flex items-center gap-2 bg-card">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Live Preview</span>
              </div>
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-muted-foreground">
                 <div className="max-w-sm w-full bg-background border rounded-lg shadow-lg h-[600px] flex flex-col">
                    {/* Mock Chat UI */}
                    <div className="p-4 border-b flex items-center gap-3 bg-primary">
                        <div className="h-8 w-8 bg-white/20 rounded-full" />
                        <div className="text-primary-foreground font-medium">Agent Preview</div>
                    </div>
                    <div className="flex-1 p-4 space-y-4 bg-secondary/5">
                        <div className="flex gap-3">
                            <div className="h-8 w-8 bg-primary/20 rounded-full shrink-0" />
                            <div className="bg-card p-3 rounded-lg rounded-tl-none border shadow-sm text-sm">
                                Hello! I'm your new agent. How can I help you today?
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t">
                        <div className="bg-muted h-10 rounded-md w-full" />
                    </div>
                 </div>
              </div>
           </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function SchemaEditor() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Data Collection Schema</h2>
                    <p className="text-sm text-muted-foreground">Define the fields you want to collect from the user.</p>
                </div>
                <Button size="sm" variant="secondary">Add Field</Button>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Full Name</CardTitle>
                            <div className="flex gap-2 items-center">
                                <Label htmlFor="required-1" className="text-xs">Required</Label>
                                <Switch id="required-1" defaultChecked />
                            </div>
                        </div>
                        <CardDescription>Text Input</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="grid gap-3">
                            <div className="grid gap-1">
                                <Label>Description / Prompt</Label>
                                <Input defaultValue="What is your full name?" />
                            </div>
                            <div className="grid gap-1">
                                <Label>Variable Name</Label>
                                <Input defaultValue="full_name" className="font-mono bg-muted" readOnly />
                            </div>
                         </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Email Address</CardTitle>
                            <div className="flex gap-2 items-center">
                                <Label htmlFor="required-2" className="text-xs">Required</Label>
                                <Switch id="required-2" defaultChecked />
                            </div>
                        </div>
                        <CardDescription>Email Input</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="grid gap-3">
                            <div className="grid gap-1">
                                <Label>Description / Prompt</Label>
                                <Input defaultValue="What is your email address?" />
                            </div>
                            <div className="grid gap-1">
                                <Label>Variable Name</Label>
                                <Input defaultValue="email" className="font-mono bg-muted" readOnly />
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function PersonaEditor() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Persona & Tone</h2>
                <p className="text-sm text-muted-foreground">Configure how your agent behaves and speaks.</p>
            </div>
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Agent Name</Label>
                    <Input placeholder="e.g. Support Bot" />
                </div>
                <div className="grid gap-2">
                    <Label>Role / System Prompt</Label>
                    <Textarea className="min-h-[200px]" placeholder="You are a helpful assistant..." />
                    <p className="text-xs text-muted-foreground">Define the core instructions for the LLM.</p>
                </div>
                 <div className="grid gap-2">
                    <Label>Tone</Label>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full">Professional</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Friendly</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Casual</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Enthusiastic</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KnowledgeEditor() {
    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Knowledge Base</h2>
                <p className="text-sm text-muted-foreground">Provide context for the agent to answer questions.</p>
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="mx-auto h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Upload Documents</h3>
                <p className="text-sm text-muted-foreground mt-1">PDF, TXT, MD supported</p>
            </div>
             <div className="grid gap-2">
                <Label>Or paste text content</Label>
                <Textarea className="min-h-[200px]" placeholder="Paste policies, FAQs, or other context here..." />
            </div>
        </div>
    )
}

function VisualsEditor() {
    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize the look and feel of the public chat.</p>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label>Theme Color</Label>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#F6D365] ring-2 ring-offset-2 ring-offset-background ring-ring cursor-pointer" />
                        <div className="h-8 w-8 rounded-full bg-[#4ADE80] cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-ring" />
                        <div className="h-8 w-8 rounded-full bg-[#60A5FA] cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-ring" />
                        <div className="h-8 w-8 rounded-full bg-[#F472B6] cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-ring" />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label>Welcome Message</Label>
                    <Textarea placeholder="Hi there! How can I help you today?" />
                </div>
            </div>
        </div>
    )
}
