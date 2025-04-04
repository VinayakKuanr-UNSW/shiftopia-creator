
import React from 'react';
import { ArrowRight, CheckCircle, LayoutDashboard, Calendar, CalendarDays, BadgeCheck, Fingerprint, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen overflow-auto">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 backdrop-blur-lg bg-black/30 border-b border-white/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                ShiftoPia: Advanced Staff Rostering
              </h1>
              <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
                Streamline your workforce management with our comprehensive rostering solution. Seamlessly create, manage, and optimize staff schedules.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="flex gap-2 items-center bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20">
                <a href="/login">
                  Get Started <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 backdrop-blur-xl bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Key Features
            </h2>
            <p className="mx-auto max-w-[600px] text-white/70 md:text-xl/relaxed">
              Powerful tools to manage your workforce scheduling needs with ease and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <Calendar className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Roster Management</CardTitle>
                <CardDescription className="text-white/70">Create and publish staff rosters with drag-and-drop ease</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Build complex schedules in minutes with our intuitive roster templates. Assign shifts to staff based on skills, availability, and certifications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <CalendarDays className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Availability Tracking</CardTitle>
                <CardDescription className="text-white/70">Staff can easily input and update their availability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Capture employee availability patterns and preferences. Prevent scheduling conflicts with real-time availability visualization.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <BadgeCheck className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Shift Bidding</CardTitle>
                <CardDescription className="text-white/70">Allow staff to bid on open shifts based on qualifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Empower employees with the ability to request shifts that fit their schedule. Managers can review and approve bids with a single click.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-amber-400 mb-2" />
                <CardTitle className="text-white">Timesheet Management</CardTitle>
                <CardDescription className="text-white/70">Track hours worked and process payroll data efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Automatic timesheet generation based on actual hours worked. Export timesheet data for seamless payroll integration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <LayoutDashboard className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle className="text-white">Data-Driven Insights</CardTitle>
                <CardDescription className="text-white/70">Analyze staffing patterns and optimize resource allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Generate reports on labor costs, scheduling efficiency, and attendance. Identify trends and optimize future rostering decisions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
              <CardHeader>
                <Fingerprint className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Role-Based Access Control</CardTitle>
                <CardDescription className="text-white/70">Secure access management based on user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Granular permissions ensure users only access appropriate features:
                  <ul className="text-left list-disc pl-5 mt-2 space-y-1">
                    <li><span className="font-semibold">Admin:</span> Full system access including configurations, insights, broadcast, and more</li>
                    <li><span className="font-semibold">Manager:</span> Roster creation, approvals, insights and broadcast</li>
                    <li><span className="font-semibold">Team Lead:</span> Staff management, timesheet review, and broadcast</li>
                    <li><span className="font-semibold">Team Member:</span> Personal roster view and availability updates</li>
                  </ul>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 backdrop-blur-xl bg-black/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Why Choose ShiftoPia?
            </h2>
          </div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 mt-8">
            <div className="flex flex-col gap-3 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-white">Save Time</h3>
              </div>
              <p className="text-sm text-white/70">
                Reduce scheduling time by up to 80% with automated roster generation and management.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-white">Reduce Costs</h3>
              </div>
              <p className="text-sm text-white/70">
                Optimize labor costs by ensuring efficient staff allocation based on demand.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-white">Improve Compliance</h3>
              </div>
              <p className="text-sm text-white/70">
                Ensure schedules comply with labor laws, break requirements, and industry regulations.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-white">Enhance Employee Experience</h3>
              </div>
              <p className="text-sm text-white/70">
                Boost staff satisfaction by considering preferences and enabling shift bidding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 backdrop-blur-xl bg-gradient-to-b from-black/50 to-black/70 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                Ready to Optimize Your Workforce Management?
              </h2>
              <p className="mx-auto max-w-[600px] text-white/70 md:text-xl/relaxed">
                Join organizations that have transformed their scheduling processes with ShiftoPia.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20">
                <a href="/login">
                  Login Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
