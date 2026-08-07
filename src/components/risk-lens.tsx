import { useState } from "react";
import { ArrowRight, Eye, Siren, ShieldQuestion } from "lucide-react";

type Dimension = {
  id: string;
  name: string;
  question: string;
  inputs: string[];
  path: string;
  judgement: string;
  confidence: "高" | "中" | "冲突" | "待尽调";
  counter: string;
  warning: string;
  discipline: string;
  level: "high" | "medium" | "low";
  score: number;
};

const dimensions: Dimension[] = [
  {
    id: "d1",
    name: "制度风险",
    question: "规则会往哪个方向变，窗口有多长？",
    inputs: ["法规画像 · 合规截止日", "政府机构画像 · 换届时间", "人物画像 · 新任政策倾向"],
    path: "合规死线 ＋ 监管换届 ＋ 决策者倾向 → 判断制度演变方向与时间窗口",
    judgement: "2026–2027 为合规密集期，制度仍在改革中，进入者尚不能直接受益。",
    confidence: "中",
    counter: "若新一届监管在半年内未发布配套实施细则，说明改革节奏被高估。",
    warning: "监管咨询文件征求意见期延长超过 60 天。",
    discipline: "区分「制度已开放 / 正在改革中 / 进入者能直接受益」三种状态——混淆是最昂贵的错误。",
    level: "high",
    score: 74,
  },
  {
    id: "d2",
    name: "在位者反击风险",
    question: "他们会不会打、能打多久？",
    inputs: ["企业画像 · 资本结构", "人物画像 · 决策风格", "机制画像 · 收益分配"],
    path: "资本结构 → 竞争耐心 → 反击形式与持续性",
    judgement: "国家与市政资本系竞争耐心极长，正面拼重资产网络持有必然失败。",
    confidence: "高",
    counter: "若在位者在核心区域出售充电资产，说明其耐心假设不成立。",
    warning: "在位者启动轻资产软件对外授权，意味着直接进入我方赛道。",
    discipline: "不与对手的强项对齐，与对手的约束对齐；要求拼耐力的方案应在早期排除。",
    level: "high",
    score: 69,
  },
  {
    id: "d3",
    name: "政策突变风险",
    question: "对华政策收紧的概率与方向？",
    inputs: ["人物画像 · 对华态度演变", "企业画像 · 涉华关联记录", "机制画像 · 制度演变轨迹"],
    path: "决策者态度 ＋ 涉华关联 ＋ 制度轨迹 → 收紧概率与作用面",
    judgement: "总体「保持接触但设防」，收紧更可能作用于控制权与数据，而非贸易本身。",
    confidence: "中",
    counter: "若出现针对纯软件供应的新增申报义务，说明作用面判断错误。",
    warning: "议会层面出现针对非欧盟软件供应商的听证提案。",
    discipline: "隔离架构（欧盟法人 ＋ 数据本地化 ＋ IP 不回流）是结构性对冲，不是公关策略。",
    level: "high",
    score: 66,
  },
  {
    id: "d4",
    name: "合约可执行性风险",
    question: "权利受损时，救济要多久、成功率多少？",
    inputs: ["流程画像 · 审查先例", "政府机构画像 · 司法路径"],
    path: "审查先例 ＋ 行政法院裁量边界 → 救济周期与成功率",
    judgement: "行政救济周期普遍 18–30 个月，胜诉多为程序性纠正而非实体推翻。",
    confidence: "中",
    counter: "若近两年出现实体性推翻监管决定的判例，则该判断需上调。",
    warning: "合同对方启动单方条款变更且拒绝仲裁条款。",
    discipline: "救济成本必须计入基准情形，不能作为例外处理。",
    level: "medium",
    score: 52,
  },
  {
    id: "d5",
    name: "退出风险",
    question: "想走的时候，走得掉吗、代价多大？",
    inputs: ["企业画像 · 标的资本结构", "流程画像 · 资本管制与审批"],
    path: "标的股权结构 ＋ 转让审批 → 退出流动性与折价",
    judgement: "合资少数股权退出受优先购买权与再审查约束，预留 12–18 个月退出期。",
    confidence: "中",
    counter: "若同类资产近期出现快速二级转让，说明流动性被低估。",
    warning: "潜在买方池收窄至仅剩在位者。",
    discipline: "四种进入模式必须在「可逆性与退出成本」维度上被并列比较。",
    level: "medium",
    score: 48,
  },
  {
    id: "d6",
    name: "信息不对称风险",
    question: "我们的判断本身有多可信？",
    inputs: ["六类实体 · 属性填充率", "缺口类型分布"],
    path: "填充率 ＋ 关键属性空白位置 → 整体结论置信度调整",
    judgement: "人物与非上市企业画像填充率偏低（54% / 67%），整体结论置信度下调一档。",
    confidence: "冲突",
    counter: "补齐两类画像后若结论不变，说明缺口不影响主判断。",
    warning: "任一实体类型填充率跌破 50% 且空白多于填充项。",
    discipline: "「可查未查」与「公开渠道不可得」是两件完全不同的事，必须分开统计。",
    level: "medium",
    score: 45,
  },
  {
    id: "d7",
    name: "叙事与认知风险",
    question: "哪个公共议题最可能反噬我们？",
    inputs: ["法规画像 · NIS2 / GDPR", "企业画像 · 涉华关联", "人物画像 · 议题敏感度"],
    path: "数据与网络安全规则 ＋ 涉华关联 ＋ 决策者敏感度 → 最敏感议题排序",
    judgement: "「数据出境」是最敏感议题，其次是关键基础设施远程可控性。",
    confidence: "高",
    counter: "若本地媒体在同类项目上未跟进数据议题，说明敏感度被高估。",
    warning: "主流媒体首次将本项目与「基础设施安全」并列报道。",
    discipline: "叙事攻防的胜负在结构不在公关：治理透明、数据本地、技术可验证的组织形态，审查烈度完全不同。",
    level: "low",
    score: 38,
  },
];

export function RiskLensView() {
  const [open, setOpen] = useState<string>(dimensions[0]!.id);

  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">风险透镜 / SEVEN LENSES</span>
          <h2>七个风险分析维度</h2>
          <p>各维度均标注：输入的实体画像、推演路径、结论、反证信号，以及止损前的预警阈值。</p>
        </div>
        <div className="tier-legend">
          <span className="tier tier-1">输入＝实体画像</span>
          <span className="tier tier-3">输出＝可挑战的判断</span>
        </div>
      </div>

      <div className="lens-list">
        {dimensions.map((item, index) => {
          const expanded = open === item.id;
          return (
            <article className={`lens-card lens-${item.level} ${expanded ? "lens-open" : ""}`} key={item.id}>
              <button className="lens-head" onClick={() => setOpen(expanded ? "" : item.id)}>
                <span className="lens-index">维度 {String(index + 1).padStart(2, "0")}</span>
                <div className="lens-title">
                  <strong>{item.name}</strong>
                  <span>{item.question}</span>
                </div>
                <span className={`conf conf-${item.confidence === "高" ? "high" : item.confidence === "中" ? "mid" : item.confidence === "冲突" ? "conflict" : "unknown"}`}>{item.confidence}</span>
                <span className={`risk-score score-${item.level}`}>{item.score}</span>
              </button>

              {expanded ? (
                <div className="lens-body">
                  <div className="lens-chain">
                    {item.inputs.map((input) => <span className="chain-node" key={input}>{input}</span>)}
                    <ArrowRight size={14} className="chain-arrow" />
                    <span className="chain-node chain-output">{item.name}判断</span>
                  </div>
                  <p className="lens-path">{item.path}</p>
                  <div className="lens-judgement"><strong>当前判断</strong><p>{item.judgement}</p></div>
                  <div className="lens-grid">
                    <div className="lens-box lens-counter"><span><ShieldQuestion size={14} /> 反证信号</span><p>{item.counter}</p></div>
                    <div className="lens-box lens-warning"><span><Siren size={14} /> 早期预警</span><p>{item.warning}</p></div>
                    <div className="lens-box lens-discipline"><span><Eye size={14} /> 纪律</span><p>{item.discipline}</p></div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="discipline-bar">
        <div><strong>信息缺口显性化</strong><span>属性空白汇总为决策的认知约束，不用推测填充。</span></div>
        <div><strong>可验证的相反信号</strong><span>每条判断都标注「如果错了，我应该看到什么」。</span></div>
        <div><strong>制度翻译</strong><span>每段制度分析结尾强制回答「这对投资意味着什么」。</span></div>
        <div><strong>独立调研</strong><span>不采用外部指数的现成评分，只借用其维度清单。</span></div>
      </div>
    </section>
  );
}
