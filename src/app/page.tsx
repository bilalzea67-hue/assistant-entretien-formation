'use client';

import { Header } from '@/components/Header';
import { TableView } from '@/components/table/TableView';

export default function HomePage() {
  return (
    <>
      <Header title="Base de contacts" />
      <TableView />
    </>
  );
}
