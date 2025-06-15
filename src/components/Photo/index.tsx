import "./Photo.css";

export default function Photo({ photoName }: { photoName: string }) {
  const photoUrl = `/photos/${photoName}.jpg`;

  return <img className="game-photo" draggable={false} src={photoUrl} alt="" />;
}
