export default function H2({ text, help }) {
  return (
    <div className="row primary rounded elevated bordered overextend">
      <div className="row flex-grow">
        <h2>{text}</h2>
      </div>
      {help && (
        <div
          onClick={help}
          style={{ marginRight: "10px" }}
          className="column clickable hoverable"
        >{`(tutorial)`}</div>
      )}
    </div>
  );
}
