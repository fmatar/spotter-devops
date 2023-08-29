export default async function fetchActs() {
  const data = await fetch("http://localhost:8080/acts");
  return data.json();
}
