import "./Logo.css";

export type Props = {
  variant?: "default" | "big" | "corner";
};

export default function Logo({ variant }: Props) {
  return (
    <div className={`logo logo-${variant}`}>
      <img src="./ui/logo-mkw.webp" className="mkw" alt="" />
      <img src="./ui/logo-guessr.png" className="guessr" alt="" />
      <h1>Mario Kart World Guessr</h1>
    </div>
  );
}
