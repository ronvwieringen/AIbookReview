/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-FUNC-001] User Registration/Login
 * - User profile management and settings
 * - Account information updates
 * - Password and security settings
 *
 * [REQ-FUNC-016] Author Profile Management
 * - Author bio and professional information
 * - Social media and website links
 * - Publishing preferences and settings
 *
 * [REQ-UI-007] Author Dashboard Navigation
 * - Consistent navigation for author-specific pages
 * - Integration with main author dashboard
 *
 * [REQ-FUNC-018] Notification Preferences
 * - Email notification settings
 * - Review alert preferences
 * - Marketing communication options
 *
 * [REQ-FUNC-019] Privacy and Security Settings
 * - Data privacy controls
 * - Account security options
 * - Content visibility settings
 */

"use client"

import { useState } from "react"
import AuthorDashboardNav from "@/components/author-dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Bell,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react"

export default function AuthorProfilePage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    bio: "Award-winning science fiction author with over 10 years of experience crafting immersive worlds and compelling characters.",
    website: "https://sarahjohnsonbooks.com",
    twitter: "@sarahjbooks",
    facebook: "sarahjohnsonauthor",
    instagram: "@sarahjbooks",
    linkedin: "sarah-johnson-author",
  })

  const [notifications, setNotifications] = useState({
    emailReviews: true,
    emailMarketing: false,
    emailUpdates: true,
    pushNotifications: true,
    weeklyDigest: true,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showStats: true,
    allowMessages: true,
  })

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${section} settings have been updated successfully.`,
    })
  }

  const handleAvatarUpload = () => {
    toast({
      title: "Avatar uploaded",
      description: "Your profile picture has been updated.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2A4759] mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your public profile information and social media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-lg">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button onClick={handleAvatarUpload} className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Author Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell readers about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  />
                </div>

                {/* Social Media */}
                <div>
                  <Label className="text-base font-semibold">Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-blue-500" />
                      <Input
                        placeholder="@username"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <Input
                        placeholder="facebook.com/username"
                        value={profileData.facebook}
                        onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <Input
                        placeholder="@username"
                        value={profileData.instagram}
                        onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <Input
                        placeholder="linkedin.com/in/username"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("profile")} className="bg-[#F79B72] hover:bg-[#F79B72]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account credentials and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Change Password</Label>
                  <div className="space-y-4 mt-3">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("account")} className="bg-[#F79B72] hover:bg-[#F79B72]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Update Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about reviews and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Review Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified when your books receive new reviews</p>
                    </div>
                    <Switch
                      checked={notifications.emailReviews}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailReviews: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Platform Updates</Label>
                      <p className="text-sm text-gray-500">Important updates about AIbookReview features</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-gray-500">Weekly summary of your book performance</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Marketing Communications</Label>
                      <p className="text-sm text-gray-500">Tips, promotions, and marketing opportunities</p>
                    </div>
                    <Switch
                      checked={notifications.emailMarketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailMarketing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Browser notifications for urgent updates</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("notifications")} className="bg-[#F79B72] hover:bg-[#F79B72]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy settings and data visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Public Profile</Label>
                      <p className="text-sm text-gray-500">Make your author profile visible to readers</p>
                    </div>
                    <Switch
                      checked={privacy.profilePublic}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, profilePublic: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Show Email Address</Label>
                      <p className="text-sm text-gray-500">Display your email on your public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Show Statistics</Label>
                      <p className="text-sm text-gray-500">Display book statistics on your profile</p>
                    </div>
                    <Switch
                      checked={privacy.showStats}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showStats: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Allow Messages</Label>
                      <p className="text-sm text-gray-500">Let readers send you messages through the platform</p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold text-red-600">Danger Zone</Label>
                  <div className="mt-3 p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-700 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave("privacy")} className="bg-[#F79B72] hover:bg-[#F79B72]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
