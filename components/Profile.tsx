
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useData } from '../context/DataContext';
import { ProfileHeader } from './profile/ProfileHeader';
import { AboutSection } from './profile/AboutSection';
import { ExperienceSection } from './profile/ExperienceSection';
import { EducationSection } from './profile/EducationSection';
import { SkillsSection } from './profile/SkillsSection';
import { SidebarWidgets } from './profile/SidebarWidgets';

const Profile: React.FC = () => {
  const { userProfile, updateUserProfile, isLoading } = useData();
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  const handleUpdateUser = (data: Partial<UserProfile>) => {
    updateUserProfile(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-slate-500">Please contact support or try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-4 lg:pt-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <header className="mb-6 lg:mb-8">
           <ProfileHeader 
              user={userProfile} 
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
                bio={userProfile.bio} 
                onUpdate={(bio) => handleUpdateUser({ bio })} 
             />
             <ExperienceSection 
                experiences={userProfile.experiences} 
                onUpdate={(experiences) => handleUpdateUser({ experiences })} 
             />
             <EducationSection 
                education={userProfile.education} 
                onUpdate={(education) => handleUpdateUser({ education })} 
             />
             <SkillsSection 
                skills={userProfile.skills} 
                onUpdate={(skills) => handleUpdateUser({ skills })} 
             />
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
             <SidebarWidgets user={userProfile} />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;
