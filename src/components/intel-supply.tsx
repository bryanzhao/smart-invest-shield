import { useMemo, useState } from "react";
import { CheckCircle2, FileStack, FileText, Lightbulb, MessagesSquare, Send, ShieldAlert, Upload } from "lucide-react";

type Channel = {
  id: string;
  name: string;
  role: string;
  strength: string;
  limit: string;
  coverage: number;
  kind: "osint" | "paid" | "human";
};

const channels: Channel[] = [
  {
    id: "c1",
    name: "开源情报 OSINT",
    role: "打底：建立结构、锁定问题、判断哪里有缺口",
    strength: "覆盖广、可复核、可持续跟踪、成本近乎为零",
    limit: "只能回答「已被公开表达过」的问题；意图、内部博弈、未公开条款拿不到",
    coverage: 78,
    kind: "osint",
  },
  {
    id: "c2",
    name: "付费闭源情报",
    role: "补齐：结构化数据、行业数据库、尽调报告",
    strength: "数据口径统一、时间序列完整、可直接进模型",
    limit: "结论常滞后、口径受供应商方法论限制、无法定制到单一标的",
    coverage: 41,
    kind: "paid",
  },
  {
    id: "c3",
    name: "人力情报 HUMINT",
    role: "定点：意图、时间表、谁能拍板、真实底线",
    strength: "唯一能回答「他们打算怎么做」的渠道",
    limit: "样本极小、带立场偏差、必须交叉验证、合规与成本约束强",
    coverage: 22,
    kind: "human",
  },
  {
    id: "c4",
    name: "客户自有情报",
    role: "校准：一线体感、内部往来、历史交手记录",
    strength: "时效最强、贴近真实交易面、无额外采集成本",
    limit: "零散、口语化、缺来源标注，需要结构化后才能进入证据链",
    coverage: 34,
    kind: "human",
  },
];

type Intake = {
  id: string;
  icon: typeof FileStack;
  title: string;
  desc: string;
  example: string;
  handling: string;
};

const intakes: Intake[] = [
  {
    id: "bulk",
    icon: FileStack,
    title: "批量文档挖掘",
    desc: "一批未整理的资料：邮件、会议纪要、投标文件、历史尽调包。",
    example: "「这是过去两年和意方往来的 300 份文件，看看有什么。」",
    handling: "AI 抽取实体与事件 → 落到六类实体画像 → 标注冲突与缺口",
  },
  {
    id: "report",
    icon: FileText,
    title: "定向报告导入",
    desc: "已购买的第三方报告、律所备忘录、内部投委材料。",
    example: "「这是某咨询公司出的意大利充电市场报告。」",
    handling: "拆成可引用事实条目 → 标注信源等级与发布时点 → 与开源结论对撞",
  },
  {
    id: "lead",
    icon: Lightbulb,
    title: "分析师线索 / 灵感",
    desc: "一两句尚未验证的假设，不需要证据，只需要方向。",
    example: "「我怀疑这家公司的实控人换了，但查不到。」",
    handling: "转为待验证命题 → 派生检索路径 → 无法闭合时升级为采购需求",
  },
  {
    id: "field",
    icon: MessagesSquare,
    title: "一线口头情报",
    desc: "销售、BD、驻外人员从前方带回的只言片语。",
    example: "「对方采购说他们年底前不会签任何新框架。」",
    handling: "登记为 T3 未验证 → 触发交叉验证任务 → 验证后升级信源等级",
  },
];

type Ask = {
  id: string;
  question: string;
  why: string;
  osint: string;
  need: string;
  vendor: string;
  cost: string;
  eta: string;
  priority: "P0" | "P1" | "P2";
};

const asks: Ask[] = [
  {
    id: "a1",
    question: "在位者对核心城市充电资产的持有底线与出售意愿？",
    why: "决定「正面竞争 vs 合资进入」的路线选择，是首要分叉点。",
    osint: "公开渠道仅有年报口径的资产规模，无处置意向。",
    need: "人力情报：接近资产管理层的行业访谈 2–3 人次",
    vendor: "本地专家网络 / 行业猎头型访谈平台",
    cost: "€8k–15k",
    eta: "3–4 周",
    priority: "P0",
  },
  {
    id: "a2",
    question: "外资审查中针对纯软件供应的实际审查尺度？",
    why: "决定隔离架构是否足以规避审查，影响交易结构设计。",
    osint: "只有汇总统计，个案理由不公开。",
    need: "付费闭源：本地律所的非公开个案经验备忘",
    vendor: "意大利本地公司法 / 外资审查方向律所",
    cost: "€10k–20k",
    eta: "2–3 周",
    priority: "P0",
  },
  {
    id: "a3",
    question: "标的公司真实实控人与股权代持关系？",
    why: "关系到合约可执行性与退出时的优先购买权触发。",
    osint: "工商登记止于两层，再上层为境外壳体。",
    need: "第三方调研：跨境股权穿透与背景调查",
    vendor: "国际风险咨询公司（Kroll 类）",
    cost: "€12k–25k",
    eta: "4–6 周",
    priority: "P1",
  },
  {
    id: "a4",
    question: "关键决策者对华态度的近期私下表述？",
    why: "政策突变风险维度的置信度当前仅为「中」，需上调或下调。",
    osint: "公开发言口径高度模板化，信息量低。",
    need: "人力情报：政策圈层背景访谈 1–2 人次",
    vendor: "布鲁塞尔 / 罗马政策事务顾问",
    cost: "€6k–12k",
    eta: "3 周",
    priority: "P1",
  },
  {
    id: "a5",
    question: "同类合资项目的实际退出周期与折价区间？",
    why: "退出风险目前用的是行业经验值，缺可比交易数据。",
    osint: "交易对价多未披露。",
    need: "付费闭源：并购交易数据库定制拉取",
    vendor: "交易数据库供应商 / 财务顾问",
    cost: "€4k–8k",
    eta: "1–2 周",
    priority: "P2",
  },
];

const intakeTypeLabels: Record<string, string> = {
  bulk: "批量文档",
  report: "定向报告",
  lead: "分析师线索",
  field: "一线口头情报",
};

export function IntelSupplyView() {
  const [type, setType] = useState<string>("lead");
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState("未验证");
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState<"all" | "P0" | "P1" | "P2">("all");

  const shown = useMemo(() => (filter === "all" ? asks : asks.filter((a) => a.priority === filter)), [filter]);
  const totalLow = asks.filter((a) => a.priority !== "P2").length;

  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">情报补给 / INTELLIGENCE SUPPLY</span>
          <h2>开源情报 × 闭源情报 × 客户自有情报</h2>
          <p>开源情报负责搭骨架并暴露缺口；客户手里的零散情报负责校准；剩下真正拿不到的部分，明确转成对付费闭源与人力情报的采购需求。</p>
        </div>
        <div className="tier-legend">
          <span className="tier tier-1">OSINT 打底</span>
          <span className="tier tier-3">缺口 → 采购</span>
        </div>
      </div>

      <div className="supply-grid">
        {channels.map((c) => (
          <article className={`supply-card supply-${c.kind}`} key={c.id}>
            <header>
              <strong>{c.name}</strong>
              <span className="supply-cov">覆盖 {c.coverage}%</span>
            </header>
            <div className="supply-bar"><i style={{ width: `${c.coverage}%` }} /></div>
            <p className="supply-role">{c.role}</p>
            <div className="supply-lines">
              <p><span>能做到</span>{c.strength}</p>
              <p><span>做不到</span>{c.limit}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="supply-split">
        <div className="intake-panel">
          <div className="panel-head">
            <h3><Upload size={15} /> 客户情报投递入口</h3>
            <span>四种形态都收，不要求结构化，不要求一一对应</span>
          </div>

          <div className="intake-types">
            {intakes.map((item) => {
              const Icon = item.icon;
              const active = type === item.id;
              return (
                <button key={item.id} className={`intake-type ${active ? "intake-active" : ""}`} onClick={() => { setType(item.id); setSent(false); }}>
                  <Icon size={15} />
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                  <em>{item.example}</em>
                  <p className="intake-handling">{item.handling}</p>
                </button>
              );
            })}
          </div>

          <div className="intake-form">
            <label>
              <span>情报内容（可以只有一句话）</span>
              <textarea
                rows={3}
                value={text}
                placeholder={intakes.find((i) => i.id === type)?.example ?? ""}
                onChange={(event) => { setText(event.target.value); setSent(false); }}
              />
            </label>
            <div className="intake-row">
              <label>
                <span>可信度自评</span>
                <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
                  <option>未验证</option>
                  <option>单一来源</option>
                  <option>多方印证</option>
                  <option>内部确认</option>
                </select>
              </label>
              <label className="intake-upload">
                <span>附件</span>
                <div className="upload-drop"><Upload size={14} /> 拖入文档或点击上传（PDF / DOCX / EML / XLSX）</div>
              </label>
            </div>
            <div className="intake-actions">
              <span className="intake-tag">类型：{intakeTypeLabels[type]}</span>
              <button className="primary-button" onClick={() => setSent(true)} disabled={!text.trim()}>
                <Send size={14} /> 提交情报
              </button>
            </div>
            {sent ? (
              <p className="intake-done"><CheckCircle2 size={14} /> 已登记为「{intakeTypeLabels[type]} · {confidence}」，将进入实体画像抽取与交叉验证队列，验证结果会回写到对应风险维度。</p>
            ) : null}
          </div>
        </div>

        <div className="ask-panel">
          <div className="panel-head">
            <h3><ShieldAlert size={15} /> 闭源 / 人力情报求助清单</h3>
            <span>{totalLow} 项高优先级缺口，开源渠道已判定不可闭合</span>
          </div>
          <div className="ask-filter">
            {(["all", "P0", "P1", "P2"] as const).map((p) => (
              <button key={p} className={filter === p ? "chip chip-active" : "chip"} onClick={() => setFilter(p)}>
                {p === "all" ? "全部" : p}
              </button>
            ))}
          </div>
          <div className="ask-list">
            {shown.map((a) => (
              <article className={`ask-card ask-${a.priority.toLowerCase()}`} key={a.id}>
                <header>
                  <span className={`ask-pri pri-${a.priority.toLowerCase()}`}>{a.priority}</span>
                  <strong>{a.question}</strong>
                </header>
                <p className="ask-why">{a.why}</p>
                <p className="ask-osint">开源已尽：{a.osint}</p>
                <div className="ask-need">{a.need}</div>
                <dl className="ask-meta">
                  <div><dt>建议供应商</dt><dd>{a.vendor}</dd></div>
                  <div><dt>预算区间</dt><dd>{a.cost}</dd></div>
                  <div><dt>交付周期</dt><dd>{a.eta}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="discipline-bar">
        <div><strong>先穷尽开源</strong><span>只有当公开渠道被判定不可闭合，才提出付费与人力情报需求。</span></div>
        <div><strong>缺口即需求</strong><span>每一项采购需求都指向一个具体待验证命题，而非泛泛的「了解市场」。</span></div>
        <div><strong>来源分级不合并</strong><span>客户口头情报默认 T3，交叉验证通过后才升级。</span></div>
        <div><strong>成本对齐价值</strong><span>采购预算与该缺口影响的决策金额挂钩，低影响缺口保留为已知未知。</span></div>
      </div>
    </section>
  );
}
