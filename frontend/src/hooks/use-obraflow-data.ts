'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/client';
import { API_ROUTES } from '@/constants/api-routes';
import { Option, Order, Rule } from '@/types/obraflow';
import { z } from 'zod';

const optionSchema = z.array(z.object({ id: z.number(), name: z.string() }));
const orderSchema = z.array(
  z.object({
    id: z.number(),
    status: z.string(),
    orderDate: z.string(),
    totalCents: z.number(),
    work: z.string(),
    supplier: z.string(),
  }),
);
const ruleSchema = z.array(
  z.object({
    id: z.number(),
    minimumTotalCents: z.number(),
    maximumTotalCents: z.number().nullable(),
    approvers: z.array(
      z.object({
        userId: z.number(),
        userName: z.string(),
        position: z.number(),
      }),
    ),
  }),
);

export function useObraFlowData(selectedWork: string) {
  const [works, setWorks] = useState<Option[]>([]);
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCatalogAndOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [workData, supplierData, userData, orderData] = await Promise.all([
        apiRequest<Option[]>(API_ROUTES.catalog.works, optionSchema),
        apiRequest<Option[]>(API_ROUTES.catalog.suppliers, optionSchema),
        apiRequest<Option[]>(API_ROUTES.catalog.users, optionSchema),
        apiRequest<Order[]>(API_ROUTES.orders.list, orderSchema),
      ]);
      setWorks(workData);
      setSuppliers(supplierData);
      setUsers(userData);
      setOrders(orderData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'API indisponível.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRules = useCallback(async () => {
    if (!selectedWork) {
      setRules([]);
      return;
    }
    try {
      setRules(
        await apiRequest<Rule[]>(
          API_ROUTES.approvalRules.byWork(selectedWork),
          ruleSchema,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar as regras.',
      );
    }
  }, [selectedWork]);

  useEffect(() => {
    void loadCatalogAndOrders();
  }, [loadCatalogAndOrders]);
  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  return {
    works,
    suppliers,
    users,
    orders,
    rules,
    loading,
    error,
    setError,
    reload: loadCatalogAndOrders,
    reloadRules: loadRules,
  };
}
