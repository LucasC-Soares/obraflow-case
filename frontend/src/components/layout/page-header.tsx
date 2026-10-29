import { Screen } from '@/types/obraflow';

const titles: Record<Screen, string> = {
  'new-order': 'Novo pedido de compra',
  approvals: 'Aprovações',
  rules: 'Regras da alçada',
};

export function PageHeader({ screen }: { screen: Screen }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">QUARTA-FEIRA, 28 DE OUTUBRO</p>
        <h1>{titles[screen]}</h1>
      </div>
      <div className="top-actions">
        <button className="icon-btn">⌕</button>
        <button className="icon-btn">♧</button>
        <span className="user-dot">LS</span>
      </div>
    </header>
  );
}
