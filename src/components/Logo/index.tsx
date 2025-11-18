import "./Logo.css";

type Props = {
  isBig?: boolean;
};

export default function Logo({ isBig }: Props) {
  return (
    <div className={`logo${isBig ? " is-big" : ""}`}>
      <img src="./ui/logo-mkw.webp" className="mkw" alt="" />
      <img src="./ui/logo-guessr.png" className="guessr" alt="" />
      <h1>Mario Kart World Guessr</h1>
    </div>
  );
}
