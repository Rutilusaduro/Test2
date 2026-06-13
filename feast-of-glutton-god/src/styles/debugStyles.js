export const C = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.85)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 300,
  },
  modal: {
    background: "#1a1020", border: "1px solid #8b2252", borderRadius: 12,
    padding: 24, maxWidth: 540, width: "93%", maxHeight: "88vh",
    overflow: "auto", boxShadow: "0 0 60px rgba(139,34,82,0.3)",
  },
  btn: (bg = "#8b2252") => ({
    background: bg, border: "none", color: "#fff", borderRadius: 6,
    padding: "7px 13px", cursor: "pointer", fontSize: 12,
    fontFamily: "inherit", fontWeight: 600,
  }),
  smBtn: {
    background: "rgba(139,34,82,0.35)", border: "1px solid #8b2252",
    color: "#f0c96e", borderRadius: 5, padding: "4px 9px",
    cursor: "pointer", fontSize: 11, fontFamily: "inherit", margin: "2px 2px",
  },
};
