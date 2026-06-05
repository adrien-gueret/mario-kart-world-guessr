import "./HomeIcon.css";

type Props = {
  icon: "Play" | "Leaderboards" | "Account" | "Upload" | "Gallery";
};

export default function HomeIcon({ icon }: Props) {
  return <picture className={`home-icon ${icon}`} />;
}
