import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { Button, DatePicker, Form, Input, Upload } from "antd";
import moment from "moment";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { Redirect } from "react-router-dom";
import validator from "validator";
import { updateUser } from "../../../graphql/mutations/users";
import { getCurrentUser } from "../../../graphql/queries/users";
import { getError } from "../../../utils/error";
import { errorMessage, successMessage } from "../../../utils/message";
import { generateId, getFromStorage } from "../../../utils/storage";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ProfileSettings = () => {
  const { data, error, loading } = useQuery(getCurrentUser());
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [updateUsers, response] = useMutation(updateUser);
  const [submitting, setSubmitting] = useState(false);
  const [imageData, setImageData] = useState({});

  const OnFinish = async () => {
    setSubmitting(true);
    if (name.trim() !== "" && dob.toString().trim() !== "" && email.trim() !== "") {
      if (validator.isEmail(email)) {
        try {
          const update = await updateUsers({
            variables: {
              name,
              dob: moment(dob).format("DD/MM/YYYY").toString(),
              email,
              base64: imageData.base64,
              fileName: imageData.name,
              fileType: imageData.type,
            },
          });
          successMessage("Profile Updated Successfully");
          setImage(update.data.updateUser.profile_image);
          setSubmitting(false);
        } catch (err) {
          console.log(err);
          setSubmitting(false);
          getError(err.toString());
        }
      } else {
        errorMessage("Email not valid");
        setSubmitting(false);
      }
    } else {
      errorMessage("All fields required");
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

  if (!getFromStorage("user_token")) {
    return <Redirect to="/login" />;
  }

  if (!loading && !loadingTemp && data) {
    setName(data.getCurrentUser.name);
    setEmail(data.getCurrentUser.email);
    setDOB(moment(data.getCurrentUser.dob, "DD/MM/YYYY"));
    setImage(data.getCurrentUser.profile_image);
    setLoadingTemp(true);
  }

  return (
    <div>
      <div className="root" style={{ margin: 0 }}>
        <menu style={{ textAlign: "center" }}>
          <h1 style={{ textAlign: "center" }}>Profile Settings</h1>
          {(loading && !data) || loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
          {error ? (
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>{error.message} !</div>
          ) : null}

          {!loading && !loading1 ? (
            <div>
              {image && (
                <>
                  <img src={image} alt="" style={{ height: "100px", borderRadius: "50%" }} />
                  <br />
                  <br />
                </>
              )}
              <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={OnFinish}
                onFinishFailed={() => {}}
              >
                <div style={{ textAlign: "left" }}>
                  <span style={{ color: "red" }}>*</span> Name:
                </div>
                <Input
                  placeholder="Name"
                  value={name}
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <br />
                <br />
                <div style={{ textAlign: "left" }}>
                  <span style={{ color: "red" }}>*</span> Date of Birth:
                </div>
                <DatePicker
                  value={dob}
                  defaultValue={dob}
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
                <Input
                  placeholder="Email"
                  value={email}
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Update
                </Button>
              </Form>
            </div>
          ) : null}
        </menu>
      </div>
    </div>
  );
};

export default ProfileSettings;
