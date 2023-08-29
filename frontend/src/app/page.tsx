import fetchActs from "@/api/acts";
import styles from "./page.module.css";
import Timeline from "@/features/timeline";
import { Act } from "@/types";

export default async function Home() {
  const acts = await fetchActs();
  return (
    <main className={styles.main}>
      <ul>
        {acts.map((act: Act) => (
          <Timeline actId={act.id} key={act.id} title={act.name} />
        ))}
      </ul>
    </main>
  );
}
