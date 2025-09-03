import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Shield, MapPin, Camera, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoginPanel = () => {
  const [activeTab, setActiveTab] = useState("tourist");
  const [guideGender, setGuideGender] = useState<string>("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleLogin = (userType: string) => {
    toast({
      title: "Login Initiated",
      description: `Logging in as ${userType}`,
    });
  };

  const handleKycUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setKycFile(file);
      toast({
        title: "E-KYC Document Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  return (
    <div className="w-80">
      <Card className="bg-gradient-glass backdrop-blur-md border border-white/20 shadow-glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-foreground flex items-center justify-center space-x-2">
            <User className="w-5 h-5" />
            <span>Login Portal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="tourist" className="text-xs data-[state=active]:bg-primary">
                Tourist
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-xs data-[state=active]:bg-primary">
                Admin
              </TabsTrigger>
              <TabsTrigger value="guide" className="text-xs data-[state=active]:bg-primary">
                Guide
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tourist" className="space-y-4">
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Explore monasteries and virtual tours</p>
                </div>
                <div>
                  <Label htmlFor="tourist-email">Email</Label>
                  <Input id="tourist-email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="tourist-password">Password</Label>
                  <Input id="tourist-password" type="password" placeholder="••••••••" />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("Tourist")}
                >
                  Login as Tourist
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <Shield className="w-8 h-8 mx-auto text-secondary mb-2" />
                  <p className="text-sm text-muted-foreground">Manage content and users</p>
                </div>
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@monastery360.com" />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" placeholder="••••••••" />
                </div>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => handleLogin("Admin")}
                >
                  Admin Login
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="guide" className="space-y-4">
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <Camera className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Guide visitors and share knowledge</p>
                </div>
                
                <div>
                  <Label htmlFor="guide-email">Email</Label>
                  <Input id="guide-email" type="email" placeholder="guide@email.com" />
                </div>
                
                <div>
                  <Label htmlFor="guide-password">Password</Label>
                  <Input id="guide-password" type="password" placeholder="••••••••" />
                </div>
                
                <div>
                  <Label htmlFor="guide-gender">Gender</Label>
                  <Select value={guideGender} onValueChange={setGuideGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male (M)</SelectItem>
                      <SelectItem value="female">Female (F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="kyc-upload">E-KYC Verification</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="kyc-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleKycUpload}
                      className="hidden"
                    />
                    <label htmlFor="kyc-upload" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {kycFile ? kycFile.name : "Upload KYC Document"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </label>
                  </div>
                  {kycFile && (
                    <div className="flex items-center space-x-2 mt-2">
                      <FileCheck className="w-4 h-4 text-green-600" />
                      <Badge variant="secondary" className="text-xs">
                        Document Uploaded
                      </Badge>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleLogin("Guide")}
                  disabled={!guideGender || !kycFile}
                >
                  Login as Guide
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};