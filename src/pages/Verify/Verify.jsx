import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { activateUser } from "../../graphql/mutations/users";

const Verify = () => {
  const [activateAccount] = useMutation(activateUser);
  const [isActivated, setIsActivated] = useState(false);
  const { token } = useParams();

  const activating = async () => {
    try {
      await activateAccount({ variables: { token } });
      setIsActivated(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    activating();
  }, []);

  return <div style={{ textAlign: "center" }}>{isActivated ? "Account activated successfully." : ""}</div>;
};

export default Verify;
