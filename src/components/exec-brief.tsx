import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, FileSearch, Flag, Gauge, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

const snapshot = [
  { label: "市场规模", value: "€ 42 亿", note: "2026 年充电服务市场，年增 18%" },
  { label: "竞争密度", value: "中高", note: "前 3 家运营商掌握 61% 站点" },
  { label: "政策窗口", value: "18 个月", note: "PNRR 资金执行期至 2027 年底" },
  { label: "进入难度", value: "中", note: "资本要求可控，资格与本地关系为主要门槛" },
];

const verdictPoints = [
  "市场需求成立，补贴窗口尚未关闭，不属于观望型市场。",
  "直接持有充电资产的回报受电价与许可周期稀释，软件与运营服务为更优切入点。",
  "主要不确定性来自外资审查边界与本地许可节奏，而非市场本身。",
];

const alerts = [
  {
    level: "高",
    title: "外资审查可能触发 Golden Power",
    impact: "交易时间表 +3~6 个月，最坏情形附条件通过",
    signal: "Decreto-legge 19/2026 扩大关键基础设施定义",
    ask: "在交易结构设计阶段引入本地律所预沟通",
  },
  {
    level: "高",
    title: "地方许可与并网周期不可控",
    impact: "首批站点投运时间存在 6~12 个月区间",
    signal: "伦巴第与坎帕尼亚审批时长相差 2.4 倍",
    ask: "试点区域收敛至单一大区，验证后再行复制",
  },
  {
    level: "中",
    title: "补贴兑现节奏落后于计划",
    impact: "项目 IRR 敏感度约 ±1.8 个百分点",
    signal: "Mission 2 拨付进度较原计划滞后一个季度",
    ask: "财务模型按无补贴情形进行压力测试",
  },
];

const actions = [
  {
    when: "本周内",
    title: "确定进入模式：优先软件出口，暂缓重资产持有",
    owner: "投委会",
    need: "需决策层审定",
    state: "pending",
  },
  {
    when: "2 周内",
    title: "委托本地律所出具外资审查预判意见",
    owner: "法务 + 交付团队",
    need: "预算约 € 3.5 万",
    state: "pending",
  },
  {
    when: "1 个月内",
    title: "接触 1 家大区级公用事业，验证采购入口可行性",
    owner: "BD 团队",
    need: "需高层出面背书",
    state: "pending",
  },
  {
    when: "已完成",
    title: "完成意大利市场基本盘与制度流程建档",
    owner: "研究团队",
    need: "证据等级 A · 32 条来源",
    state: "done",
  },
];

const readingPath = [
  { time: "3 分钟", label: "本页决策简报", desc: "市场概况、风险提示与下一步" },
  { time: "5 分钟", label: "风险清单 Top 3", desc: "核对结论与证据强度" },
  { time: "5 分钟", label: "进入策略", desc: "准入条件与接触顺序" },
  { time: "2 分钟", label: "提交 Issue", desc: "将疑问转为研究任务" },
];

export function ExecBriefView() {
  return (
    <section className="view-panel brief-view">
      <div className="brief-hero">
        <div className="brief-hero-main">
          <span className="section-kicker">决策简报</span>
          <h2>建议以软件与运营服务方式进入，暂缓重资产持有</h2>
          <p>意大利充电市场需求成立、政策窗口仍在开放期，但外资审查边界与地方许可节奏构成两项前置不确定性。建议采取轻资产路径进入，以 6 个月为期验证采购入口，再评估是否追加投入。</p>
          <div className="brief-hero-meta">
            <span><Sparkles size={13} /> AI 汇总 · 人工复核</span>
            <span><Clock3 size={13} /> 更新于 2026.08.05</span>
            <span><FileSearch size={13} /> 支撑证据 32 条</span>
          </div>
        </div>
        <div className="brief-hero-side">
          <div className="brief-gauge">
            <span className="brief-gauge-value">64</span>
            <span className="brief-gauge-label">风险温度 / 100</span>
          </div>
          <div className="brief-gauge-note"><TrendingUp size={13} /> 较上季度 ↑ 6.4</div>
        </div>
      </div>

      <div className="brief-columns">
        <div className="brief-block">
          <div className="brief-block-head">
            <span className="brief-step">01</span>
            <div><h3>市场概况</h3><p>四项关键指标与三条核心判断。</p></div>
          </div>
          <div className="brief-snapshot">
            {snapshot.map((item) => (
              <div className="brief-snap-card" key={item.label}>
                <span className="brief-snap-label">{item.label}</span>
                <strong>{item.value}</strong>
                <span className="brief-snap-note">{item.note}</span>
              </div>
            ))}
          </div>
          <ul className="brief-points">
            {verdictPoints.map((point) => (
              <li key={point}><Gauge size={14} />{point}</li>
            ))}
          </ul>
        </div>

        <div className="brief-block">
          <div className="brief-block-head">
            <span className="brief-step brief-step-warn">02</span>
            <div><h3>风险提示</h3><p>影响决策的三项主要风险，其余在风险清单中持续跟踪。</p></div>
          </div>
          <div className="brief-alerts">
            {alerts.map((alert) => (
              <article className={`brief-alert brief-alert-${alert.level === "高" ? "high" : "medium"}`} key={alert.title}>
                <div className="brief-alert-top">
                  <span className="brief-alert-level">{alert.level}</span>
                  <h4>{alert.title}</h4>
                </div>
                <dl className="brief-alert-body">
                  <div><dt><AlertTriangle size={12} /> 影响</dt><dd>{alert.impact}</dd></div>
                  <div><dt><ShieldAlert size={12} /> 依据</dt><dd>{alert.signal}</dd></div>
                  <div><dt><Flag size={12} /> 建议</dt><dd>{alert.ask}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="brief-block brief-block-wide">
        <div className="brief-block-head">
          <span className="brief-step brief-step-action">03</span>
          <div><h3>下一步</h3><p>逐项列明时限、责任方与所需决策层级。</p></div>
        </div>
        <div className="brief-actions">
          {actions.map((action) => (
            <div className={`brief-action ${action.state === "done" ? "brief-action-done" : ""}`} key={action.title}>
              <span className="brief-action-when">{action.when}</span>
              <div className="brief-action-copy">
                <strong>{action.title}</strong>
                <span>{action.owner} · {action.need}</span>
              </div>
              {action.state === "done"
                ? <span className="brief-action-state state-done"><CheckCircle2 size={14} /> 已完成</span>
                : <span className="brief-action-state state-pending">待推进 <ArrowUpRight size={13} /></span>}
            </div>
          ))}
        </div>
      </div>

      <div className="brief-path">
        <div className="brief-path-head"><h3>决策层 15 分钟阅读动线</h3><span>建议阅读顺序</span></div>
        <div className="brief-path-steps">
          {readingPath.map((step, index) => (
            <div className="brief-path-step" key={step.label}>
              <span className="brief-path-index">{index + 1}</span>
              <strong>{step.label}</strong>
              <span className="brief-path-desc">{step.desc}</span>
              <span className="brief-path-time">{step.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
