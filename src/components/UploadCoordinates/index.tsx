import "./UploadCoordinates.css";

type Props = {
  x: number;
  y: number;
};

export default function UploadCoordinates({ x, y }: Props) {
  return (
    <div className="upload-coordinates">
      <div>
        <label>X:</label>
        <span>{x}</span>
      </div>
      <div>
        <label>Y:</label>
        <span>{y}</span>
      </div>
    </div>
  );
}
