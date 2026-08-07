import { useState } from "react";
import { CheckCircle2, CircleAlert, CircleDashed, Layers, Route, Ticket, Boxes, ArrowRight } from "lucide-react";

type TicketItem = {
  id: string;
  name: string;
  question: string;
  status: "已具备" | "部分具备" | "缺口";
  detail: string;
  owner: string;
};

const tickets: TicketItem[] = [
  {
    id: "T1",
    name: "资本",
    question: "出资主体、资金路径与外资身份是否可被监管接受？",
    status: "部分具备",
    detail: "出海主体确权尚未完成；中资背景在关键基础设施相关业务上会触发额外说明义务。",
    owner: "财务 / 法务",
  },
  {
    id: "T2",
    name: "许可",
    question: "所选业务是否需要能源、交通或电力市场侧的行政许可？",
    status: "缺口",
    detail: "软件与服务模式许可负担最低；一旦涉及聚合或直接持牌交易，需要单独资格申请。",
    owner: "合规",
  },
  {
    id: "T3",
    name: "数据",
    question: "是否满足数据与网络安全合规（关键实体义务、跨境传输）？",
    status: "部分具备",
    detail: "充电运营与能源软件已被纳入关键实体范畴，数据本地化与事件报告机制需要提前设计。",
    owner: "技术 / 合规",
  },
  {
    id: "T4",
    name: "资格",
    question: "是否具备参与市场交易与公共采购的注册资格？",
    status: "缺口",
    detail: "市场平台注册、结算账户、担保额度与公共采购白名单是硬门槛，周期长于技术对接。",
    owner: "业务",
  },
  {
    id: "T5",
    name: "关系",
    question: "是否有可持续的本地机构、协会与客户关系？",
    status: "缺口",
    detail: "本地信任需要通过协会成员、人才流动与首个可引用案例逐步积累，无法用价格替代。",
    owner: "市场 / 政府关系",
  },
];

const ticketTone: Record<TicketItem["status"], string> = {
  已具备: "ok",
  部分具备: "warn",
  缺口: "gap",
};

const layers = [
  {
    level: "超国家层",
    body: "欧盟立法与总司",
    role: "决定市场上限与合规基线",
    output: "条例、指令、反补贴与数据安全规则",
    lead: "12–36 个月",
    note: "在这一层能改变的是规则本身，但时滞最长、门槛最高。",
  },
  {
    level: "国家层",
    body: "部委、监管局与系统运营者",
    role: "决定资格、价格机制与采购节奏",
    output: "决议、市场规则、补贴与招标",
    lead: "3–12 个月",
    note: "多数“能不能做、怎么收钱”的问题在这一层被决定。",
  },
  {
    level: "地方层",
    body: "大区、市镇与特许经营者",
    role: "决定项目能否真正落地",
    output: "选址、许可、并网与场地准入",
    lead: "1–12 个月",
    note: "全国平均值在这一层失效，交付节奏必须按大区分别建模。",
  },
];

type Mode = {
  name: string;
  scores: Record<string, string>;
  verdict: string;
};

const dimensions = ["监管触发", "投入强度", "见效速度", "可逆性", "本地依赖", "收益上限"] as const;

const modes: Mode[] = [
  {
    name: "软件与服务出口",
    scores: { 监管触发: "低", 投入强度: "低", 见效速度: "快", 可逆性: "高", 本地依赖: "中", 收益上限: "中" },
    verdict: "首选切入口：审查敏感度最低，可先建立可引用案例。",
  },
  {
    name: "本地合资 / 平台嵌入",
    scores: { 监管触发: "中", 投入强度: "中", 见效速度: "中", 可逆性: "中", 本地依赖: "高", 收益上限: "中高" },
    verdict: "用本地伙伴的资格与关系换取速度，但需处理排他与治理边界。",
  },
  {
    name: "直接持牌运营",
    scores: { 监管触发: "高", 投入强度: "高", 见效速度: "慢", 可逆性: "低", 本地依赖: "高", 收益上限: "高" },
    verdict: "收益最高但退出成本最大，应作为后置选项而非首步。",
  },
  {
    name: "股权并购 / 控股",
    scores: { 监管触发: "极高", 投入强度: "高", 见效速度: "中", 可逆性: "低", 本地依赖: "中", 收益上限: "高" },
    verdict: "外资审查风险集中于此，需在交割条件中预设审查失败退出机制。",
  },
];

const modeTone: Record<string, string> = { 低: "ok", 中: "warn", 中高: "warn", 高: "gap", 极高: "gap", 快: "ok", 慢: "gap" };

const sequence = [
  { phase: "阶段一", title: "非敏感接触", actions: "行业协会、公开研讨、技术白皮书", signal: "是否被邀请进入行业议题讨论", risk: "低" },
  { phase: "阶段二", title: "可引用案例", actions: "小规模软件试点、与本地服务商联合交付", signal: "首个客户是否愿意公开署名", risk: "低" },
  { phase: "阶段三", title: "资格与合规就位", actions: "市场注册、数据合规改造、采购白名单", signal: "注册与担保是否按期完成", risk: "中" },
  { phase: "阶段四", title: "结构性进入", actions: "合资、持牌或并购，视前三阶段结果选择", signal: "监管沟通是否得到明确口径", risk: "高" },
];

const assets = [
  { label: "可直接调用", tone: "ok", items: ["国内充电运营与调度软件能力", "现有集团合资平台的欧洲渠道", "设备与软件的成本结构优势"] },
  { label: "受限或待确权", tone: "warn", items: ["出海主体的治理边界与授权范围", "合资协议的排他条款覆盖范围", "品牌与知识产权在海外的归属"] },
  { label: "明显缺口", tone: "gap", items: ["本地持牌与市场交易资格", "本地政府与监管的常态沟通渠道", "可对外引用的欧洲交付案例"] },
];

export function MarketEntryView() {
  const [activeMode, setActiveMode] = useState(modes[0]?.name ?? "");

  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">进入策略 / MARKET ENTRY</span>
          <h2>从认知到落子：门票、层级、家底与进入模式</h2>
          <p>风险判断之外，还需要回答“以什么顺序、什么模式、什么边界进入”。这一层把前面的事实重组为可执行的博弈结构。</p>
        </div>
      </div>

      <div className="entry-block">
        <div className="panel-topline"><span><Ticket size={14} /> 进入门票自查清单</span><span className="node-count">5 类</span></div>
        <div className="ticket-grid">
          {tickets.map((item) => (
            <article className={`ticket-card ticket-${ticketTone[item.status]}`} key={item.id}>
              <div className="ticket-head">
                <span className="ticket-id">{item.id}</span>
                <h3>{item.name}</h3>
                <span className={`ticket-status status-${ticketTone[item.status]}`}>
                  {item.status === "已具备" ? <CheckCircle2 size={13} /> : item.status === "部分具备" ? <CircleDashed size={13} /> : <CircleAlert size={13} />}
                  {item.status}
                </span>
              </div>
              <p className="ticket-question">{item.question}</p>
              <p>{item.detail}</p>
              <span className="ticket-owner">责任方：{item.owner}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="entry-block">
        <div className="panel-topline"><span><Layers size={14} /> 三级决策链条</span><span className="node-count">混淆层级是最常见的战略错误</span></div>
        <div className="layer-chain">
          {layers.map((layer, index) => (
            <article className="layer-card" key={layer.level}>
              <span className="layer-index">L{index + 1}</span>
              <h3>{layer.level}</h3>
              <p className="layer-body">{layer.body}</p>
              <dl>
                <div><dt>作用</dt><dd>{layer.role}</dd></div>
                <div><dt>产出</dt><dd>{layer.output}</dd></div>
                <div><dt>时滞</dt><dd>{layer.lead}</dd></div>
              </dl>
              <p className="layer-note">{layer.note}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="entry-split">
        <div className="entry-block">
          <div className="panel-topline"><span><Boxes size={14} /> 家底盘点：自身组织边界</span></div>
          <div className="asset-columns">
            {assets.map((column) => (
              <div className={`asset-column asset-${column.tone}`} key={column.label}>
                <span className="asset-label">{column.label}</span>
                <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="case-note">进入方案必须从自身可调用资源出发；未确权的资源在推演中按“不可用”处理。</p>
        </div>

        <div className="entry-block">
          <div className="panel-topline"><span><Route size={14} /> 接触顺序推演</span><span className="node-count">待校准骨架</span></div>
          <ol className="sequence-list">
            {sequence.map((step) => (
              <li key={step.phase}>
                <div className="sequence-head">
                  <span className="sequence-phase">{step.phase}</span>
                  <strong>{step.title}</strong>
                  <span className={`ticket-status status-${modeTone[step.risk] ?? "warn"}`}>风险 {step.risk}</span>
                </div>
                <p>{step.actions}</p>
                <p className="sequence-signal"><ArrowRight size={13} /> 通过判据：{step.signal}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="entry-block">
        <div className="panel-topline"><span>进入模式决策矩阵</span><span className="node-count">4 模式 × 6 维度</span></div>
        <div className="matrix-scroll">
          <table className="entry-matrix">
            <thead>
              <tr>
                <th>进入模式</th>
                {dimensions.map((dim) => <th key={dim}>{dim}</th>)}
              </tr>
            </thead>
            <tbody>
              {modes.map((mode) => (
                <tr key={mode.name} className={activeMode === mode.name ? "matrix-row-active" : ""} onMouseEnter={() => setActiveMode(mode.name)}>
                  <th scope="row">{mode.name}</th>
                  {dimensions.map((dim) => (
                    <td key={dim}><span className={`matrix-pill pill-${modeTone[mode.scores[dim] ?? ""] ?? "neutral"}`}>{mode.scores[dim]}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="matrix-verdict">{modes.find((mode) => mode.name === activeMode)?.verdict}</p>
      </div>
    </section>
  );
}
