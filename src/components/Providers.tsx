'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchClients = useAppStore((state) => (state as any).fetchClients);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return <>{children}</>;
}
