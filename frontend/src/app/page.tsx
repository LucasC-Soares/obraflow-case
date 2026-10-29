'use client';

import { useEffect, useState } from 'react';
import { ApprovalsScreen } from '@/features/orders/components/approvals-screen';
import { NewOrderForm } from '@/features/orders/components/new-order-form';
import { RulesScreen } from '@/features/rules/components/rules-screen';
import { Feedback, LoadingState } from '@/components/ui/feedback';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { useObraFlowData } from '@/hooks/use-obraflow-data';
import { Screen } from '@/types/obraflow';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('new-order');
  const [selectedWork, setSelectedWork] = useState('');
  const [notice, setNotice] = useState('');
  const data = useObraFlowData(selectedWork);

  useEffect(() => {
    if (!selectedWork && data.works[0])
      setSelectedWork(String(data.works[0].id));
  }, [data.works, selectedWork]);

  const reload = async () => {
    setNotice('');
    await data.reload();
  };

  return (
    <main className="shell">
      <Sidebar
        screen={screen}
        pendingCount={
          data.orders.filter((order) => order.status === 'PENDING').length
        }
        onNavigate={setScreen}
      />
      <section className="content">
        <PageHeader screen={screen} />
        <Feedback
          error={data.error}
          notice={notice}
          onRetry={() => void reload()}
        />
        {data.loading ? (
          <LoadingState />
        ) : screen === 'new-order' ? (
          <NewOrderForm
            works={data.works}
            suppliers={data.suppliers}
            selectedWork={selectedWork}
            onWorkChange={setSelectedWork}
            onSuccess={setNotice}
            onReload={reload}
          />
        ) : screen === 'approvals' ? (
          <ApprovalsScreen
            orders={data.orders}
            onNotice={setNotice}
            onReload={reload}
          />
        ) : (
          <RulesScreen
            works={data.works}
            users={data.users}
            selectedWork={selectedWork}
            onWorkChange={setSelectedWork}
            rules={data.rules}
            onNotice={setNotice}
            onReload={data.reloadRules}
          />
        )}
      </section>
    </main>
  );
}
