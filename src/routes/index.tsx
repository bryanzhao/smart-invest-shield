import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookMarked,
  BookOpen,
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileSearch,
  GitPullRequest,
  Globe2,
  Layers3,
  Map,
  Menu,
  Network,
  Plus,
  Radar,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Telescope,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { CasebookView } from "@/components/casebook";
import { EntityProfilesView } from "@/components/entity-profiles";
import { RiskLensView } from "@/components/risk-lens";
import { IntelSupplyView } from "@/components/intel-supply";
import { ActorNetworkGraph, CompetitorMatrix, RiskTransmissionFlow } from "@/components/relationship-graphs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "国家认知地图 · 星瀚资本" },
      {
        name: "description",
        content: "从政策、监管、竞品和关键人物变化中，建立可追溯的海外投资判断。",
      },
      { property: "og:title", content: "国家认知地图 · 星瀚资本" },
      {
        property: "og:description",
        content: "AI 原生的海外投资风险识别与情报支持工作台。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiskIntelligenceApp,
});

type Tab = "overview" | "baseline" | "policy" | "actors" | "entities" | "framework" | "casebook" | "intel" | "lens" | "risk" | "issues";
type RiskLevel = "high" | "medium" | "low";

const countries = [
  { name: "意大利", code: "IT", status: "重点跟踪", tone: "amber" },
  { name: "西班牙", code: "ES", status: "资料建立中", tone: "blue" },
  { name: "德国", code: "DE", status: "待启动", tone: "muted" },
];

const projects = [
  { name: "意大利充电网络", type: "充电基础设施", state: "重点项目" },
  { name: "北部储能布局", type: "储能 / 微网", state: "研究中" },
  { name: "罗马城市更新", type: "综合能源", state: "待评估" },
];

const risks: Array<{
  title: string;
  level: RiskLevel;
  score: string;
  trend: string;
  category: string;
  evidence: string;
  summary: string;
}> = [
  {
    title: "外资审查触发边界",
    level: "high",
    score: "78",
    trend: "↑ 12",
    category: "监管",
    evidence: "A · 8 条来源",
    summary: "关键基础设施定义仍有解释空间，交易结构需要预留审查窗口。",
  },
  {
    title: "本地许可路径不确定",
    level: "high",
    score: "71",
    trend: "→ 稳定",
    category: "流程",
    evidence: "A · 6 条来源",
    summary: "地方审批与并网许可存在地区差异，预计窗口为 6–12 个月。",
  },
  {
    title: "补贴政策兑现节奏",
    level: "medium",
    score: "54",
    trend: "↑ 8",
    category: "政策",
    evidence: "B · 11 条来源",
    summary: "PNRR 资金进入执行期，配额与拨付进度成为项目回报变量。",
  },
  {
    title: "公用事业采购集中",
    level: "medium",
    score: "49",
    trend: "→ 稳定",
    category: "竞争",
    evidence: "B · 9 条来源",
    summary: "大型运营商掌握主要采购入口，关系网络和示范项目决定进入效率。",
  },
  {
    title: "关键部门换届影响",
    level: "low",
    score: "32",
    trend: "↓ 5",
    category: "人物",
    evidence: "A · 4 条来源",
    summary: "能源部门核心岗位已完成调整，现阶段未发现方向性逆转信号。",
  },
  {
    title: "区域电价波动",
    level: "low",
    score: "28",
    trend: "→ 稳定",
    category: "经济",
    evidence: "B · 7 条来源",
    summary: "北部与南部电价曲线分化，需在项目模型中拆分区域敏感性。",
  },
];

const pulses = [
  { type: "policy", time: "2 小时前", title: "能源部发布充电网络补贴细则修订稿", tag: "政策变化", color: "amber" },
  { type: "person", time: "昨天", title: "GSE 采购部门新增副主任 Matteo Riva", tag: "人物变动", color: "blue" },
  { type: "market", time: "3 天前", title: "Enel X 在伦巴第启动 120 个站点招标", tag: "竞品动作", color: "teal" },
  { type: "risk", time: "7 天前", title: "外资审查风险由 66 分升至 78 分", tag: "风险升级", color: "red" },
];

const sourceRows = [
  { title: "Decreto-legge 19/2026 · 外资审查修订", source: "Gazzetta Ufficiale", date: "2026.08.05", grade: "A" },
  { title: "PNRR Mission 2 · 充电设施执行进度", source: "Ministero dell\'Ambiente", date: "2026.08.02", grade: "A" },
  { title: "Italian EV charging market outlook", source: "Mordor Intelligence", date: "2026.07.28", grade: "B" },
];

const navGroups: Array<{
  group: string;
  hint: string;
  items: Array<{ id: Tab; label: string; icon: typeof Map; badge?: string }>;
}> = [
  {
    group: "基本认知",
    hint: "事实层 · 不做价值判断",
    items: [
      { id: "overview", label: "国家认知地图", icon: Map },
      { id: "baseline", label: "市场基本盘", icon: BookOpen },
      { id: "policy", label: "制度与流程", icon: FileSearch },
      { id: "actors", label: "主体档案", icon: Network },
      { id: "entities", label: "实体画像", icon: Boxes, badge: "6" },
    ],
  },
  {
    group: "分析框架",
    hint: "从事实到判断的推演",
    items: [
      { id: "framework", label: "分析框架", icon: Layers3 },
      { id: "casebook", label: "风险案例库", icon: BookMarked, badge: "8" },
      { id: "intel", label: "情报补给", icon: Radio, badge: "5" },
    ],
  },
  {
    group: "风险与决策",
    hint: "判断层 · 需人工复核",
    items: [
      { id: "lens", label: "七维风险透镜", icon: Telescope, badge: "7" },
      { id: "risk", label: "风险清单", icon: ShieldCheck, badge: "10" },
      { id: "issues", label: "Issue 中心", icon: GitPullRequest, badge: "3" },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);

const pageIntros: Record<Tab, { layer: string; description: string }> = {
  overview: { layer: "基本认知", description: "从政策、监管、竞争和关键人物中，建立国家层面的结构化认知。" },
  baseline: { layer: "基本认知", description: "市场规模、需求结构、成本与基础设施等基础事实，不含风险评价。" },
  policy: { layer: "基本认知", description: "制度安排、审批流程与政策原文，先描述规则本身，再谈影响。" },
  actors: { layer: "基本认知", description: "监管机构、竞品公司与关键人物的档案与公开动作。" },
  entities: { layer: "基本认知", description: "六类实体按标准模板画像：属性、来源分级与信息缺口一并呈现。" },
  framework: { layer: "分析框架", description: "事实 → 结构 → 判断 → 行动：每一层的输入、方法与产出都可追溯。" },
  casebook: { layer: "分析框架", description: "同类国家、同类行业、同类主体的历史风险案例，用可比经验校准判断。" },
  intel: { layer: "分析框架", description: "开源情报打底、客户自有情报校准、开源不可闭合的部分转为闭源与人力情报采购需求。" },
  lens: { layer: "风险与决策", description: "七个风险维度的分析链：输入画像、推演路径、反证信号与预警阈值。" },
  risk: { layer: "风险与决策", description: "只有经过框架推演并绑定证据的结论，才会进入风险清单。" },
  issues: { layer: "风险与决策", description: "把决策层的新问题转成可追踪、可复核、可沉淀的研究交付。" },
};

function RiskIntelligenceApp() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [country, setCountry] = useState(() => countries[0] ?? { name: "意大利", code: "IT", status: "重点跟踪", tone: "amber" });
  const [project, setProject] = useState(() => projects[0] ?? { name: "意大利充电网络", type: "充电基础设施", state: "重点项目" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueSent, setIssueSent] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const current = navItems.find((item) => item.id === activeTab);
    return current?.label ?? "认知地图";
  }, [activeTab]);

  function submitIssue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIssueSent(true);
    window.setTimeout(() => {
      setIssueOpen(false);
      setIssueSent(false);
    }, 1300);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Radar size={19} strokeWidth={1.8} /></div>
          <div>
            <div className="brand-name">星瀚资本</div>
            <div className="brand-subtitle">RISK INTELLIGENCE</div>
          </div>
          <button className="icon-button mobile-close" aria-label="关闭导航" onClick={() => setMobileNavOpen(false)}><X size={17} /></button>
        </div>

        <nav className="main-nav" aria-label="主导航">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.group}>
              <div className="nav-group-head">
                <span className="nav-group-label">{group.group}</span>
                <span className="nav-group-hint">{group.hint}</span>
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? "nav-item-active" : ""}`}
                    onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.label}</span>
                    {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>


        <div className="sidebar-section-label sidebar-section-label-spaced">项目空间</div>
        <div className="space-list">
          <button className="space-item space-item-active"><span className="space-dot dot-amber" />意大利市场</button>
          <button className="space-item"><span className="space-dot dot-blue" />西班牙市场</button>
          <button className="space-item"><span className="space-dot dot-muted" />德国市场</button>
          <button className="add-space"><Plus size={14} /> 新建市场</button>
        </div>

        <div className="sidebar-bottom">
          <div className="sync-status"><span className="status-pulse" />数据更新于 12 分钟前</div>
          <div className="user-card">
            <div className="avatar avatar-amber">赵</div>
            <div className="user-copy"><strong>赵作阳</strong><span>研究 / 交付团队</span></div>
            <ChevronDown size={14} className="user-chevron" />
          </div>
        </div>
      </aside>

      {mobileNavOpen ? <button className="sidebar-backdrop" aria-label="关闭导航" onClick={() => setMobileNavOpen(false)} /> : null}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" aria-label="打开导航" onClick={() => setMobileNavOpen(true)}><Menu size={19} /></button>
            <div className="breadcrumb"><span>投资风控</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className={`search-control ${searchOpen ? "search-control-open" : ""}`} onClick={() => setSearchOpen(!searchOpen)} aria-label="搜索情报">
              <Search size={16} />{searchOpen ? <input autoFocus placeholder="搜索情报、风险或人物" onClick={(event) => event.stopPropagation()} /> : <span>搜索情报</span>}<kbd>⌘ K</kbd>
            </button>
            <button className="icon-button notification-button" aria-label="通知"><Bell size={17} /><span className="notification-dot" /></button>
            <div className="avatar avatar-blue">邵</div>
          </div>
        </header>

        <div className="content-area">
          <div className="page-heading-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                <span className={`layer-chip layer-${pageIntros[activeTab].layer === "基本认知" ? "fact" : pageIntros[activeTab].layer === "分析框架" ? "method" : "judgement"}`}>{pageIntros[activeTab].layer}</span>
                {pageTitle} <span className="demo-tag">试点空间</span>
              </div>
              <h1>{country.name} · {project.name}</h1>
              <p className="page-description">{pageIntros[activeTab].description}</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button"><Clock3 size={15} /> 更新记录</button>
              <button className="primary-button" onClick={() => setIssueOpen(true)}><Plus size={16} /> 提交 Issue</button>
            </div>
          </div>


          <section className="context-bar" aria-label="视图筛选">
            <div className="context-selects">
              <label className="select-wrap"><Globe2 size={15} /><select value={country.code} onChange={(event) => { const nextCountry = countries.find((item) => item.code === event.target.value); if (nextCountry) setCountry(nextCountry); }}>{countries.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select><ChevronDown size={14} /></label>
              <label className="select-wrap project-select"><Layers3 size={15} /><select value={project.name} onChange={(event) => { const nextProject = projects.find((item) => item.name === event.target.value); if (nextProject) setProject(nextProject); }}>{projects.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select><ChevronDown size={14} /></label>
            </div>
            <div className="context-meta"><span className="live-dot" />持续跟踪中 <span className="meta-divider" /> 数据窗口：近 90 天 <button className="icon-button tiny-button" aria-label="调整筛选"><SlidersHorizontal size={15} /></button></div>
          </section>

          {activeTab === "overview" ? <Overview onOpenIssue={() => setIssueOpen(true)} /> : null}
          {activeTab === "baseline" ? <BaselineView /> : null}
          {activeTab === "entities" ? <EntityProfilesView /> : null}
          {activeTab === "lens" ? <RiskLensView /> : null}
          {activeTab === "framework" ? <FrameworkView /> : null}
          {activeTab === "casebook" ? <CasebookView /> : null}
          {activeTab === "intel" ? <IntelSupplyView /> : null}
          {activeTab === "risk" ? <RiskView onOpenIssue={() => setIssueOpen(true)} /> : null}
          {activeTab === "policy" ? <PolicyView /> : null}
          {activeTab === "actors" ? <ActorsView /> : null}
          {activeTab === "issues" ? <IssuesView onOpenIssue={() => setIssueOpen(true)} /> : null}
        </div>
      </main>

      {issueOpen ? <IssueModal sent={issueSent} onClose={() => setIssueOpen(false)} onSubmit={submitIssue} /> : null}
    </div>
  );
}

function Overview({ onOpenIssue }: { onOpenIssue: () => void }) {
  return (
    <>
      <section className="overview-grid">
        <div className="verdict-panel panel-dark">
          <div className="panel-topline"><span>市场进入判断</span><span className="confidence"><Sparkles size={13} /> AI + 人工复核</span></div>
          <div className="verdict-main"><div className="verdict-ring"><span>谨慎</span><small>进入</small></div><div className="verdict-copy"><h2>可进入，但需先锁定本地合规架构</h2><p>价值窗口在软件、交易与运营服务。市场资格、本地关系和审查边界，是当前的首要进入门槛。</p></div></div>
          <div className="verdict-footer"><span><ShieldCheck size={14} /> 结论已复核</span><span>2026.08.05 更新</span><button className="text-button" onClick={onOpenIssue}>质疑这个判断 <ArrowUpRight size={14} /></button></div>
        </div>
        <div className="metric-panel"><div className="metric-label">综合风险温度 <CircleHelp size={14} /></div><div className="metric-value">64<span>/100</span></div><div className="metric-trend trend-up">↑ 6.4 <span>较上季度</span></div><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className="metric-panel"><div className="metric-label">活跃风险 <CircleHelp size={14} /></div><div className="metric-value">10<span> 项</span></div><div className="metric-trend trend-warn">3 项需关注 <span>本周</span></div><div className="risk-segments"><i className="segment-high" /><i className="segment-high" /><i className="segment-high" /><i className="segment-medium" /><i className="segment-medium" /><i className="segment-low" /></div></div>
      </section>

      <section className="section-block map-section">
        <div className="section-heading"><div><span className="section-kicker">01 / 认知网络</span><h2>市场关键节点</h2></div><button className="ghost-button">展开关系图 <ArrowUpRight size={15} /></button></div>
        <div className="map-layout">
          <div className="cognitive-map">
            <div className="map-header"><span className="map-label"><span className="map-grid-icon"><Map size={14} /></span>意大利投资认知网络</span><span className="map-date">节点 24 · 关系 38 · 来源 338</span></div>
            <div className="map-canvas">
              <div className="map-grid" />
              <svg className="map-lines" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true"><path d="M400 212 L200 124 M400 212 L620 120 M400 212 L210 310 M400 212 L610 312 M200 124 L125 215 M620 120 L700 208" /><path className="line-dashed" d="M200 124 L610 312 M620 120 L210 310" /></svg>
              <MapNode className="node-center" icon={<Target size={17} />} title="市场进入" meta="核心判断" tone="amber" />
              <MapNode className="node-regulator" icon={<Building2 size={16} />} title="监管体系" meta="5 个部门" tone="blue" />
              <MapNode className="node-competitor" icon={<Activity size={16} />} title="竞争格局" meta="12 家公司" tone="teal" />
              <MapNode className="node-policy" icon={<BookOpen size={16} />} title="政策环境" meta="18 项政策" tone="amber" />
              <MapNode className="node-people" icon={<UsersRound size={16} />} title="关键人物" meta="31 个节点" tone="purple" />
              <MapNode className="node-process" icon={<GitPullRequest size={16} />} title="进入流程" meta="7 个节点" tone="red" />
              <div className="map-legend"><span><i className="legend-dot legend-strong" />已验证</span><span><i className="legend-dot legend-weak" />待验证</span><span><i className="legend-line" />影响关系</span></div>
            </div>
          </div>
          <div className="pulse-panel"><div className="pulse-heading"><div><span className="section-kicker">实时跟踪</span><h3>变化脉冲</h3></div><span className="pulse-count">4 条新变化</span></div><div className="pulse-list">{pulses.map((pulse) => <div className="pulse-item" key={pulse.title}><div className={`pulse-icon pulse-${pulse.color}`}>{pulse.type === "policy" ? <BookOpen size={15} /> : pulse.type === "person" ? <UserRound size={15} /> : pulse.type === "market" ? <Building2 size={15} /> : <AlertTriangle size={15} />}</div><div className="pulse-copy"><div className="pulse-meta"><span>{pulse.tag}</span><time>{pulse.time}</time></div><p>{pulse.title}</p></div></div>)}</div><button className="full-width-button">查看全部变化 <ChevronRight size={15} /></button></div>
        </div>
      </section>

      <section className="section-block risk-section"><div className="section-heading"><div><span className="section-kicker">02 / 风险雷达</span><h2>当前最需要关注的风险</h2></div><button className="ghost-button">查看完整清单 <ArrowUpRight size={15} /></button></div><div className="risk-grid">{risks.slice(0, 3).map((risk) => <RiskCard key={risk.title} risk={risk} />)}</div></section>

      <section className="section-block source-section"><div className="section-heading"><div><span className="section-kicker">03 / 证据链</span><h2>最近验证的来源</h2></div><button className="ghost-button">来源库 <ArrowUpRight size={15} /></button></div><div className="source-table"><div className="source-row source-header"><span>来源 / 判断关联</span><span>发布机构</span><span>日期</span><span>证据</span><span /></div>{sourceRows.map((row) => <div className="source-row" key={row.title}><span className="source-title"><span className="source-file"><FileSearch size={14} /></span>{row.title}</span><span>{row.source}</span><span className="mono-text">{row.date}</span><span><strong className={`evidence evidence-${row.grade.toLowerCase()}`}>{row.grade}</strong></span><button className="row-arrow" aria-label={`查看 ${row.title}`}><ArrowUpRight size={15} /></button></div>)}</div></section>
    </>
  );
}

function MapNode({ className, icon, title, meta, tone }: { className: string; icon: React.ReactNode; title: string; meta: string; tone: string }) {
  return <button className={`map-node ${className} node-tone-${tone}`}><span className="node-icon">{icon}</span><span className="node-copy"><strong>{title}</strong><small>{meta}</small></span></button>;
}

function RiskCard({ risk }: { risk: (typeof risks)[number] }) {
  return <article className={`risk-card risk-${risk.level}`}><div className="risk-card-top"><span className="risk-category">{risk.category}</span><span className={`risk-score score-${risk.level}`}>{risk.score}</span></div><h3>{risk.title}</h3><p>{risk.summary}</p><div className="risk-card-bottom"><span className="evidence evidence-a">{risk.evidence}</span><span className={`risk-trend risk-trend-${risk.level}`}>{risk.trend}</span><button className="row-arrow" aria-label={`查看 ${risk.title}`}><ArrowUpRight size={15} /></button></div></article>;
}

function RiskView({ onOpenIssue }: { onOpenIssue: () => void }) {
  return <section className="view-panel"><div className="view-intro"><div><span className="section-kicker">风险雷达 / QUARTERLY RESET</span><h2>Top 10 风险清单</h2><p>基于近 90 天新增信息，重新评估关键假设、影响范围与应对优先级。</p></div><button className="primary-button" onClick={onOpenIssue}><Plus size={16} /> 发起风险复核</button></div><div className="reset-banner"><div className="reset-icon"><Activity size={18} /></div><div><strong>季度风险重启进行中</strong><span>上次重启：2026.06.30 · 已完成 6 / 10 项</span></div><button className="text-button">查看重启记录 <ArrowUpRight size={14} /></button></div><RiskTransmissionFlow /><div className="risk-grid risk-grid-wide">{risks.map((risk) => <RiskCard key={risk.title} risk={risk} />)}</div></section>;
}

function PolicyView() {
  return <section className="view-panel"><div className="view-intro"><div><span className="section-kicker">监管与流程 / POLICY INTELLIGENCE</span><h2>政策变化与关键流程</h2><p>政策原文、中文解读与投资影响，按证据等级持续沉淀。</p></div><button className="secondary-button"><SlidersHorizontal size={15} /> 筛选来源</button></div><div className="policy-layout"><div className="policy-list">{sourceRows.concat([{ title: "DL 76/2026 · 地方并网审批指南", source: "ARERA", date: "2026.07.19", grade: "B" }]).map((row, index) => <article className="policy-card" key={row.title}><div className="policy-card-top"><span className={`policy-type ${index === 0 ? "type-alert" : ""}`}>{index === 0 ? "已变化" : "持续跟踪"}</span><span className={`evidence evidence-${row.grade.toLowerCase()}`}>证据 {row.grade}</span></div><h3>{row.title}</h3><p>{index === 0 ? "新的审查口径可能扩大关键基础设施的适用范围，建议在交易结构设计阶段预留预审路径。" : "已纳入国家资料包，等待下一轮影响评估与项目关联。"}</p><div className="policy-card-footer"><span>{row.source}</span><span className="mono-text">{row.date}</span><ArrowUpRight size={15} /></div></article>)}</div><div className="process-panel"><div className="panel-topline"><span>进入流程节点</span><span className="node-count">7 节点</span></div><div className="process-line">{["市场资格", "外资审查", "许可申请", "并网审批", "运营落地"].map((step, index) => <div className={`process-step ${index < 2 ? "process-done" : index === 2 ? "process-current" : ""}`} key={step}><span className="process-dot">{index < 2 ? "✓" : index + 1}</span><strong>{step}</strong><small>{index < 2 ? "已验证" : index === 2 ? "当前关注" : "待核验"}</small></div>)}</div><div className="process-note"><AlertTriangle size={15} /><span>许可申请预计窗口 <strong>6–12 个月</strong>，地区差异较大。</span></div></div></div></section>;
}

function ActorsView() {
  const actors = [{ type: "company", name: "Enel X Way", role: "主要竞品 · 运营商", signal: "伦巴第新增 120 个站点招标", tone: "teal" }, { type: "company", name: "Free2Move eSolutions", role: "主要竞品 · 设备与服务", signal: "与本地车队签署联合方案", tone: "blue" }, { type: "person", name: "Matteo Riva", role: "GSE · 采购副主任", signal: "2026.08 新任命", tone: "amber" }, { type: "person", name: "Giulia Conti", role: "能源部 · 电气化处", signal: "持续跟踪 · 4 条关联政策", tone: "purple" }];
  const [mode, setMode] = useState<"network" | "matrix" | "cards">("network");
  return <section className="view-panel"><div className="view-intro"><div><span className="section-kicker">竞争格局 / ACTOR INTELLIGENCE</span><h2>竞品与关键人物</h2><p>将组织、人物、项目和公开动作放在同一张可验证的关系网络中。</p></div><div className="view-switch">{([["network", "关系网络"], ["matrix", "竞争矩阵"], ["cards", "档案卡片"]] as const).map(([key, label]) => <button key={key} className={mode === key ? "view-switch-active" : ""} onClick={() => setMode(key)}>{label}</button>)}</div></div>{mode === "network" ? <ActorNetworkGraph /> : null}{mode === "matrix" ? <CompetitorMatrix /> : null}{mode === "cards" ? <div className="actor-grid">{actors.map((actor) => <article className="actor-card" key={actor.name}><div className={`actor-avatar actor-avatar-${actor.tone}`}>{actor.type === "company" ? <Building2 size={20} /> : <UserRound size={20} />}</div><div className="actor-card-top"><span className="actor-type">{actor.type === "company" ? "公司档案" : "人物档案"}</span><span className="evidence evidence-a">A</span></div><h3>{actor.name}</h3><p className="actor-role">{actor.role}</p><div className="actor-signal"><Activity size={14} /><span>{actor.signal}</span></div><div className="actor-footer"><span>最后验证 · 2 天前</span><ArrowUpRight size={15} /></div></article>)}</div> : null}</section>;
}


function IssuesView({ onOpenIssue }: { onOpenIssue: () => void }) {
  const issues = [{ id: "#IT-024", title: "外资审查是否影响合资进入路径？", status: "待复核", owner: "赵作阳", time: "2 小时前", tone: "review" }, { id: "#IT-023", title: "PNRR 补贴细则修订对回报模型的影响", status: "研究中", owner: "林安", time: "昨天", tone: "research" }, { id: "#IT-021", title: "GSE 新任采购负责人关联网络", status: "已发布", owner: "赵作阳", time: "3 天前", tone: "done" }];
  return <section className="view-panel"><div className="view-intro"><div><span className="section-kicker">ISSUE 中心 / DECISION SUPPORT</span><h2>问题与响应</h2><p>把决策层的新问题转成可追踪、可复核、可沉淀的研究交付。</p></div><button className="primary-button" onClick={onOpenIssue}><Plus size={16} /> 新建 Issue</button></div><div className="issue-stats"><div><span>开放 Issue</span><strong>3</strong></div><div><span>平均响应</span><strong>18<span>小时</span></strong></div><div><span>知识沉淀</span><strong>42<span>条</span></strong></div></div><div className="issue-list">{issues.map((issue) => <article className="issue-row" key={issue.id}><div className="issue-id">{issue.id}</div><div className="issue-main"><h3>{issue.title}</h3><div><span className={`issue-status status-${issue.tone}`}>{issue.status}</span><span>{issue.owner}</span><span>{issue.time}</span></div></div><div className="issue-progress"><span style={{ "--progress": issue.tone === "done" ? "100%" : issue.tone === "research" ? "62%" : "38%" } as React.CSSProperties} /></div><ArrowUpRight size={16} /></article>)}</div></section>;
}

function IssueModal({ sent, onClose, onSubmit }: { sent: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" role="presentation"><div className="issue-modal" role="dialog" aria-modal="true" aria-labelledby="issue-title"><div className="modal-header"><div><span className="section-kicker">NEW ISSUE / 决策支持</span><h2 id="issue-title">提交一个需要回答的问题</h2></div><button className="icon-button" onClick={onClose} aria-label="关闭"><X size={18} /></button></div>{sent ? <div className="sent-state"><div className="sent-icon"><ShieldCheck size={24} /></div><h3>Issue 已进入研究队列</h3><p>我们会在 24–72 小时内完成响应。</p></div> : <form onSubmit={onSubmit}><label className="form-label">问题标题<input required placeholder="例如：外资审查是否影响合资进入路径？" /></label><div className="form-grid"><label className="form-label">关联项目<select defaultValue="意大利充电网络"><option>意大利充电网络</option><option>北部储能布局</option></select></label><label className="form-label">优先级<select defaultValue="高"><option>高</option><option>中</option><option>低</option></select></label></div><label className="form-label">背景与期望结论<textarea required rows={4} placeholder="补充决策背景、已知信息与希望回答的方向" /></label><div className="modal-footer"><span><Clock3 size={14} /> 预计响应 24–72 小时</span><div><button type="button" className="secondary-button" onClick={onClose}>取消</button><button type="submit" className="primary-button"><GitPullRequest size={15} /> 创建 Issue</button></div></div></form>}</div></div>;
}

const baselineFacts = [
  { group: "市场与需求", items: [
    { label: "在册电动车保有量", value: "42.6 万辆", note: "2026Q2 · ACI 登记数据", source: "ACI", grade: "A" },
    { label: "公共充电点数量", value: "63,800 个", note: "同比 +31%，其中直流占 18%", source: "MOTUS-E", grade: "A" },
    { label: "车桩比", value: "6.7 : 1", note: "欧盟平均 12.4 : 1", source: "EAFO", grade: "B" },
  ] },
  { group: "成本与经济", items: [
    { label: "工商业电价（中位）", value: "0.211 €/kWh", note: "北部低于南部约 9%", source: "ARERA", grade: "A" },
    { label: "站点平均建设成本", value: "38–52 k€ / 直流站", note: "含并网与土建，地区差异较大", source: "行业访谈", grade: "C" },
    { label: "PNRR 补贴强度", value: "最高 40%", note: "按站点类型与区域分档", source: "MASE", grade: "A" },
  ] },
  { group: "制度与基础设施", items: [
    { label: "并网申请主管方", value: "e-distribuzione 等 DSO", note: "按区域划分，流程口径不完全一致", source: "ARERA", grade: "A" },
    { label: "外资审查制度", value: "Golden Power", note: "适用范围含关键基础设施，口径在演进", source: "Gazzetta Ufficiale", grade: "A" },
    { label: "地方审批层级", value: "大区 + 市镇双层", note: "20 个大区规则存在差异", source: "公开法规汇编", grade: "B" },
  ] },
];

function BaselineView() {
  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">基本认知 / MARKET BASELINE</span>
          <h2>市场基本盘</h2>
          <p>这一层只回答“事实是什么”：口径、数值、来源与更新时间，不做好坏评价，也不推导结论。</p>
        </div>
        <button className="secondary-button"><FileSearch size={15} /> 查看口径说明</button>
      </div>

      <div className="coverage-bar">
        <div className="coverage-copy"><strong>认知完备度 72%</strong><span>28 项基础指标中，20 项已绑定 A/B 级来源</span></div>
        <div className="coverage-track"><span style={{ width: "72%" }} /></div>
        <span className="coverage-note">缺口集中在建设成本与地方审批时长</span>
      </div>

      {baselineFacts.map((block) => (
        <div className="fact-block" key={block.group}>
          <div className="fact-block-head"><h3>{block.group}</h3><span>{block.items.length} 项事实</span></div>
          <div className="fact-grid">
            {block.items.map((fact) => (
              <article className="fact-card" key={fact.label}>
                <span className="fact-label">{fact.label}</span>
                <strong className="fact-value">{fact.value}</strong>
                <p className="fact-note">{fact.note}</p>
                <div className="fact-footer"><span>{fact.source}</span><span className={`evidence evidence-${fact.grade.toLowerCase()}`}>{fact.grade}</span></div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const frameworkLayers = [
  { step: "01", name: "事实层", question: "事实是什么？", method: "多语种公开信息采集、口径统一、来源分级", output: "基本盘指标、政策原文、主体档案", tone: "fact" },
  { step: "02", name: "结构层", question: "它们如何相互作用？", method: "实体关系抽取、流程建模、影响传导映射", output: "认知网络、进入流程、影响链路", tone: "structure" },
  { step: "03", name: "判断层", question: "对我们意味着什么？", method: "红方视角推演、假设检验、冲突证据处理", output: "风险评分、进入判断、置信度", tone: "judgement" },
  { step: "04", name: "行动层", question: "接下来做什么？", method: "触发条件设定、责任人分配、复核周期", output: "应对建议、监测指标、Issue 响应", tone: "action" },
];

const frameworkDimensions = [
  { name: "政治与制度", question: "规则是否稳定、可预期？", facts: 46, coverage: 84, state: "已成结论" },
  { name: "市场与需求", question: "需求规模与结构是否支撑投入？", facts: 38, coverage: 78, state: "已成结论" },
  { name: "竞争与主体", question: "谁掌握入口，我们凭什么进入？", facts: 51, coverage: 69, state: "推演中" },
  { name: "经济与回报", question: "成本、电价与补贴如何影响模型？", facts: 27, coverage: 55, state: "缺口" },
  { name: "运营与执行", question: "落地需要哪些本地能力？", facts: 19, coverage: 41, state: "缺口" },
  { name: "退出与流动性", question: "资产未来由谁接手？", facts: 12, coverage: 33, state: "缺口" },
];

function FrameworkView() {
  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">分析框架 / ANALYSIS FRAMEWORK</span>
          <h2>从事实到判断的四层推演</h2>
          <p>每一个风险结论，都必须能沿着这条链路回溯到具体事实与来源；任何跳层的结论都会被标记为假设。</p>
        </div>
        <button className="secondary-button"><Layers3 size={15} /> 下载框架说明</button>
      </div>

      <div className="layer-flow">
        {frameworkLayers.map((layer) => (
          <article className={`layer-card layer-card-${layer.tone}`} key={layer.step}>
            <div className="layer-card-top"><span className="layer-step">{layer.step}</span><strong>{layer.name}</strong></div>
            <p className="layer-question">{layer.question}</p>
            <div className="layer-meta"><span>方法</span><p>{layer.method}</p></div>
            <div className="layer-meta"><span>产出</span><p>{layer.output}</p></div>
          </article>
        ))}
      </div>

      <div className="section-heading"><div><span className="section-kicker">维度矩阵</span><h2>六个分析维度的当前状态</h2></div><span className="matrix-legend">覆盖度 = 已绑定证据的关键问题占比</span></div>
      <div className="matrix-table">
        <div className="matrix-row matrix-head"><span>维度</span><span>核心问题</span><span>事实数</span><span>覆盖度</span><span>状态</span></div>
        {frameworkDimensions.map((dim) => (
          <div className="matrix-row" key={dim.name}>
            <span className="matrix-name">{dim.name}</span>
            <span className="matrix-question">{dim.question}</span>
            <span className="mono-text">{dim.facts}</span>
            <span className="matrix-coverage"><i style={{ width: `${dim.coverage}%` }} />{dim.coverage}%</span>
            <span className={`matrix-state state-${dim.state === "已成结论" ? "done" : dim.state === "推演中" ? "research" : "gap"}`}>{dim.state}</span>
          </div>
        ))}
      </div>

      <div className="boundary-note">
        <ShieldCheck size={16} />
        <div><strong>AI 的边界</strong><span>AI 负责采集、抽取、关联与草稿；判断层与行动层的结论必须经过人工复核后才会发布。</span></div>
      </div>
    </section>
  );
}
