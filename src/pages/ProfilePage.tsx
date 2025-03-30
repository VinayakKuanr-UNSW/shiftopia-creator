import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, Building, UserCircle, Shield, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    role: user?.role || '',
  });

  // Mock data for user stats
  const userStats = {
    totalShifts: 156,
    completedShifts: 148,
    upcomingShifts: 8,
    averageRating: 4.8,
    joinDate: '2023-01-15',
    lastActive: 'Today at 2:30 PM',
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 bg-black/40 border-white/10">
            <CardHeader className="relative">
              {/* Cover Photo */}
              <div className="absolute inset-0 h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-t-lg"></div>
              
              <div className="relative pt-8 px-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-white/60">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} • {user?.department.charAt(0).toUpperCase() + user?.department.slice(1)}</p>
                </div>
                
                <div className="sm:ml-auto">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline" 
                    className="bg-white/5 border-white/10"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="mt-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-1.5 block">Email</label>
                      <Input 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Contact Information</div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-white/40" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-white/40" />
                          <span>{user?.department.charAt(0).toUpperCase() + user?.department.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white/60 mb-1">Role & Access</div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <UserCircle className="w-4 h-4 mr-2 text-white/40" />
                          <span>{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-white/40" />
                          <span>Full {user?.department} access</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white/60 mb-1">Account Details</div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-white/40" />
                          <span>Joined {new Date(userStats.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Last active: {userStats.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-purple-900/20 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Total Shifts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userStats.totalShifts}</div>
                        <div className="text-white/60 text-sm">Shifts completed</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-900/20 border-blue-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Upcoming</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userStats.upcomingShifts}</div>
                        <div className="text-white/60 text-sm">Scheduled shifts</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-900/20 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Rating</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userStats.averageRating}</div>
                        <div className="text-white/60 text-sm">Average rating</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-orange-900/20 border-orange-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Completion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {((userStats.completedShifts / userStats.totalShifts) * 100).toFixed(1)}%
                        </div>
                        <div className="text-white/60 text-sm">Completion rate</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;