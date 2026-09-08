import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export function useModuleProgress() {
  const { user } = useAuth();
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setModuleProgress({});
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'user_quiz_results'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const results = snap.docs.map(doc => doc.data());

        const progressMap: Record<string, number> = {};

        results.forEach((result) => {
          const moduleId = result.moduleId;
          const percentage = result.percentage || 0;
          
          if (!progressMap[moduleId] || percentage > progressMap[moduleId]) {
            progressMap[moduleId] = percentage;
          }
        });

        // Add 100% implicitly if needed? No, let's just use the max score
        setModuleProgress(progressMap);
      } catch (err) {
        console.error('Error fetching module progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  return { moduleProgress, loading };
}
