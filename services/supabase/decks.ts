
import { supabase } from '../../lib/supabaseClient';
import { Deck, Slide } from '../../types';
import { mapDeckFromDB } from '../../lib/mappers';

export const DeckService = {
  async getAll(startupId: string): Promise<Deck[]> {
    if (!supabase) return [];

    const { data } = await supabase
        .from('decks')
        .select('*, slides(*)')
        .eq('startup_id', startupId)
        .order('updated_at', { ascending: false });

    return data ? data.map(mapDeckFromDB) : [];
  },

  async create(deck: Omit<Deck, 'id' | 'startupId'>, startupId: string): Promise<Deck> {
    if (!supabase) throw new Error("Supabase not initialized");

    // 1. Insert Deck
    const { data: deckRes, error: deckErr } = await supabase
        .from('decks')
        .insert({ 
            title: deck.title, 
            template: deck.template, 
            startup_id: startupId,
            status: 'draft',
            format: 'standard' 
        })
        .select()
        .single();
    
    if (deckErr) throw deckErr;

    // 2. Insert Slides
    const slidesPayload = deck.slides.map((s, idx) => ({
        deck_id: deckRes.id,
        title: s.title,
        bullets: s.bullets, // Supabase handles JSONB array auto-conversion
        position: idx,
        type: 'generic',
        chart_type: s.chartType,
        chart_data: s.chartData,
        visual_description: s.visualDescription
    }));

    if (slidesPayload.length > 0) {
        const { error: slidesErr } = await supabase.from('slides').insert(slidesPayload);
        if (slidesErr) throw slidesErr;
    }

    // Return complete object by fetching (or constructing locally)
    // For simplicity, we construct locally based on the insert result ID
    return {
        ...deck,
        id: deckRes.id,
        startupId: startupId,
        updatedAt: deckRes.updated_at
    };
  },

  async update(id: string, updates: Partial<Deck>): Promise<void> {
    if (!supabase) return;

    // 1. Update Deck Metadata
    const { slides, ...deckMeta } = updates;
    if (Object.keys(deckMeta).length > 0) {
        const dbPayload: any = {};
        if (deckMeta.title) dbPayload.title = deckMeta.title;
        dbPayload.updated_at = new Date().toISOString();
        
        await supabase.from('decks').update(dbPayload).eq('id', id);
    }

    // 2. Upsert Slides
    if (slides) {
        const slidesPayload = slides.map((s, idx) => ({
            id: s.id.length < 10 ? undefined : s.id, // Only send ID if it's a real UUID (approx check)
            deck_id: id,
            title: s.title,
            bullets: s.bullets,
            image_url: s.imageUrl,
            chart_type: s.chartType,
            chart_data: s.chartData,
            position: idx,
            visual_description: s.visualDescription
        }));

        const { error } = await supabase.from('slides').upsert(slidesPayload);
        if (error) throw error;
    }
  }
};
