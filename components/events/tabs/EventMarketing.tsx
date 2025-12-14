
import React, { useState, useEffect } from 'react';
import { EventData, EventAsset } from '../../../types';
import { EventService } from '../../../services/supabase/events';
import { MarketingGenerator } from './MarketingGenerator';
import { MarketingGallery } from './MarketingGallery';

interface EventMarketingProps {
  event: EventData;
}

export const EventMarketing: React.FC<EventMarketingProps> = ({ event }) => {
  const [assets, setAssets] = useState<EventAsset[]>([]);

  useEffect(() => {
      if (event.id) {
          EventService.getAssets(event.id).then(setAssets);
      }
  }, [event.id]);

  const handleAssetCreated = (newAsset: EventAsset) => {
      setAssets(prev => [newAsset, ...prev]);
  };

  return (
    <div className="space-y-8">
        <MarketingGenerator event={event} onAssetCreated={handleAssetCreated} />
        <MarketingGallery assets={assets} />
    </div>
  );
};
