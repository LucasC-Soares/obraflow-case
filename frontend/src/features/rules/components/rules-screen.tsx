'use client';

import { FormEvent, useState } from 'react';
import { apiRequest } from '@/lib/client';
import { API_ROUTES } from '@/constants/api-routes';
import { formatMoney } from '@/lib/format';
import { approvalRuleSchema } from '@/schemas/approval-rule.schema';
import { EmptyState } from '@/components/ui/feedback';
import { Option, Rule } from '@/types/obraflow';
import { z } from 'zod';

export function RulesScreen({
  works,
  users,
  selectedWork,
  onWorkChange,
  rules,
  onNotice,
  onReload,
}: {
  works: Option[];
  users: Option[];
  selectedWork: string;
  onWorkChange: (value: string) => void;
  rules: Rule[];
  onNotice: (message: string) => void;
  onReload: () => Promise<void>;
}) {
  const [minimum, setMinimum] = useState('');
  const [maximum, setMaximum] = useState('');
  const [approverIds, setApproverIds] = useState<string[]>([]);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = approvalRuleSchema.safeParse({
      minimum,
      maximum: maximum || undefined,
      approverIds,
    });
    if (!parsed.success) return;
    await apiRequest(
      API_ROUTES.approvalRules.byWork(selectedWork),
      z.unknown(),
      {
        method: 'POST',
        body: JSON.stringify({
          minimumTotalCents: Math.round(Number(minimum) * 100),
          maximumTotalCents: maximum
            ? Math.round(Number(maximum) * 100)
            : undefined,
          approvers: approverIds.map((userId) => ({ userId: Number(userId) })),
        }),
      },
    );
    setMinimum('');
    setMaximum('');
    setApproverIds([]);
    onNotice('Faixa de alçada criada.');
    await onReload();
  };
  return (
    <div className="rules-layout">
      <div className="card rules-card">
        <div className="card-title">
          <div>
            <h2>Faixas de aprovação</h2>
            <p>Configure quem aprova cada faixa de valor.</p>
          </div>
          <select
            value={selectedWork}
            onChange={(event) => onWorkChange(event.target.value)}
          >
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.name}
              </option>
            ))}
          </select>
        </div>
        {rules.length === 0 ? (
          <EmptyState>Nenhuma regra cadastrada para esta obra.</EmptyState>
        ) : (
          rules.map((rule) => (
            <div className="rule-row" key={rule.id}>
              <div className="rule-range">
                <small>FAIXA DE VALOR</small>
                <strong>
                  {rule.maximumTotalCents
                    ? `Até ${formatMoney(rule.maximumTotalCents)}`
                    : `Acima de ${formatMoney(rule.minimumTotalCents)}`}
                </strong>
              </div>
              <div className="rule-people">
                <small>APROVADORES, NA ORDEM</small>
                <div>
                  {rule.approvers.map((approver) => (
                    <span className="person" key={approver.position}>
                      <span>
                        {approver.userName
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                      {approver.userName}
                      {approver.position < rule.approvers.length && <b>→</b>}
                    </span>
                  ))}
                </div>
              </div>
              <button className="dots">•••</button>
            </div>
          ))
        )}
      </div>
      <form className="card new-rule" onSubmit={save}>
        <p className="eyebrow">NOVA CONFIGURAÇÃO</p>
        <h2>Adicionar faixa</h2>
        <p>Defina o limite e a sequência de pessoas responsáveis.</p>
        <label>
          Valor mínimo (R$)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={minimum}
            onChange={(event) => setMinimum(event.target.value)}
          />
        </label>
        <label>
          Valor máximo (R$) <span className="optional">opcional</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={maximum}
            onChange={(event) => setMaximum(event.target.value)}
          />
        </label>
        <label>Aprovadores</label>
        <div className="approver-selects">
          {users.map((user) => (
            <label className="check" key={user.id}>
              <input
                type="checkbox"
                checked={approverIds.includes(String(user.id))}
                onChange={(event) =>
                  setApproverIds(
                    event.target.checked
                      ? [...approverIds, String(user.id)]
                      : approverIds.filter((id) => id !== String(user.id)),
                  )
                }
              />
              <span>{user.name}</span>
            </label>
          ))}
        </div>
        <button
          className="primary-button"
          disabled={!selectedWork || !approverIds.length}
        >
          Salvar faixa <span>→</span>
        </button>
      </form>
    </div>
  );
}
