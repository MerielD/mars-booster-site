/* eslint-disable @next/next/no-img-element -- static gateway asset */

export default function LanguageGateway() {
  return (
    <main
      className="gateway"
      style={{ backgroundImage: "url('./assets/ppt/brand-mars-wide.png')" }}
    >
      <img src="./assets/ppt/mars-logo-white.png" alt="Mars Booster" />
      <h1>Mars Booster</h1>
      <div><a href="./zh/">中文</a><a href="./en/">English</a></div>
    </main>
  );
}
