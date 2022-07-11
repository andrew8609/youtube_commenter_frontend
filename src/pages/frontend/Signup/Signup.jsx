import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, DatePicker, Form, Input, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { Redirect } from "react-router-dom";
import validator from "validator";
import { registerUser } from "../../../graphql/mutations/users";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";
import { generateId, getFromStorage } from "../../../utils/storage";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Signup = () => {
  const [profileImage, setProfileImage] = useState([]);
  const [form] = useForm();
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsers, response] = useMutation(registerUser);
  const [submitting, setSubmitting] = useState(false);
  const [imageData, setImageData] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");

  const OnFinish = async () => {
    setSubmitting(true);
    if (
      name.trim() !== "" &&
      dob.toString().trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== ""
    ) {
      if (validator.isEmail(email)) {
        if (password === confirmPassword) {
          try {
            await registerUsers({
              variables: {
                name,
                dob: moment(dob).format("DD/MM/YYYY").toString(),
                email,
                password,
                is_activated: false,
                is_verified: false,
                base64: imageData.base64,
                fileName: imageData.name,
                fileType: imageData.type,
                role: "user",
              },
            });
            successMessage("User Registered Successfully. Please verify your email which sent by us to your mail.");
            form.resetFields();
            setImage("");
            setImageData({});
            setName("");
            setDOB("");
            setPassword("");
            setConfirmPassword("");
            setEmail("");
            setSubmitting(false);
          } catch (err) {
            setSubmitting(false);
            getError(err.toString());
          }
        } else {
          errorMessage("Password not matched");
          setSubmitting(false);
        }
      } else {
        errorMessage("Email not valid");
        setSubmitting(false);
      }
    } else {
      errorMessage("All * fields required");
      setSubmitting(false);
    }
  };

  const resizeImage = (file, type) => {
    Resizer.imageFileResizer(
      file,
      128,
      128,
      "JPEG",
      100,
      0,
      (uri) => {
        setImageData({ base64: uri, name: generateId(), type });
      },
      "base64",
      128,
      128
    );
  };

  const uploadImage = ({ fileList: newFileList }) => {
    const temp = [];

    if (newFileList.length && newFileList[0].type.split("/")[0] === "image") {
      temp.push({ ...newFileList[0], status: "success" });
      resizeImage(temp[0].originFileObj, temp[0].name.split(".")[temp[0].name.split(".").length - 1]);
      setProfileImage(temp);
    } else {
      setProfileImage([]);
      setImageData({});
    }
  };

  if (getFromStorage("user_token")) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <div className="root" style={{ margin: 0 }}>
        <menu style={{ textAlign: "center" }}>
          <h1 style={{ textAlign: "center" }}>Signup</h1>

          <div>
            <img src={image} alt="" style={{ height: "100px", borderRadius: "50%" }} />
            <br />
            <br />
            <Form {...layout} form={form} name="basic" onFinish={OnFinish} onFinishFailed={() => {}}>
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Name:
              </div>
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Date of Birth:
              </div>
              <DatePicker
                value={dob}
                onChange={(e) => {
                  setDOB(e);
                }}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Email:
              </div>

              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Password:
              </div>
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <br />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span> Confirm Password:
              </div>

              <Input.Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                maxCount={1}
                onChange={uploadImage}
                fileList={profileImage}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 20 }}>
                  Upload Profile Image
                </Button>
              </Upload>
              <br />

              <Button type="primary" disabled={submitting} style={{ width: "100%" }} htmlType="submit">
                Register
              </Button>
            </Form>
          </div>
        </menu>
      </div>
    </div>
  );
};

export default Signup;
