export default function Card({ children }) {
  return (
    <div style={cardStyle}>
      {children}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  marginTop: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};