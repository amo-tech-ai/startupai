
import React from 'react';
import { StartupProfile, Founder } from '../../types';
import { ResearchCard } from './ResearchCard';
import { OverviewCard } from './OverviewCard';
import { BusinessCard } from './BusinessCard';
import { TractionCard } from './TractionCard';
import { TeamCard } from './TeamCard';

interface ProfilePageContentProps {
  profile: StartupProfile;
  founders: Founder[];
  metrics: any; // Using any here to match DTO flexibility, could be typed stricter
  viewMode: 'edit' | 'investor';
  onSaveContext: (data: Partial<StartupProfile> & { metrics?: any }) => Promise<void>;
  onSaveTeam: (founders: Founder[]) => void;
}

export const ProfilePageContent: React.FC<ProfilePageContentProps> = ({
  profile,
  founders,
  metrics,
  viewMode,
  onSaveContext,
  onSaveTeam
}) => {
  return (
    <div className="space-y-8 print:w-full">
      <div className="print:break-inside-avoid">
        <ResearchCard 
          profile={profile}
          onSave={onSaveContext}
          viewMode={viewMode}
        />
      </div>

      <div className="print:break-inside-avoid">
        <OverviewCard 
          viewMode={viewMode} 
          profile={profile} 
          onSave={onSaveContext} 
        />
      </div>
      
      <div className="print:break-inside-avoid">
        <BusinessCard 
          viewMode={viewMode} 
          profile={profile}
          onSave={onSaveContext}
        />
      </div>

      <div className="print:break-inside-avoid">
        <TractionCard 
          viewMode={viewMode} 
          profile={profile}
          metrics={metrics}
          onSave={onSaveContext}
        />
      </div>

      <div className="print:break-inside-avoid">
        <TeamCard 
          viewMode={viewMode} 
          founders={founders}
          onSave={onSaveTeam}
        />
      </div>
    </div>
  );
};
