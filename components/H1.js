export default function H1({ text, dark, help }) {
  return (
    <div
      className="row padded rounded"
      style={{
        height: "50px",
        backgroundColor: dark ? "#232323" : "",
        color: dark ? "white" : "black",
      }}
    >
      <div className="row flex-grow">
        <h1 className="column">{text}</h1>
      </div>
      {help && (
        <div
          onClick={help}
          className="big-text column clickable hoverable"
        >{`(tutorial)`}</div>
      )}
    </div>
  );
}
