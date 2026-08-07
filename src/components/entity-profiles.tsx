import { useState } from "react";
import { Building2, FileText, Factory, UserRound, GitPullRequest, Gauge, AlertTriangle, CheckCircle2 } from "lucide-react";

type Attr = { label: string; value?: string; grade?: "T1" | "T2" | "T3"; missing?: "可查未查" | "公开不可得" };

type EntityType = {
  id: string;
  name: string;
  icon: typeof Building2;
  scope: string;
  ask: string;
  sample: string;
  count: number;
  fill: number;
  attrs: Attr[];
};

const entityTypes: EntityType[] = [
  {
    id: "gov",
    name: "政府机构画像",
    icon: Building2,
    scope: "部委 / 独立监管机构 / 国企 / 市场运营机构",
    ask: "谁有批准与否决权，权力边界在哪，什么时候换届。",
    sample: "ARERA（能源网络与环境监管局）",
    count: 8,
    fill: 88,
    attrs: [
      { label: "法定名称与设立依据", value: "依意大利能源法设立的独立监管机构", grade: "T1" },
      { label: "法定职权清单", value: "输配电费率、服务质量标准、市场监管规则", grade: "T1" },
      { label: "管辖边界（不能管什么）", value: "MASE 定政策方向，ARERA 负责执行，互相制约", grade: "T1" },
      { label: "治理结构与换届时间", value: "新一届委员会 2026.01 经议会听证就任", grade: "T1" },
      { label: "决策流程", value: "咨询文件 → 征求意见 → 正式决议", grade: "T1" },
      { label: "现任关键人事", value: "主席及四名委员，任期至 2033", grade: "T1" },
      { label: "近期关键决议", value: "UVAM 聚合制度转向、TIDE 调度改革", grade: "T1" },
      { label: "内部审议记录", missing: "公开不可得" },
    ],
  },
  {
    id: "law",
    name: "法规政策画像",
    icon: FileText,
    scope: "EU 条例 / 指令 / 国家法律 / 监管决议",
    ask: "把法条翻译成合规成本、死线与采购需求窗口。",
    sample: "AFIR · Regulation (EU) 2023/1804",
    count: 14,
    fill: 82,
    attrs: [
      { label: "法规标识与生效日", value: "(EU) 2023/1804，2023.09.22 生效", grade: "T1" },
      { label: "立法层级", value: "条例（直接效力，无需转化）", grade: "T1" },
      { label: "核心义务清单", value: "四项强制义务，已拆解为可执行项", grade: "T1" },
      { label: "执行机构", value: "MASE 牵头，MIT 配合，GSE 执行招标", grade: "T1" },
      { label: "合规截止日", value: "2026.04 数据上报；2027.01 支付终端改造", grade: "T1" },
      { label: "合规成本转译", value: "推动 CPMS 升级与终端改造，形成刚性需求", grade: "T2" },
      { label: "修订 / 替换风险", value: "已生效，短期修订风险低", grade: "T2" },
      { label: "对投资的含义（强制标注）", value: "2026–2027 合规密集期＝合规驱动而非需求驱动的窗口", grade: "T2" },
    ],
  },
  {
    id: "corp",
    name: "企业画像",
    icon: Factory,
    scope: "在位竞争者 / 潜在合作方 / 合资主体",
    ask: "在位者会不会反击、能打多久、软肋在哪。",
    sample: "A2A S.p.A.（米兰 + 布雷西亚市政控股）",
    count: 21,
    fill: 67,
    attrs: [
      { label: "企业类型（决定竞争耐心）", value: "市政控股，两市各持 25%", grade: "T1" },
      { label: "股权结构与控制链", value: "股东协议续期至 2029.01；他方持股上限 5%", grade: "T1" },
      { label: "治理层与任命机制", value: "董事会由两市议会分别提名", grade: "T1" },
      { label: "价值链位置", value: "CPO ＋ 自有 CPMS 能力", grade: "T2" },
      { label: "资源边界", value: "公共采购程序约束 ＋ 地方政治可见度", grade: "T2" },
      { label: "关键财务与投资计划", value: "2025–2035 产业计划 160 亿欧元", grade: "T1" },
      { label: "与中国的关联", value: "无直接股权关联，采购层面有设备接触", grade: "T3" },
      { label: "竞争反应模式推断", value: "以网络控制为核心，轻资产软件非主攻方向", grade: "T3" },
      { label: "非公开子公司盈利结构", missing: "公开不可得" },
    ],
  },
  {
    id: "person",
    name: "人物画像（七段式）",
    icon: UserRound,
    scope: "监管负责人 / 企业 CEO / 关键议员 / 协会核心",
    ask: "头衔相同，决策自由度可能天差地别。",
    sample: "A2A CEO · Renato Mazzoncini",
    count: 17,
    fill: 54,
    attrs: [
      { label: "A · 基础身份与权力边界", value: "能独断什么？受股东协议与采购程序约束", grade: "T1" },
      { label: "B · 职业轨迹与行为模式", value: "铁路与公用事业背景，偏好长周期基建叙事", grade: "T2" },
      { label: "C · 与中国的关联", value: "区分个人态度与制度约束——后者更重要", grade: "T3" },
      { label: "D · 可利用触点", value: "能源转型 KPI、城市空气质量议题", grade: "T2" },
      { label: "E · 接触路径", value: "通过行业协会，以技术供应方身份切入", grade: "T3" },
      { label: "F · 反对预案", value: "预演“数据主权”质疑及消减话术", grade: "T3" },
      { label: "G · 证据等级与信息边界", value: "已核实 11 项，5 项标注待尽调", grade: "T1" },
      { label: "私人网络与非公开表态", missing: "公开不可得" },
    ],
  },
  {
    id: "process",
    name: "流程画像",
    icon: GitPullRequest,
    scope: "行政许可 / 资质获取 / 制度准入程序",
    ask: "从申请到获批的路径、时滞与最可能的卡点。",
    sample: "Golden Power 外资审查程序",
    count: 9,
    fill: 79,
    attrs: [
      { label: "法律依据", value: "2012 年第 21 号法令及后续修订", grade: "T1" },
      { label: "触发条件", value: "非 EU 实体收购战略资产或取得控制权", grade: "T1" },
      { label: "参与机构序列", value: "申报 → 总理府协调 → 部门意见 → 部长会议决定", grade: "T1" },
      { label: "各环节时滞", value: "法定 45 个工作日，可延长", grade: "T1" },
      { label: "否决 / 搁置节点", value: "关键基础设施认定、供应链来源审查", grade: "T1" },
      { label: "先例与判例", value: "不同进入模式的审查暴露度差异显著", grade: "T2" },
      { label: "可介入的合法接口", value: "申报材料技术说明、律师函回应环节", grade: "T2" },
      { label: "对投资的含义（强制标注）", value: "纯软件供应不触发；收购本地主体几乎必然触发并附条件", grade: "T2" },
      { label: "内部部门意见分歧", missing: "可查未查" },
    ],
  },
  {
    id: "mechanism",
    name: "机制制度画像",
    icon: Gauge,
    scope: "定价 / 结算 / 容量分配 / 激励机制",
    ask: "实际怎么运转、谁在赚钱、谁会亏钱。",
    sample: "MACSE 储能远期采购机制",
    count: 6,
    fill: 74,
    attrs: [
      { label: "运营机构", value: "Terna 组织拍卖，GME 提供市场平台", grade: "T1" },
      { label: "运作周期", value: "首轮 2025.09，第二轮 2026.11.24", grade: "T1" },
      { label: "参与条件", value: "新建锂电储能，限中南部、西西里、撒丁", grade: "T1" },
      { label: "定价与收益模型", value: "15 年固定价，首轮加权均价约 €12,959/MWh/年", grade: "T1" },
      { label: "历史演变轨迹", value: "容量溢价由 €70,000 降至 €47,000/MW/年", grade: "T1" },
      { label: "份额分布", value: "首轮约 70% 容量归于 Enel", grade: "T2" },
      { label: "对投资的含义（强制标注）", value: "出清价极低＝资产方利润被挤压，对收益优化工具付费意愿上升", grade: "T3" },
      { label: "未公开的拍卖投标明细", missing: "公开不可得" },
    ],
  },
];

const relationTypes = [
  { type: "监管", path: "ARERA → Terna / CPO", note: "制定须遵循的费率与服务质量标准" },
  { type: "执行", path: "GSE → PNRR 充电项目", note: "招标与资金拨付的执行机构" },
  { type: "出资", path: "MEF → Enel / Eni / Terna", note: "国家资本持股决定竞争耐心" },
  { type: "任命", path: "两市议会 → A2A 董事会", note: "地方政治直接进入公司治理" },
  { type: "竞争", path: "Enel X Way ↔ Plenitude / A2A", note: "四类运营商并行竞争" },
  { type: "漫游互通", path: "Enel X Way ↔ Plenitude", note: "网络互通协议改变客户获取路径" },
  { type: "人员流转", path: "Terna CEO → ENI 主席", note: "同日任命，监管与产业界人事互通" },
  { type: "触发审查", path: "企业收购 → Golden Power", note: "交易结构直接决定审查暴露度" },
];

export const entityTypeNav = entityTypes.map((item) => ({ id: item.id, name: item.name, icon: item.icon }));

export function EntityProfilesView({ typeId, onTypeChange }: { typeId?: string | undefined; onTypeChange?: ((id: string) => void) | undefined } = {}) {
  const [internal, setInternal] = useState(entityTypes[0]!.id);
  const active = typeId ?? internal;
  const setActive = (id: string) => { setInternal(id); onTypeChange?.(id); };
  const current = entityTypes.find((item) => item.id === active) ?? entityTypes[0]!;
  const filled = current.attrs.filter((attr) => !attr.missing);
  const gaps = current.attrs.filter((attr) => attr.missing);

  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">实体画像 / STRUCTURED PROFILING</span>
          <h2>六类实体 × 标准属性模板</h2>
          <p>每类决策相关实体按固定模板采集属性，属性空白本身就是信息质量指示器，不用推测填充。</p>
        </div>
        <div className="tier-legend">
          <span className="tier tier-1">T1 一手原文</span>
          <span className="tier tier-2">T2 权威二手</span>
          <span className="tier tier-3">T3 区间参考</span>
        </div>
      </div>

      <div className="entity-type-strip">
        {entityTypes.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`entity-type-card ${active === item.id ? "entity-type-active" : ""}`} onClick={() => setActive(item.id)}>
              <span className="entity-type-icon"><Icon size={16} /></span>
              <strong>{item.name}</strong>
              <small>{item.count} 个实体 · 填充率 {item.fill}%</small>
              <span className="entity-fill-track"><i style={{ width: `${item.fill}%` }} /></span>
            </button>
          );
        })}
      </div>

      <div className="entity-detail">
        <div className="entity-template">
          <div className="panel-topline">
            <span>{current.name} · 属性模板</span>
            <span className="node-count">示例：{current.sample}</span>
          </div>
          <p className="entity-scope"><strong>适用范围：</strong>{current.scope}</p>
          <p className="entity-ask"><strong>核心追问：</strong>{current.ask}</p>
          <ul className="attr-list">
            {filled.map((attr) => (
              <li key={attr.label}>
                <CheckCircle2 size={14} className="attr-ok" />
                <div><strong>{attr.label}</strong><span>{attr.value}</span></div>
                <span className={`tier tier-${attr.grade?.slice(1)}`}>{attr.grade}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="entity-side">
          <div className="gap-panel">
            <div className="panel-topline"><span><AlertTriangle size={14} /> 信息缺口显性化</span><span className="node-count">{gaps.length} 项</span></div>
            <ul className="gap-list">
              {gaps.map((gap) => (
                <li key={gap.label}>
                  <span className={`gap-tag ${gap.missing === "可查未查" ? "gap-actionable" : "gap-structural"}`}>{gap.missing}</span>
                  {gap.label}
                </li>
              ))}
            </ul>
            <p className="case-note">「可查未查」可通过追加研究补齐；「公开不可得」是结构性缺口，只能靠实地尽调，须在结论中下调置信度。</p>
          </div>

          <div className="confidence-legend">
            <div className="panel-topline"><span>四档证据置信度</span></div>
            <ul>
              <li><span className="conf conf-high">高</span>双源独立印证，无矛盾</li>
              <li><span className="conf conf-mid">中</span>单源，但来自 T1 一手原文</li>
              <li><span className="conf conf-conflict">冲突</span>多源互斥，并列呈现不裁定</li>
              <li><span className="conf conf-unknown">待尽调</span>无可靠公开来源</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="relation-table-block">
        <div className="panel-topline"><span>实体关系类型（八种可追溯关系）</span><span className="node-count">{relationTypes.length} 类</span></div>
        <div className="relation-table">
          {relationTypes.map((item) => (
            <div className="relation-row" key={item.type}>
              <span className="relation-type">{item.type}</span>
              <span className="mono-text">{item.path}</span>
              <span className="relation-note">{item.note}</span>
            </div>
          ))}
        </div>
        <p className="case-note">关系不是装饰：从「MEF 持股 Enel」＋「国家资本考核含政治任务」两条属性出发，才能推出「Enel 的亏损承受期远长于财务回报周期」这类可被复现和挑战的判断。</p>
      </div>
    </section>
  );
}
