import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../../../components/Layout/AdminLayout";
import { changePassword } from "../../../graphql/mutations/users";
import { getCurrentUser } from "../../../graphql/queries/users";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";
import { getFromStorage } from "../../../utils/storage";
import "../posts/posts.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ChangePassword = () => {
  const { data } = useQuery(getCurrentUser());
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");
  const [updatePassword] = useMutation(changePassword);
  const [submitting, setSubmitting] = useState(false);

  const OnFinish = async () => {
    setSubmitting(true);
    if (
      oldPass.toString().trim() !== "" &&
      newPass.toString().trim() !== "" &&
      retypeNewPass.toString().trim() !== ""
    ) {
      if (newPass === retypeNewPass) {
        try {
          await updatePassword({
            variables: { old_password: oldPass, password: newPass, email: data.getCurrentUser.email },
          });
          successMessage("Password Changed Successfully");
          setOldPass("");
          setNewPass("");
          setRetypeNewPass("");
          setSubmitting(false);
        } catch (err) {
          setSubmitting(false);
          getError(err.toString());
        }
      } else {
        errorMessage("New Passwords not matched");
        setSubmitting(false);
      }
    } else {
      errorMessage("All * fields required");
      setSubmitting(false);
    }
  };

  if (!getFromStorage("token")) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <div>
      <div className="root">
        <Layout />
        <menu style={{ textAlign: "center" }}>
          <br />
          <h1 style={{ textAlign: "center" }}>Change Password</h1>
          <br />

          <div>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={OnFinish}
              onFinishFailed={() => {}}
            >
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Old Password:
              </div>
              <Input.Password
                placeholder="Old Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type="password"
                required
              />
              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> New Password:
              </div>
              <Input.Password
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type="password"
                required
              />
              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Confirm New Password:
              </div>
              <Input.Password
                placeholder="Confirm New Password"
                value={retypeNewPass}
                onChange={(e) => setRetypeNewPass(e.target.value)}
                type="password"
                required
              />
              <br />
              <br />

              <Button type="primary" disabled={submitting} style={{ width: "100%" }} htmlType="submit">
                Update Password
              </Button>
            </Form>
          </div>
        </menu>
      </div>
    </div>
  );
};

export default ChangePassword;
