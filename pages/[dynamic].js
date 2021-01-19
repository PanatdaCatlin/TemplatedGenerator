import { useRouter } from "next/router";

export default function Dynamic() {
  const { query } = useRouter();
  return <h1> {query.dynamic} </h1>;
}
