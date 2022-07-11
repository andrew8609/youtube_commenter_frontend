import { useMutation } from "@apollo/client";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { passwordReset } from "../../../graphql/mutations/users";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ResetPassword = () => {
  const { token } = useParams();
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");
  const [passReset] = useMutation(passwordReset);
  const [submitting, setSubmitting] = useState(false);

  const OnFinish = async () => {
    setSubmitting(true);
    if (newPass.toString().trim() !== "" && retypeNewPass.toString().trim() !== "") {
      if (newPass === retypeNewPass) {
        try {
          await passReset({ variables: { password: newPass, token } });
          successMessage("Password Changed Successfully");
          setNewPass("");
          setRetypeNewPass("");
          setSubmitting(false);
        } catch (err) {
          setSubmitting(false);
          getError(err.toString());
        }
      } else {
        errorMessage("New Passwords not matched");
      }
    } else {
      errorMessage("All fields required");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="root">
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>Reset Password</h1>
          <br />

          <div>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={OnFinish}
              onFinishFailed={() => {}}
            >
              <Form.Item label="New Password" name="new_password" required requiredMark>
                <Input
                  placeholder="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  type="password"
                  style={{ marginLeft: 50 }}
                  required
                />
              </Form.Item>

              <Form.Item label="Retype Password" name="retype_new_password" required requiredMark>
                <Input
                  placeholder="Retype New Password"
                  value={retypeNewPass}
                  onChange={(e) => setRetypeNewPass(e.target.value)}
                  type="password"
                  style={{ marginLeft: 50 }}
                  required
                />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" disabled={submitting} htmlType="submit">
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </menu>
      </div>
    </div>
  );
};

export default ResetPassword;
