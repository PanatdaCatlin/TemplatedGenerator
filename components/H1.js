export default function H1({ text, dark, help }) {
  return (
    <div
      className={`row big-padded rounded outlined elevated ${
        dark ? "primary" : "primary-inverse"
      }`}
      style={{
        height: "50px",
        // backgroundColor: dark ? "#232323" : "",
        // color: dark ? "white" : "black",
      }}
    >
      <h1 className="column flex-grow text-center">{text}</h1>
      {help && (
        <div
          onClick={help}
          className="big-text column clickable hoverable"
        >{`(tutorial)`}</div>
      )}
    </div>
  );
}
