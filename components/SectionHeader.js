export default function SectionHeader({ text, dark }) {
  return (
    <div
      className="row padded rounded elevated"
      style={{ height: "50px", backgroundColor:dark?'#232323':'' }}
    >
      <h1 className="column" style={{color:dark?'white':'black'}}>{text}</h1>
      
    </div>
  );
}
