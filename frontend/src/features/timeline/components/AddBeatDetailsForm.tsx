import { Beat, BeatKey } from "@/types";
import { FC, MouseEvent } from "react";
import styles from "./AddBeatDetailsForm.module.css";

type Props = {
  timeRange: string;
  onCreate: (beat: Beat) => void;
  onCancel: () => void;
};

const AddBeatDetailsForm: FC<Props> = ({ timeRange, onCreate, onCancel }) => {
  const handleCreate = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form as HTMLFormElement);
    const formObject: Partial<Beat> = {};
    formData.forEach((value, key) => {
      formObject[key as BeatKey] = value as string;
    });
    formObject.time = timeRange;
    formObject.notes = "";
    onCreate(formObject as Beat);
  };
  return (
    <form onSubmit={handleCreate}>
      <h2 className={styles.header}>Create a beat from: {timeRange}</h2>
      <label>
        Name:
        <input className={styles.input} type="text" name="name" />
      </label>
      <label>
        Camera Angle:
        <input className={styles.input} type="text" name="cameraAngle" />
      </label>
      <label>
        Content:
        <input className={styles.input} name="content" />
      </label>
      <div className={styles.buttonContainer}>
        <button className={styles.secondary} type="reset" onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.primary} type="submit">
          Create
        </button>
      </div>
    </form>
  );
};

export default AddBeatDetailsForm;
