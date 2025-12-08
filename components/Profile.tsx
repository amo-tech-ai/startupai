
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ProfileHeader } from './profile/ProfileHeader';
import { AboutSection } from './profile/AboutSection';
import { ExperienceSection } from './profile/ExperienceSection';
import { SkillsSection } from './profile/SkillsSection';
import { SidebarWidgets } from './profile/SidebarWidgets';

const Profile: React.FC = () => {
  // Mock Data (In production this comes from DataContext/Supabase)
  const [user, setUser] = useState<UserProfile>({
    id: 'user_123',
    fullName: 'Alex Rivera',
    headline: 'Founder @ StartupAI • Ex-Google Product Lead',
    location: 'San Francisco, CA',
    bio: "I'm a product-focused founder with over 10 years of experience building scalable SaaS applications. Previously led product teams at Google and Stripe. Passionate about AI, developer tools, and democratization of technology.",
    avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=fff&size=256',
    coverImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80',
    email: 'alex@startupai.com',
    phone: '+1 (555) 123-4567',
    socials: {
      linkedin: 'https://linkedin.com/in/alexrivera',
      twitter: 'https://twitter.com/alexrivera',
      website: 'https://alexrivera.io'
    },
    experiences: [
      {
        id: 'exp_1',
        role: 'Founder & CEO',
        company: 'StartupAI',
        startDate: 'Jan 2024',
        current: true,
        description: 'Building the operating system for modern founders. Leveraging Generative AI to automate fundraising and operations.',
      },
      {
        id: 'exp_2',
        role: 'Senior Product Manager',
        company: 'Google',
        startDate: 'Jun 2019',
        endDate: 'Dec 2023',
        current: false,
        description: 'Led the Google Cloud AI developer experience team. Launched 3 major products serving 1M+ developers.',
      }
    ],
    education: [],
    skills: ['Product Strategy', 'React', 'TypeScript', 'GenAI', 'Fundraising', 'Go-to-Market'],
    completionScore: 85
  });

  const [isEditingHeader, setIsEditingHeader] = useState(false);

  const handleUpdateUser = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-4 lg:pt-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <header className="mb-6 lg:mb-8">
           <ProfileHeader 
              user={user} 
              isEditing={isEditingHeader} 
              onToggleEdit={() => setIsEditingHeader(!isEditingHeader)}
              onUpdate={handleUpdateUser}
           />
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN COLUMN */}
          <main className="lg:col-span-8 space-y-6">
             <AboutSection 
                bio={user.bio} 
                onUpdate={(bio) => handleUpdateUser({ bio })} 
             />
             <ExperienceSection 
                experiences={user.experiences} 
                onUpdate={(experiences) => handleUpdateUser({ experiences })} 
             />
             <SkillsSection 
                skills={user.skills} 
                onUpdate={(skills) => handleUpdateUser({ skills })} 
             />
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
             <SidebarWidgets user={user} />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;
