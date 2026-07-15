import { useState } from "react";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Eye, GraduationCap, Award } from "lucide-react";
import { GROUPS } from "./data/groups";

function shuffleArr(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const LETTERS = ["А", "Б", "В", "Г"];

export default function App() {
  const [gIdx, setGIdx] = useState(0);
  const [tSel, setTSel] = useState({});
  const allTests = GROUPS.flatMap(function(g) { return g.tests; });
  const [progress, setProgress] = useState(function() {
    const o = {};
    allTests.forEach(function(t) { o[t.id] = { order: t.questions.map(function(_, k) { return k; }), current: 0, answers: {}, shuffled: false }; });
    return o;
  });

  const group = GROUPS[gIdx];
  const tIdx = Math.min(tSel[gIdx] || 0, Math.max(group.tests.length - 1, 0));
  const test = group.tests[tIdx];
  const st = (test && progress[test.id]) || { order: [], current: 0, answers: {}, shuffled: false };
  const order = st.order;
  const qIndex = order[st.current];
  const q = test ? test.questions[qIndex] : null;
  const ans = test ? st.answers[qIndex] : null;

  const setSt = function(upd) { setProgress(function(p) { return Object.assign({}, p, { [test.id]: upd(p[test.id]) }); }); };
  const setTest = function(i) { setTSel(function(s) { return Object.assign({}, s, { [gIdx]: i }); }); };
  const answerMc = function(i) { if (ans) return; setSt(function(s) { return Object.assign({}, s, { answers: Object.assign({}, s.answers, { [qIndex]: { given: i } }) }); }); };
  const answerTf = function(v) { if (ans) return; setSt(function(s) { return Object.assign({}, s, { answers: Object.assign({}, s.answers, { [qIndex]: { given: v } }) }); }); };
  const reveal = function() { setSt(function(s) { return Object.assign({}, s, { answers: Object.assign({}, s.answers, { [qIndex]: { revealed: true, grade: null } }) }); }); };
  const grade = function(g) { setSt(function(s) { return Object.assign({}, s, { answers: Object.assign({}, s.answers, { [qIndex]: { revealed: true, grade: g } }) }); }); };
  const go = function(d) { setSt(function(s) { return Object.assign({}, s, { current: Math.min(Math.max(s.current + d, 0), order.length - 1) }); }); };
  const jump = function(i) { setSt(function(s) { return Object.assign({}, s, { current: i }); }); };
  const reset = function(shuf) { setSt(function() { return { order: shuf ? shuffleArr(test.questions.map(function(_, k) { return k; })) : test.questions.map(function(_, k) { return k; }), current: 0, answers: {}, shuffled: !!shuf }; }); };

  let correct = 0, answered = 0;
  if (test) test.questions.forEach(function(qq, k) {
    const a = st.answers[k];
    if (!a) return;
    if (qq.type === "open") { if (a.grade) { answered++; if (a.grade === "correct") correct++; } }
    else { answered++; if (a.given === qq.correct) correct++; }
  });

  const total = test ? test.questions.length : 0;
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const allDone = test && answered === total;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <GraduationCap size={22} color="#4f46e5" />
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Тренажёр «Студенческий лидер»</h1>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, marginTop: 2 }}>Банк вопросов по группам НПА · автопроверка</p>

        <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Группы</div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
          {GROUPS.map(function(g, i) {
            return (
              <button key={g.id} onClick={function() { setGIdx(i); }} style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1px solid",
                background: i === gIdx ? "#4f46e5" : "#fff",
                color: i === gIdx ? "#fff" : "#475569",
                borderColor: i === gIdx ? "#4f46e5" : "#e2e8f0",
              }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, background: i === gIdx ? "rgba(255,255,255,0.2)" : "#f1f5f9", color: i === gIdx ? "#fff" : "#64748b" }}>{g.n}</span>
                {g.short}
                <span style={{ fontSize: 11, color: i === gIdx ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>· {g.tests.length}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, marginBottom: 8 }}>{group.title}</div>

        {group.tests.length > 0 && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
            {group.tests.map(function(t, i) {
              return (
                <button key={t.id} onClick={function() { setTest(i); }} style={{
                  flexShrink: 0, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "1px solid",
                  background: i === tIdx ? "#1e293b" : "#fff",
                  color: i === tIdx ? "#fff" : "#64748b",
                  borderColor: i === tIdx ? "#1e293b" : "#e2e8f0",
                }}>{t.title}</button>
              );
            })}
          </div>
        )}

        {!test && (
          <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #cbd5e1", padding: "40px 24px", textAlign: "center", marginTop: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 600, color: "#374151", marginBottom: 6 }}>В этой группе пока нет тестов</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Пришли документ из категории «{group.short}» — добавлю вопросы сюда.</div>
          </div>
        )}

        {test && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginTop: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{test.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{test.subtitle}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Верно: <b style={{ color: "#059669" }}>{correct}</b> / {answered} <span style={{ color: "#cbd5e1" }}>из {total}</span></span>
                    {answered > 0 && <span style={{ fontWeight: 600, color: pct >= 70 ? "#059669" : pct >= 40 ? "#d97706" : "#dc2626" }}>{pct}%</span>}
                  </div>
                </div>
                <div style={{ marginTop: 10, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#6366f1", borderRadius: 99, width: (total ? ((st.current + 1) / total * 100) : 0) + "%", transition: "width 0.3s" }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>Вопрос {st.current + 1} из {total}</div>
              </div>

              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.5, marginBottom: 16 }}>{q.q}</div>

                {q.type === "mc" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map(function(opt, i) {
                      const chosen = ans && ans.given === i, isCorrect = i === q.correct;
                      let bg = "#fff", border = "#e2e8f0", col = "#374151";
                      if (ans) {
                        if (isCorrect) { bg = "#f0fdf4"; border = "#4ade80"; }
                        else if (chosen) { bg = "#fef2f2"; border = "#f87171"; }
                        else { bg = "#fafafa"; col = "#9ca3af"; }
                      }
                      return (
                        <button key={i} onClick={function() { answerMc(i); }} disabled={!!ans} style={{
                          width: "100%", textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start",
                          padding: "10px 14px", borderRadius: 10, border: "1px solid " + border,
                          background: bg, cursor: ans ? "default" : "pointer", transition: "all 0.15s",
                        }}>
                          <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 6, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, background: ans && isCorrect ? "#22c55e" : ans && chosen ? "#ef4444" : "#f1f5f9", color: ans && (isCorrect || chosen) ? "#fff" : "#64748b" }}>{LETTERS[i]}</span>
                          <span style={{ fontSize: 14, color: col, paddingTop: 2, flex: 1 }}>{opt}</span>
                          {ans && isCorrect && <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0 }} />}
                          {ans && chosen && !isCorrect && <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "tf" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[true, false].map(function(val) {
                        const chosen = ans && ans.given === val, isCorrect = val === q.correct;
                        let bg = "#fff", border = "#e2e8f0", col = "#374151";
                        if (ans) {
                          if (isCorrect) { bg = "#f0fdf4"; border = "#4ade80"; col = "#166534"; }
                          else if (chosen) { bg = "#fef2f2"; border = "#f87171"; col = "#991b1b"; }
                          else { bg = "#fafafa"; col = "#9ca3af"; }
                        }
                        return (
                          <button key={String(val)} onClick={function() { answerTf(val); }} disabled={!!ans} style={{
                            padding: "14px", borderRadius: 10, border: "1px solid " + border,
                            background: bg, fontWeight: 600, fontSize: 15, color: col,
                            cursor: ans ? "default" : "pointer", transition: "all 0.15s",
                          }}>{val ? "Да ✓" : "Нет ✗"}</button>
                        );
                      })}
                    </div>
                    {ans && q.note && (
                      <div style={{ marginTop: 10, fontSize: 13, borderRadius: 10, padding: "10px 14px", background: ans.given === q.correct ? "#f0fdf4" : "#fef2f2", color: ans.given === q.correct ? "#166534" : "#991b1b" }}>{q.note}</div>
                    )}
                  </div>
                )}

                {q.type === "open" && (
                  <div>
                    {!ans || !ans.revealed ? (
                      <button onClick={reveal} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "#4f46e5", color: "#fff", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer" }}>
                        <Eye size={16} /> Показать ответ
                      </button>
                    ) : (
                      <div>
                        <div style={{ borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", color: "#1e293b" }}>
                          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", marginBottom: 4 }}>Ответ</div>
                          <div style={{ fontSize: 14, lineHeight: 1.6 }}>{q.answer}</div>
                        </div>
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "#64748b" }}>Как у тебя?</span>
                          <button onClick={function() { grade("correct"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid " + (ans.grade === "correct" ? "#22c55e" : "#bbf7d0"), background: ans.grade === "correct" ? "#22c55e" : "#fff", color: ans.grade === "correct" ? "#fff" : "#16a34a", cursor: "pointer" }}>
                            <CheckCircle2 size={15} /> Знал
                          </button>
                          <button onClick={function() { grade("wrong"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid " + (ans.grade === "wrong" ? "#ef4444" : "#fecaca"), background: ans.grade === "wrong" ? "#ef4444" : "#fff", color: ans.grade === "wrong" ? "#fff" : "#dc2626", cursor: "pointer" }}>
                            <XCircle size={15} /> Не знал
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ padding: "10px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <button onClick={function() { go(-1); }} disabled={st.current === 0} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", borderRadius: 8, fontSize: 13, color: "#475569", background: "none", border: "1px solid #e2e8f0", cursor: st.current === 0 ? "not-allowed" : "pointer", opacity: st.current === 0 ? 0.4 : 1 }}>
                  <ChevronLeft size={15} /> Назад
                </button>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={function() { reset(false); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 10px", borderRadius: 8, fontSize: 12, color: "#64748b", background: "none", border: "1px solid #e2e8f0", cursor: "pointer" }}>
                    <RotateCcw size={13} /> Заново
                  </button>
                  <button onClick={function() { reset(true); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 10px", borderRadius: 8, fontSize: 12, color: "#64748b", background: "none", border: "1px solid #e2e8f0", cursor: "pointer" }}>
                    <Shuffle size={13} /> Перемешать
                  </button>
                </div>
                <button onClick={function() { go(1); }} disabled={st.current === total - 1} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", borderRadius: 8, fontSize: 13, color: "#475569", background: "none", border: "1px solid #e2e8f0", cursor: st.current === total - 1 ? "not-allowed" : "pointer", opacity: st.current === total - 1 ? 0.4 : 1 }}>
                  Далее <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {allDone && (
              <div style={{ marginTop: 14, borderRadius: 14, border: "1px solid #c7d2fe", background: "#eef2ff", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <Award size={30} color="#4f46e5" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: "#3730a3" }}>Набор пройден!</div>
                  <div style={{ fontSize: 13, color: "#4338ca" }}>Результат: {correct} из {total} ({pct}%). Можно сбросить или перемешать вопросы.</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {order.map(function(qi, i) {
                const a = st.answers[qi], qq = test.questions[qi];
                let bg = "#fff", border = "#e2e8f0", col = "#94a3b8";
                if (a) {
                  if (qq.type === "open") {
                    if (a.grade === "correct") { bg = "#22c55e"; border = "#22c55e"; col = "#fff"; }
                    else if (a.grade === "wrong") { bg = "#ef4444"; border = "#ef4444"; col = "#fff"; }
                    else { bg = "#94a3b8"; border = "#94a3b8"; col = "#fff"; }
                  } else {
                    if (a.given === qq.correct) { bg = "#22c55e"; border = "#22c55e"; col = "#fff"; }
                    else { bg = "#ef4444"; border = "#ef4444"; col = "#fff"; }
                  }
                }
                return (
                  <button key={i} onClick={function() { jump(i); }} style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid " + border, background: bg, color: col,
                    fontSize: 11, fontWeight: 500, cursor: "pointer",
                    outline: i === st.current ? "2px solid #6366f1" : "none", outlineOffset: 2,
                  }}>{i + 1}</button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
