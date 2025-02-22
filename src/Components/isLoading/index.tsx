import { CircleSpinner } from "react-spinners-kit";
import style from "./style.module.css";

type Props = {};

const IsLoading = ({}: Props) => {
  return (
    <div className={style.isLoading}>
      {" "}
      <CircleSpinner size={20} color={"#c5c5c5"} />
    </div>
  );
};

export default IsLoading;
