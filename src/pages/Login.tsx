import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Shield, MapPin, Camera, FileCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import sikkimMountains from "@/assets/sikkim-mountains-login.jpg";

// Preload critical login background image
const preloadLoginImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = sikkimMountains;
  document.head.appendChild(link);
};

// Call preload immediately
preloadLoginImage();

const Login = () => {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{
          backgroundImage: `url(${sikkimMountains})`
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.2) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.2) 0%, transparent 50%),
                         radial-gradient(circle at 40% 40%, hsl(var(--accent) / 0.1) 0%, transparent 50%)`
      }} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/">
              <Button variant="glass" className="text-white hover:text-white hover-scale transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gradient-glass backdrop-blur-xl border border-white/30 shadow-glass animate-fade-in hover-scale transition-all duration-500" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
                <User className="w-5 h-5" />
                <span>Login Portal</span>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm border border-white/20">
                <TabsTrigger value="tourist" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-white text-white/80">
                  Tourist
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-white text-white/80">
                  Admin
                </TabsTrigger>
                <TabsTrigger value="guide" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-white text-white/80">
                  Guide
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tourist" className="space-y-4">
                <div className="space-y-3">
                <div className="text-center mb-3">
                  <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-white/80">Explore monasteries and virtual tours</p>
                </div>
                <div>
                  <Label htmlFor="tourist-email" className="text-white">Email</Label>
                  <Input id="tourist-email" type="email" placeholder="your@email.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label htmlFor="tourist-password" className="text-white">Password</Label>
                  <Input id="tourist-password" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
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
                  <p className="text-sm text-white/80">Manage content and users</p>
                </div>
                <div>
                  <Label htmlFor="admin-email" className="text-white">Admin Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@monastery360.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label htmlFor="admin-password" className="text-white">Password</Label>
                  <Input id="admin-password" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
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
                  <p className="text-sm text-white/80">Guide visitors and share knowledge</p>
                </div>
                
                <div>
                  <Label htmlFor="guide-email" className="text-white">Email</Label>
                  <Input id="guide-email" type="email" placeholder="guide@email.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                
                <div>
                  <Label htmlFor="guide-password" className="text-white">Password</Label>
                  <Input id="guide-password" type="password" placeholder="••••••••" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                
                <div>
                  <Label htmlFor="guide-gender" className="text-white">Gender</Label>
                  <Select value={guideGender} onValueChange={setGuideGender}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select gender" className="text-white/60" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-sm border-white/20">
                      <SelectItem value="male">Male (M)</SelectItem>
                      <SelectItem value="female">Female (F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="kyc-upload" className="text-white">E-KYC Verification</Label>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors bg-white/5">
                    <input
                      id="kyc-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleKycUpload}
                      className="hidden"
                    />
                    <label htmlFor="kyc-upload" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-white/80" />
                      <p className="text-sm text-white/80">
                        {kycFile ? kycFile.name : "Upload KYC Document"}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </label>
                  </div>
                  {kycFile && (
                    <div className="flex items-center space-x-2 mt-2">
                      <FileCheck className="w-4 h-4 text-green-400" />
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300 border-green-400/30">
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
      </div>
    </div>
  );
};

export default Login;