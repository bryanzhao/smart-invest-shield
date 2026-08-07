import { useMemo, useState } from "react";
import { ArrowUpRight, BookMarked, Filter, ShieldAlert } from "lucide-react";

type CaseItem = {
  id: string;
  title: string;
  investor: string;
  origin: "中国企业" | "其他国家企业";
  geo: "意大利" | "欧洲其他";
  sector: "能源" | "新能源" | "电动汽车" | "基础设施";
  riskType: string;
  year: string;
  outcome: "被否决 / 撤回" | "附条件通过" | "延期与成本上升" | "运营受限";
  summary: string;
  lesson: string;
  source: string;
  grade: "A" | "B" | "C";
};

const cases: CaseItem[] = [
  {
    id: "C-IT-01",
    title: "轮胎制造并购触发 Golden Power 附条件批准",
    investor: "中国化工 · Pirelli",
    origin: "中国企业",
    geo: "意大利",
    sector: "基础设施",
    riskType: "外资审查",
    year: "2015–2023",
    outcome: "附条件通过",
    summary: "交易获批但被附加技术与治理条件，后续在董事会安排与技术转移上持续受到监管关注。",
    lesson: "在意大利，控制权结构与技术归属是审查焦点；交易结构需要预留可让步空间。",
    source: "Presidenza del Consiglio 公告 / 公司公告",
    grade: "A",
  },
  {
    id: "C-IT-02",
    title: "电网关键资产入股被要求降低表决权",
    investor: "国家电网 · CDP Reti",
    origin: "中国企业",
    geo: "意大利",
    sector: "能源",
    riskType: "关键基础设施 / 治理限制",
    year: "2014 至今",
    outcome: "运营受限",
    summary: "少数股权获准，但在治理参与、信息获取与后续增持上受到明确边界约束。",
    lesson: "能源网络类资产更可能被划入关键基础设施，少数股权是更现实的进入路径。",
    source: "监管备案 / 公开财报",
    grade: "A",
  },
  {
    id: "C-IT-03",
    title: "半导体资产出售被政府直接否决",
    investor: "其他国家买方 · LPE 案",
    origin: "其他国家企业",
    geo: "意大利",
    sector: "基础设施",
    riskType: "外资审查",
    year: "2021",
    outcome: "被否决 / 撤回",
    summary: "政府以国家安全为由行使否决权，交易未能完成，买方前期投入无法回收。",
    lesson: "存在“直接否决”而非仅附条件的先例，需在交割条件中设置审查失败退出机制。",
    source: "Gazzetta Ufficiale / 媒体报道",
    grade: "A",
  },
  {
    id: "C-IT-04",
    title: "地方许可与并网延迟拖慢充电网络扩张",
    investor: "多家欧洲充电运营商",
    origin: "其他国家企业",
    geo: "意大利",
    sector: "新能源",
    riskType: "许可 / 并网流程",
    year: "2022–2025",
    outcome: "延期与成本上升",
    summary: "大区与市镇双层审批口径不一致，直流站点从选址到通电普遍超出计划 6–12 个月。",
    lesson: "站点交付节奏应按大区分别建模，不能用全国平均值做投资回报假设。",
    source: "MOTUS-E 行业报告",
    grade: "B",
  },
  {
    id: "C-EU-01",
    title: "补贴细则调整导致回报模型重估",
    investor: "西班牙 / 德国新能源投资方",
    origin: "其他国家企业",
    geo: "欧洲其他",
    sector: "新能源",
    riskType: "补贴政策变动",
    year: "2021–2024",
    outcome: "延期与成本上升",
    summary: "补贴额度与拨付节奏中途调整，已开工项目的现金流与 IRR 出现明显偏离。",
    lesson: "补贴不应作为基准情形的核心收益来源，需要做无补贴压力测试。",
    source: "各国主管部门公告",
    grade: "A",
  },
  {
    id: "C-EU-02",
    title: "港口与物流资产入股引发政治审查升级",
    investor: "中国远洋 · 汉堡港",
    origin: "中国企业",
    geo: "欧洲其他",
    sector: "基础设施",
    riskType: "政治与舆论",
    year: "2021–2023",
    outcome: "附条件通过",
    summary: "持股比例在政治压力下被压降，审批周期显著拉长并伴随持续舆论关注。",
    lesson: "政治舆论风险会独立于法律合规发生作用，需要提前准备本地沟通方案。",
    source: "德国联邦政府公告 / 媒体",
    grade: "A",
  },
  {
    id: "C-EU-03",
    title: "电动汽车反补贴调查改变市场准入成本",
    investor: "中国整车与电池企业",
    origin: "中国企业",
    geo: "欧洲其他",
    sector: "电动汽车",
    riskType: "贸易救济 / 关税",
    year: "2023–2026",
    outcome: "延期与成本上升",
    summary: "欧盟反补贴调查后加征关税，出口路径成本上升，部分企业转向本地化生产与合资。",
    lesson: "贸易政策变化会直接改写进入方式的优劣排序，本地化是主要对冲手段。",
    source: "欧盟委员会公告",
    grade: "A",
  },
  {
    id: "C-EU-04",
    title: "电池工厂本地化遭遇用工与环评阻力",
    investor: "亚洲电池企业 · 中东欧工厂",
    origin: "其他国家企业",
    geo: "欧洲其他",
    sector: "电动汽车",
    riskType: "环评 / 劳工合规",
    year: "2022–2025",
    outcome: "运营受限",
    summary: "环评补件、水资源使用争议与劳工用工模式争议共同导致投产推迟。",
    lesson: "本地化并不自动降低风险，环评与劳工合规是新的主要摩擦点。",
    source: "地方政府文件 / 行业媒体",
    grade: "B",
  },
];

const filters = {
  origin: ["全部", "中国企业", "其他国家企业"] as const,
  geo: ["全部", "意大利", "欧洲其他"] as const,
  sector: ["全部", "能源", "新能源", "电动汽车", "基础设施"] as const,
};

const outcomeTone: Record<CaseItem["outcome"], string> = {
  "被否决 / 撤回": "high",
  "附条件通过": "medium",
  "延期与成本上升": "medium",
  "运营受限": "low",
};

const sectors = ["能源", "新能源", "电动汽车", "基础设施"] as const;
const riskFamilies = ["外资审查", "补贴政策变动", "许可 / 并网流程", "贸易救济 / 关税", "政治与舆论", "环评 / 劳工合规"] as const;

export function CasebookView() {
  const [origin, setOrigin] = useState<string>("全部");
  const [geo, setGeo] = useState<string>("全部");
  const [sector, setSector] = useState<string>("全部");

  const filtered = useMemo(
    () =>
      cases.filter(
        (item) =>
          (origin === "全部" || item.origin === origin) &&
          (geo === "全部" || item.geo === geo) &&
          (sector === "全部" || item.sector === sector),
      ),
    [origin, geo, sector],
  );

  const heat = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cases) map.set(`${item.sector}|${item.riskType}`, (map.get(`${item.sector}|${item.riskType}`) ?? 0) + 1);
    return map;
  }, []);

  return (
    <section className="view-panel">
      <div className="view-intro">
        <div>
          <span className="section-kicker">案例参照 / RISK CASEBOOK</span>
          <h2>分门别类的风险案例库</h2>
          <p>用别人已经踩过的坑校准我们的假设：按主体来源、地域和行业检索可比案例与其真实结果。</p>
        </div>
        <button className="secondary-button"><Filter size={15} /> 导出可比案例</button>
      </div>

      <div className="casebook-filters">
        {([["主体来源", filters.origin, origin, setOrigin], ["发生地", filters.geo, geo, setGeo], ["行业", filters.sector, sector, setSector]] as const).map(
          ([label, options, value, setValue]) => (
            <div className="filter-row" key={label}>
              <span className="filter-label">{label}</span>
              <div className="filter-chips">
                {options.map((option) => (
                  <button key={option} className={`filter-chip ${value === option ? "filter-chip-active" : ""}`} onClick={() => setValue(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ),
        )}
        <div className="filter-count">{filtered.length} / {cases.length} 条可比案例</div>
      </div>

      <div className="casebook-layout">
        <div className="case-list">
          {filtered.map((item) => (
            <article className="case-card" key={item.id}>
              <div className="case-card-top">
                <span className="case-id">{item.id}</span>
                <span className="case-tag">{item.sector}</span>
                <span className="case-tag case-tag-muted">{item.geo}</span>
                <span className={`case-outcome outcome-${outcomeTone[item.outcome]}`}>{item.outcome}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="case-investor">{item.investor} · {item.year} · {item.origin}</p>
              <p>{item.summary}</p>
              <div className="case-lesson">
                <ShieldAlert size={15} />
                <span><strong>对本项目的启示：</strong>{item.lesson}</span>
              </div>
              <div className="case-footer">
                <span className={`evidence evidence-${item.grade.toLowerCase()}`}>证据 {item.grade}</span>
                <span className="case-risk-type">{item.riskType}</span>
                <span className="case-source">{item.source}</span>
                <ArrowUpRight size={15} />
              </div>
            </article>
          ))}
          {filtered.length === 0 ? <div className="case-empty">当前筛选条件下暂无已核验案例，可提交 Issue 请研究团队补充。</div> : null}
        </div>

        <aside className="case-side">
          <div className="case-heatmap">
            <div className="panel-topline"><span><BookMarked size={14} /> 行业 × 风险类型分布</span><span className="node-count">{cases.length} 例</span></div>
            <table className="heat-table">
              <thead>
                <tr>
                  <th />
                  {sectors.map((item) => <th key={item}>{item}</th>)}
                </tr>
              </thead>
              <tbody>
                {riskFamilies.map((family) => (
                  <tr key={family}>
                    <th scope="row">{family}</th>
                    {sectors.map((item) => {
                      const count = heat.get(`${item}|${family}`) ?? 0;
                      return <td key={item}><span className={`heat-cell heat-${Math.min(count, 3)}`}>{count > 0 ? count : ""}</span></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="case-note">案例数量只反映已收录范围，不等于真实发生频率；用于定位需要补充研究的空白格。</p>
          </div>

          <div className="case-takeaways">
            <div className="panel-topline"><span>跨案例共性结论</span></div>
            <ul>
              <li>关键基础设施类资产更容易触发审查，控制权比出资比例更敏感。</li>
              <li>补贴与关税是回报模型中波动最大的外生变量，需要做无补贴情形测试。</li>
              <li>本地化生产可对冲贸易风险，但会带来环评与劳工合规的新摩擦。</li>
              <li>政治舆论压力可独立于法律程序影响交易条件与时间表。</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
