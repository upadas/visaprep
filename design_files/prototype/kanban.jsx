/* Kanban view — same data, board layout. Drag between columns to update status. */

const Kanban = ({ docs, statuses, setStatus, setCurrent, setView }) => {
  const cols = [
    { id: "todo",      label: "To do" },
    { id: "doing",     label: "In progress" },
    { id: "done",      label: "Done" },
  ];
  const [dragging, setDragging] = React.useState(null);

  const items = (col) => docs.filter(d => {
    const s = statuses[d.id] || "todo";
    return s === col || (col === "todo" && (s === "skipped" || s === "todo"));
  });

  const drop = (col) => {
    if (dragging) {
      setStatus(dragging, col);
      setDragging(null);
    }
  };

  return (
    <section className="kanban fade">
      <div className="kan-head">
        <h3>Application board</h3>
        <div style={{fontSize:13, color:"var(--muted)"}}>Drag cards between columns. Click any card to open it.</div>
      </div>
      <div className="kan-cols">
        {cols.map(c => (
          <div
            key={c.id}
            className="kan-col"
            onDragOver={(e)=>e.preventDefault()}
            onDrop={()=>drop(c.id)}
          >
            <h4>
              <span>{c.label}</span>
              <span className="num">{items(c.id).length}</span>
            </h4>
            {items(c.id).map(d => (
              <div
                key={d.id}
                className="kan-card"
                draggable
                onDragStart={()=>setDragging(d.id)}
                onClick={()=>{
                  const i = docs.findIndex(x => x.id === d.id);
                  setCurrent(i);
                  setView("wizard");
                }}
              >
                <div className="t">{d.title}</div>
                <div className="m">{d.summary}</div>
                <div className="footer">
                  <span className={"dot " + (d.required ? "req" : "rec")} />
                  <span>{d.required ? "Required" : "Recommended"}</span>
                  <span style={{marginLeft:"auto"}}>{d.fileTypes.split(" · ")[0]}</span>
                </div>
              </div>
            ))}
            {items(c.id).length === 0 && (
              <div style={{fontSize:12, color:"var(--muted)", textAlign:"center", padding:"24px 0"}}>
                {c.id === "done" ? "Nothing here yet." : c.id === "doing" ? "Drag a card here when you start working on it." : "All clear!"}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

window.Kanban = Kanban;
