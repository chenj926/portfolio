// Small still diagrams of how a method or a system is put together, drawn in the page's ink with the
// wintersweet gold on the one path that matters. Every label is live text, sized so it reads at 13px or more
// where the tile is narrowest on a desktop (the viewBox is drawn near 1:1 at 360px wide).
type Node = { x: number; y: number; w: number; h: number; label: string; sub?: string; hot?: boolean };

function Box({ x, y, w, h, label, sub, hot }: Node) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} className={hot ? "dg-node dg-node--key" : "dg-node"} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle" className="dg-label">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="dg-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

function Wire({ d, hot, thin }: { d: string; hot?: boolean; thin?: boolean }) {
  return (
    <path
      d={d}
      className={`dg-wire${hot ? " dg-wire--key" : ""}${thin ? " dg-wire--thin" : ""}`}
      markerEnd={thin ? undefined : hot ? "url(#dg-head-key)" : "url(#dg-head)"}
    />
  );
}

function Defs() {
  return (
    <defs>
      <marker id="dg-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 8 4 0 8z" className="dg-head" />
      </marker>
      <marker id="dg-head-key" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 8 4 0 8z" className="dg-head dg-head--key" />
      </marker>
    </defs>
  );
}

const labels = {
  roles: "RA-BOUU: decision, execution and environment inputs feed a Gaussian-process model of expected deployment performance, whose acquisition picks the next simulator run.",
  surgical: "Surgical DeltaNet: a learned row scope decides which rows of the state a token's update may erase and write; the other rows are held exactly, and the readout queries the state.",
  "clean-architecture": "Clean Architecture: entities at the centre, then use cases, interface adapters, and Spring and React outside.",
  multimodal: "Tables, PDF text through MiniLM and images through CLIP join in one ensemble that scores risk.",
  case: "A $78M market expansion budget; the plan placed first.",
  audit: "The XR capstone: the Quest 3 scans the site once and the workstation builds a labeled 3D map; two AprilTags relocalize each later visit, and an LLM summarizes the spoken notes for each machine.",
} as const;

export type DiagramId = keyof typeof labels;

/** focus: the labels to light (a step of a section); without it, the diagram's own key boxes */
export function Diagram({ id, focus }: { id: DiagramId; focus?: string[] }) {
  const B = (n: Node) => Box({ ...n, hot: focus ? focus.includes(n.label) : n.hot });
  return (
    <svg className="diagram" viewBox="0 0 360 270" role="img" aria-label={labels[id]} preserveAspectRatio="xMidYMid meet">
      <Defs />
      {id === "roles" && (
        <>
          <B x={8} y={16} w={112} h={50} label="Decision x" sub="chosen" />
          <B x={8} y={110} w={112} h={50} label="Execution ε" sub="noise on x" />
          <B x={8} y={204} w={112} h={50} label="Environment w" sub="simulator" />
          <B x={148} y={96} w={92} h={78} label="GP model" sub="kernels" hot />
          <B x={264} y={110} w={88} h={50} label="Next run" sub="acquisition" hot />
          <Wire d="M120 41 C136 41 132 104 146 112" />
          <Wire d="M120 135 L146 135" />
          <Wire d="M120 229 C136 229 132 166 146 158" />
          <Wire d="M240 135 L262 135" hot />
          <Wire d="M308 162 C308 262 64 270 64 256" hot />
        </>
      )}
      {id === "surgical" && (
        <>
          <B x={20} y={14} w={132} h={50} label="Token t" sub="key k, value v" />
          <B x={20} y={108} w={132} h={58} label="Row scope" sub="512 → 16 → 512" hot />
          <B x={214} y={10} w={132} h={50} label="Readout" sub="query q" />
          {[0, 1, 2, 3, 4].map((i) => {
            const open = i !== 1 && i !== 4;
            const y = 84 + i * 29;
            return (
              <g key={i}>
                <rect x={214} y={y} width={132} height={22} rx={5} className={open ? "dg-row dg-row--open" : "dg-row"} />
                <text x={280} y={y + 15.5} textAnchor="middle" className="dg-sub">
                  {open ? "erase, write" : "held"}
                </text>
              </g>
            );
          })}
          <text x={280} y={250} textAnchor="middle" className="dg-label">
            State S
          </text>
          <Wire d="M86 66 L86 104" />
          <Wire d="M152 137 C184 137 184 95 210 95" hot />
          <Wire d="M152 137 C184 137 184 153 210 153" hot />
          <Wire d="M152 137 C184 137 184 182 210 182" hot />
          <Wire d="M280 82 L280 62" />
        </>
      )}
      {id === "clean-architecture" && (
        <>
          <rect x={8} y={8} width={344} height={254} rx={22} className="dg-ring" />
          <rect x={44} y={46} width={272} height={178} rx={18} className="dg-ring" />
          <rect x={80} y={84} width={200} height={102} rx={14} className="dg-ring" />
          <rect x={115} y={112} width={130} height={46} rx={9} className="dg-node dg-node--key" />
          <text x={180} y={140} textAnchor="middle" className="dg-label">Entities</text>
          <text x={180} y={104} textAnchor="middle" className="dg-sub">Use cases</text>
          <text x={180} y={67} textAnchor="middle" className="dg-sub">Interface adapters</text>
          <text x={180} y={30} textAnchor="middle" className="dg-sub">Spring and React</text>
        </>
      )}
      {id === "multimodal" && (
        <>
          <B x={8} y={16} w={100} h={50} label="Tables" sub="as they are" />
          <B x={8} y={110} w={100} h={50} label="PDF text" sub="MiniLM" />
          <B x={8} y={204} w={100} h={50} label="Images" sub="CLIP" />
          <B x={140} y={96} w={104} h={78} label="Ensemble" sub="three views" hot />
          <B x={276} y={110} w={76} h={50} label="Risk" sub="score" />
          <Wire d="M108 41 C126 41 122 104 138 112" />
          <Wire d="M108 135 L138 135" />
          <Wire d="M108 229 C126 229 122 166 138 158" />
          <Wire d="M244 135 L274 135" hot />
        </>
      )}
      {id === "audit" && (
        <>
          <B x={8} y={16} w={112} h={50} label="Quest 3" sub="scan once" />
          <B x={8} y={110} w={112} h={50} label="Two AprilTags" sub="relocalize" />
          <B x={8} y={204} w={112} h={50} label="Spoken notes" sub="each visit" />
          <B x={140} y={96} w={112} h={78} label="3D map" sub="named regions" hot />
          <B x={268} y={110} w={84} h={50} label="Summary" sub="per machine" />
          <Wire d="M120 41 C134 41 128 104 138 112" />
          <Wire d="M120 135 L138 135" />
          <Wire d="M120 229 C134 229 128 166 138 158" />
          <Wire d="M252 135 L266 135" hot />
        </>
      )}
      {id === "case" && (
        <>
          <text x={180} y={150} textAnchor="middle" className="dg-figure">$78M</text>
          <text x={180} y={188} textAnchor="middle" className="dg-sub">market expansion budget</text>
          <rect x={146} y={204} width={68} height={2} className="dg-rule" />
        </>
      )}
    </svg>
  );
}
