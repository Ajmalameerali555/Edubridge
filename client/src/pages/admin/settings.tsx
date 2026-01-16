import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { RouteGuard } from "@/components/portal/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSettings, updateSettings, Settings } from "@/lib/datastore";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, X, Plus, Save } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<Settings>(getSettings());
  const [newBlockedKeyword, setNewBlockedKeyword] = React.useState("");
  const [newBlockerKeyword, setNewBlockerKeyword] = React.useState("");

  const handleSave = () => {
    updateSettings(settings);
    toast({ title: "Settings saved", description: "Your changes have been applied" });
  };

  const addBlockedKeyword = () => {
    if (!newBlockedKeyword.trim()) return;
    setSettings({
      ...settings,
      communicationControls: {
        ...settings.communicationControls,
        blockedKeywords: [...settings.communicationControls.blockedKeywords, newBlockedKeyword.trim()],
      },
    });
    setNewBlockedKeyword("");
  };

  const removeBlockedKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      communicationControls: {
        ...settings.communicationControls,
        blockedKeywords: settings.communicationControls.blockedKeywords.filter((k) => k !== keyword),
      },
    });
  };

  const addBlockerKeyword = () => {
    if (!newBlockerKeyword.trim()) return;
    setSettings({
      ...settings,
      decoderRules: {
        ...settings.decoderRules,
        blockerKeywords: [...settings.decoderRules.blockerKeywords, newBlockerKeyword.trim()],
      },
    });
    setNewBlockerKeyword("");
  };

  const removeBlockerKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      decoderRules: {
        ...settings.decoderRules,
        blockerKeywords: settings.decoderRules.blockerKeywords.filter((k) => k !== keyword),
      },
    });
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Settings</h1>
              <p className="text-muted-foreground">Configure platform rules and preferences</p>
            </div>
            <Button onClick={handleSave} data-testid="button-save-settings">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <Tabs defaultValue="decoder" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="decoder" data-testid="tab-decoder">Decoder Rules</TabsTrigger>
              <TabsTrigger value="communication" data-testid="tab-communication">Communication</TabsTrigger>
              <TabsTrigger value="sessions" data-testid="tab-sessions">Session Policies</TabsTrigger>
              <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
              <TabsTrigger value="branding" data-testid="tab-branding">Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="decoder" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Track Mappings</CardTitle>
                  <CardDescription>Define how learning styles map to tracks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.decoderRules.trackMappings).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="capitalize">{key}</Label>
                        <Input value={key} disabled className="bg-muted" />
                      </div>
                      <div>
                        <Label>Maps to Track</Label>
                        <Input
                          value={value}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              decoderRules: {
                                ...settings.decoderRules,
                                trackMappings: {
                                  ...settings.decoderRules.trackMappings,
                                  [key]: e.target.value,
                                },
                              },
                            })
                          }
                          data-testid={`input-track-${key}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Blocker Keywords</CardTitle>
                  <CardDescription>Keywords that indicate learning blockers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {settings.decoderRules.blockerKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="gap-1">
                        {keyword}
                        <button
                          onClick={() => removeBlockerKeyword(keyword)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`remove-blocker-${keyword}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add blocker keyword..."
                      value={newBlockerKeyword}
                      onChange={(e) => setNewBlockerKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBlockerKeyword()}
                      data-testid="input-new-blocker"
                    />
                    <Button variant="outline" onClick={addBlockerKeyword} data-testid="button-add-blocker">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Privacy Controls</CardTitle>
                  <CardDescription>Control how contact information is handled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mask Phone & Email</Label>
                      <p className="text-sm text-muted-foreground">Hide contact info in messages</p>
                    </div>
                    <Switch
                      checked={settings.communicationControls.maskPhoneEmail}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          communicationControls: {
                            ...settings.communicationControls,
                            maskPhoneEmail: checked,
                          },
                        })
                      }
                      data-testid="switch-mask-phone-email"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Block Contact Sharing</Label>
                      <p className="text-sm text-muted-foreground">Prevent sharing phone/email</p>
                    </div>
                    <Switch
                      checked={settings.communicationControls.blockPhoneEmailSharing}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          communicationControls: {
                            ...settings.communicationControls,
                            blockPhoneEmailSharing: checked,
                          },
                        })
                      }
                      data-testid="switch-block-sharing"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Block External Links</Label>
                      <p className="text-sm text-muted-foreground">Prevent sharing external URLs</p>
                    </div>
                    <Switch
                      checked={settings.communicationControls.blockExternalLinks}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          communicationControls: {
                            ...settings.communicationControls,
                            blockExternalLinks: checked,
                          },
                        })
                      }
                      data-testid="switch-block-links"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Blocked Keywords</CardTitle>
                  <CardDescription>Words that trigger message blocking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {settings.communicationControls.blockedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="gap-1">
                        {keyword}
                        <button
                          onClick={() => removeBlockedKeyword(keyword)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`remove-keyword-${keyword}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add blocked keyword..."
                      value={newBlockedKeyword}
                      onChange={(e) => setNewBlockedKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBlockedKeyword()}
                      data-testid="input-new-keyword"
                    />
                    <Button variant="outline" onClick={addBlockedKeyword} data-testid="button-add-keyword">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Session Policies</CardTitle>
                  <CardDescription>Configure session behavior and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Lock Meet Link After Schedule</Label>
                      <p className="text-sm text-muted-foreground">Prevent link changes after scheduling</p>
                    </div>
                    <Switch
                      checked={settings.sessionPolicies.meetLinkLockedAfterSchedule}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          sessionPolicies: {
                            ...settings.sessionPolicies,
                            meetLinkLockedAfterSchedule: checked,
                          },
                        })
                      }
                      data-testid="switch-lock-meetlink"
                    />
                  </div>
                  <div>
                    <Label>Admin Notification Level</Label>
                    <Select
                      value={settings.sessionPolicies.adminNotificationLevel}
                      onValueChange={(value: "all" | "important" | "none") =>
                        setSettings({
                          ...settings,
                          sessionPolicies: {
                            ...settings.sessionPolicies,
                            adminNotificationLevel: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-2" data-testid="select-notification-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Homework Templates</CardTitle>
                  <CardDescription>Pre-defined homework templates for tutors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.templates.homework.map((template, idx) => (
                    <div key={template.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{template.title}</p>
                        <Badge variant="secondary">{template.subject}</Badge>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {template.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Templates</CardTitle>
                  <CardDescription>Pre-defined report templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.templates.reports.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg space-y-2">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.template}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tutor Note Templates</CardTitle>
                  <CardDescription>Pre-defined note templates for tutors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.templates.tutorNotes.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg space-y-2">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.template}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Branding Settings</CardTitle>
                  <CardDescription>Customize the platform appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="app-name">Application Name</Label>
                    <Input
                      id="app-name"
                      value={settings.branding.appName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: { ...settings.branding, appName: e.target.value },
                        })
                      }
                      data-testid="input-app-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={settings.branding.supportEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: { ...settings.branding, supportEmail: e.target.value },
                        })
                      }
                      data-testid="input-support-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="footer-text">Footer Text</Label>
                    <Textarea
                      id="footer-text"
                      value={settings.branding.footerText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: { ...settings.branding, footerText: e.target.value },
                        })
                      }
                      data-testid="input-footer-text"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PortalLayout>
    </RouteGuard>
  );
}
