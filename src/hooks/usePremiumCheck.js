import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function usePremiumCheck() {
  const [isPremium, setIsPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsPremium(false);
          setLoading(false);
          return;
        }

        setUser(session.user);
        const { data, error } = await supabase
          .from('profiles')
          .select('premium')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setIsPremium(data?.premium || false);
      } catch (error) {
        console.error('Error checking premium:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremium();
  }, []);

  return { isPremium, loading, user };
}