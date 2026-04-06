import logo from "../assets/logo.png"; // put your logo here

export default function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <img src={logo} alt="logo" className="logo" />
        <h2>WiseZar</h2>
      </div>

      <div className="header-right">
        <span>⚙️</span>
      </div>
    </div>
  );
}