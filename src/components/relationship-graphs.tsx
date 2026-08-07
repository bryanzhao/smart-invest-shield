import { useState } from "react";
import { Building2, Network, ScatterChart, UserRound, Waypoints } from "lucide-react";

type NodeKind = "regulator" | "person" | "company" | "self";

const graphNodes: Array<{
  id: string;
  label: string;
  sub: string;
  kind: NodeKind;
  x: number;
  y: number;
}> = [
  { id: "mase", label: "MASE 能源部", sub: "政策制定", kind: "regulator", x: 130, y: 90 },
  { id: "arera", label: "ARERA", sub: "能源监管局", kind: "regulator", x: 108, y: 265 },
  { id: "gse", label: "GSE", sub: "补贴与采购", kind: "regulator", x: 148, y: 435 },
  { id: "giulia", label: "Giulia Conti", sub: "电气化处处长", kind: "person", x: 345, y: 72 },
  { id: "paolo", label: "Paolo Verdi", sub: "并网规则委员", kind: "person", x: 322, y: 240 },
  { id: "matteo", label: "Matteo Riva", sub: "采购副主任 · 新任", kind: "person", x: 352, y: 405 },
  { id: "enel", label: "Enel X Way", sub: "运营商 · 份额第一", kind: "company", x: 648, y: 118 },
  { id: "free2move", label: "Free2Move", sub: "设备与服务", kind: "company", x: 682, y: 278 },
  { id: "becharge", label: "Be Charge", sub: "站点网络", kind: "company", x: 622, y: 428 },
  { id: "self", label: "星瀚（我方）", sub: "拟进入主体", kind: "self", x: 452, y: 528 },
];

const graphEdges: Array<{
  from: string;
  to: string;
  label: string;
  verified: boolean;
}> = [
  { from: "mase", to: "giulia", label: "任职", verified: true },
  { from: "arera", to: "paolo", label: "任职", verified: true },
  { from: "gse", to: "matteo", label: "任职 · 2026.08", verified: true },
  { from: "mase", to: "arera", label: "规则委托", verified: true },
  { from: "gse", to: "enel", label: "补贴拨付", verified: true },
  { from: "matteo", to: "enel", label: "招标评审", verified: true },
  { from: "giulia", to: "enel", label: "公开会晤", verified: false },
  { from: "paolo", to: "free2move", label: "技术咨询", verified: false },
  { from: "arera", to: "becharge", label: "并网裁定", verified: true },
  { from: "enel", to: "becharge", label: "站点竞争", verified: true },
  { from: "self", to: "matteo", label: "待建立", verified: false },
  { from: "self", to: "free2move", label: "潜在合作", verified: false },
  { from: "self", to: "enel", label: "直接竞争", verified: true },
];

const kindLabel: Record<NodeKind, string> = {
  regulator: "监管机构",
  person: "关键人物",
  company: "市场主体",
  self: "我方",
};

export function ActorNetworkGraph() {
  const [active, setActive] = useState<string | null>(null);

  const related = new Set<string>();
  if (active) {
    related.add(active);
    graphEdges.forEach((edge) => {
      if (edge.from === active) related.add(edge.to);
      if (edge.to === active) related.add(edge.from);
    });
  }

  const nodeById = (id: string) => graphNodes.find((node) => node.id === id)!;
  const isDim = (id: string) => active !== null && !related.has(id);

  return (
    <div className="graph-shell">
      <div className="graph-head">
        <span className="graph-title"><Network size={15} /> 机构 · 人物 · 主体关系网络</span>
        <span className="graph-meta">10 节点 · 13 关系 · 悬停节点查看关联</span>
      </div>
      <div className="graph-canvas">
        <svg viewBox="0 0 800 580" className="graph-svg" role="img" aria-label="机构人物关系网络图">
          <g className="graph-edges">
            {graphEdges.map((edge) => {
              const a = nodeById(edge.from);
              const b = nodeById(edge.to);
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - 26;
              const dim = active !== null && !(related.has(edge.from) && related.has(edge.to));
              return (
                <g key={`${edge.from}-${edge.to}`} className={`graph-edge ${edge.verified ? "" : "graph-edge-weak"} ${dim ? "graph-dim" : ""}`}>
                  <path d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`} />
                  {active && related.has(edge.from) && related.has(edge.to) ? (
                    <text x={mx} y={my + 12} textAnchor="middle">{edge.label}</text>
                  ) : null}
                </g>
              );
            })}
          </g>
          {graphNodes.map((node) => (
            <g
              key={node.id}
              className={`graph-node graph-node-${node.kind} ${isDim(node.id) ? "graph-dim" : ""} ${active === node.id ? "graph-node-active" : ""}`}
              transform={`translate(${node.x} ${node.y})`}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
            >
              <circle r={active === node.id ? 26 : 20} />
              <circle className="graph-node-halo" r={34} />
              <text className="graph-node-label" y={48} textAnchor="middle">{node.label}</text>
              <text className="graph-node-sub" y={65} textAnchor="middle">{node.sub}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="graph-legend">
        {(Object.keys(kindLabel) as NodeKind[]).map((kind) => (
          <span key={kind}><i className={`legend-node legend-node-${kind}`} />{kindLabel[kind]}</span>
        ))}
        <span><i className="legend-edge" />已验证关系</span>
        <span><i className="legend-edge legend-edge-weak" />待验证 / 假设</span>
      </div>
    </div>
  );
}

const competitors = [
  { name: "Enel X Way", x: 88, y: 92, size: 34, note: "本地关系最深、规模最大" },
  { name: "Be Charge", x: 74, y: 68, size: 26, note: "站点密度高，资本压力大" },
  { name: "Free2Move", x: 52, y: 55, size: 22, note: "车队渠道，设备侧优势" },
  { name: "Ionity", x: 30, y: 47, size: 18, note: "高速干线，价格偏高" },
  { name: "Atlante", x: 44, y: 38, size: 16, note: "南部布局，扩张中" },
  { name: "星瀚（拟进入）", x: 18, y: 26, size: 15, note: "软件与运营服务切入", self: true },
];

export function CompetitorMatrix() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="graph-shell">
      <div className="graph-head">
        <span className="graph-title"><ScatterChart size={15} /> 竞争格局矩阵</span>
        <span className="graph-meta">气泡大小 = 在运营站点规模</span>
      </div>
      <div className="matrix-plot">
        <span className="axis-y-label">市场份额与站点规模 →</span>
        <span className="axis-x-label">本地关系与制度接入深度 →</span>
        <div className="plot-area">
          <div className="plot-grid" />
          <div className="plot-quadrant plot-q1">规模主导</div>
          <div className="plot-quadrant plot-q2">关系驱动</div>
          <div className="plot-quadrant plot-q3">利基切入</div>
          <div className="plot-quadrant plot-q4">技术挑战者</div>
          {competitors.map((item) => (
            <button
              key={item.name}
              className={`plot-bubble ${item.self ? "plot-bubble-self" : ""} ${hover === item.name ? "plot-bubble-active" : ""}`}
              style={{ left: `${item.x}%`, bottom: `${item.y}%`, width: item.size * 2, height: item.size * 2 }}
              onMouseEnter={() => setHover(item.name)}
              onMouseLeave={() => setHover(null)}
              aria-label={item.name}
            >
              <span className="plot-bubble-name">{item.name}</span>
              {hover === item.name ? <span className="plot-tooltip">{item.note}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const transmission = {
  sources: [
    { id: "s1", label: "外资审查口径修订", meta: "DL 19/2026 · 证据 A" },
    { id: "s2", label: "PNRR 补贴细则调整", meta: "MASE · 证据 A" },
    { id: "s3", label: "GSE 采购负责人换任", meta: "人事变动 · 证据 A" },
  ],
  channels: [
    { id: "c1", label: "交易结构与审批时序", meta: "传导强度 高" },
    { id: "c2", label: "回报模型与资本开支", meta: "传导强度 中" },
    { id: "c3", label: "本地关系与招标入口", meta: "传导强度 中" },
  ],
  impacts: [
    { id: "i1", label: "进入时间延后 3–6 个月", meta: "影响：交割节奏" },
    { id: "i2", label: "IRR 下行 0.8–1.6pt", meta: "影响：投资回报" },
    { id: "i3", label: "站点获取效率下降", meta: "影响：扩张速度" },
  ],
  links: [
    { from: "s1", to: "c1", strength: "high" },
    { from: "s1", to: "c3", strength: "low" },
    { from: "s2", to: "c2", strength: "high" },
    { from: "s2", to: "c1", strength: "low" },
    { from: "s3", to: "c3", strength: "high" },
    { from: "c1", to: "i1", strength: "high" },
    { from: "c2", to: "i2", strength: "high" },
    { from: "c3", to: "i3", strength: "high" },
    { from: "c1", to: "i2", strength: "low" },
  ],
};

const rowY = (index: number) => 60 + index * 108;

export function RiskTransmissionFlow() {
  const [active, setActive] = useState<string | null>(null);

  const positions: Record<string, { x: number; y: number }> = {};
  transmission.sources.forEach((item, index) => { positions[item.id] = { x: 176, y: rowY(index) }; });
  transmission.channels.forEach((item, index) => { positions[item.id] = { x: 400, y: rowY(index) }; });
  transmission.impacts.forEach((item, index) => { positions[item.id] = { x: 624, y: rowY(index) }; });

  const chain = new Set<string>();
  if (active) {
    chain.add(active);
    let changed = true;
    while (changed) {
      changed = false;
      transmission.links.forEach((link) => {
        if (chain.has(link.from) && !chain.has(link.to)) { chain.add(link.to); changed = true; }
        if (chain.has(link.to) && !chain.has(link.from) && link.to === active) { chain.add(link.from); changed = true; }
      });
    }
  }

  const columns = [
    { title: "变化源", items: transmission.sources, tone: "source" },
    { title: "传导通道", items: transmission.channels, tone: "channel" },
    { title: "对项目的影响", items: transmission.impacts, tone: "impact" },
  ];

  return (
    <div className="graph-shell">
      <div className="graph-head">
        <span className="graph-title"><Waypoints size={15} /> 风险传导链路</span>
        <span className="graph-meta">悬停任一节点，高亮其向下传导的完整路径</span>
      </div>
      <div className="flow-canvas">
        <svg viewBox="0 0 800 400" className="flow-svg" role="img" aria-label="风险传导链路图">
          {transmission.links.map((link) => {
            const a = positions[link.from]!;
            const b = positions[link.to]!;
            const dim = active !== null && !(chain.has(link.from) && chain.has(link.to));
            return (
              <path
                key={`${link.from}-${link.to}`}
                className={`flow-link flow-link-${link.strength} ${dim ? "graph-dim" : ""}`}
                d={`M ${a.x + 82} ${a.y} C ${a.x + 150} ${a.y}, ${b.x - 150} ${b.y}, ${b.x - 82} ${b.y}`}
              />
            );
          })}
        </svg>
        <div className="flow-columns">
          {columns.map((column) => (
            <div className="flow-column" key={column.title}>
              <div className="flow-column-title">{column.title}</div>
              {column.items.map((item) => (
                <button
                  key={item.id}
                  className={`flow-node flow-node-${column.tone} ${active && !chain.has(item.id) ? "graph-dim" : ""} ${active === item.id ? "flow-node-active" : ""}`}
                  onMouseEnter={() => setActive(item.id)}
                  onMouseLeave={() => setActive(null)}
                >
                  <strong>{item.label}</strong>
                  <small>{item.meta}</small>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="graph-legend">
        <span><i className="legend-edge legend-edge-strong" />强传导</span>
        <span><i className="legend-edge legend-edge-weak" />弱传导 / 待验证</span>
        <span><Building2 size={13} /> 机构与政策变化</span>
        <span><UserRound size={13} /> 人物变动同样纳入传导</span>
      </div>
    </div>
  );
}
