export default function H2({ text, help }) {
  return (
    <div className="row lightgrey rounded">
      <div className="row flex-grow">
        <h2>{text}</h2>
      </div>
      {help && (
        <div
          onClick={help}
          style={{ marginRight: "10px" }}
          className="big-text column clickable hoverable"
        >{`( ? )`}</div>
      )}
    </div>
  );
}
