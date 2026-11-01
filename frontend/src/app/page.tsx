'use client';

import { useEffect, useState } from 'react';
import { ApprovalsScreen } from '@/features/orders/components/approvals-screen';
import { NewOrderForm } from '@/features/orders/components/new-order-form';
import { RulesScreen } from '@/features/rules/components/rules-screen';
import { Feedback, LoadingState } from '@/components/ui/feedback';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { useWorksData } from '@/features/works/hooks/use-works-data';
import { useSuppliersData } from '@/features/suppliers/hooks/use-suppliers-data';
import { useUsersData } from '@/features/users/hooks/use-users-data';
import { useOrdersData } from '@/features/orders/hooks/use-orders-data';
import { useApprovalRulesData } from '@/features/rules/hooks/use-approval-rules-data';
import { Screen } from '@/types/obraflow';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('new-order');
  const [selectedWork, setSelectedWork] = useState('');
  const [notice, setNotice] = useState('');
  const works = useWorksData();
  const suppliers = useSuppliersData();
  const users = useUsersData();
  const orders = useOrdersData();
  const approvalRules = useApprovalRulesData(selectedWork);

  useEffect(() => {
    if (!selectedWork && works.works[0])
      setSelectedWork(String(works.works[0].id));
  }, [works.works, selectedWork]);

  const reload = async () => {
    setNotice('');
    await Promise.all([
      works.reload(),
      suppliers.reload(),
      users.reload(),
      orders.reload(),
    ]);
  };

  const loading =
    works.loading || suppliers.loading || users.loading || orders.loading;
  const error =
    works.error ||
    suppliers.error ||
    users.error ||
    orders.error ||
    approvalRules.error;

  return (
    <main className="shell">
      <Sidebar
        screen={screen}
        pendingCount={
          orders.orders.filter((order) => order.status === 'PENDING').length
        }
        onNavigate={setScreen}
      />
      <section className="content">
        <PageHeader screen={screen} />
        <Feedback error={error} notice={notice} onRetry={() => void reload()} />
        {loading ? (
          <LoadingState />
        ) : screen === 'new-order' ? (
          <NewOrderForm
            works={works.works}
            suppliers={suppliers.suppliers}
            selectedWork={selectedWork}
            onWorkChange={setSelectedWork}
            onSuccess={setNotice}
            onReload={reload}
          />
        ) : screen === 'approvals' ? (
          <ApprovalsScreen
            orders={orders.orders}
            onNotice={setNotice}
            onReload={reload}
          />
        ) : (
          <RulesScreen
            works={works.works}
            users={users.users}
            selectedWork={selectedWork}
            onWorkChange={setSelectedWork}
            rules={approvalRules.rules}
            onNotice={setNotice}
            onReload={approvalRules.reload}
          />
        )}
      </section>
    </main>
  );
}
