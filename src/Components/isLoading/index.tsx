import style from "./style.module.css";
import { CircleSpinner } from "react-spinners-kit";

type Props = {};

const IsLoading = (props: Props) => {
  return (
    <div className={style.isLoading}>
      {" "}
      <CircleSpinner size={20} color={"#c5c5c5"} />
    </div>
  );
};

export default IsLoading;
