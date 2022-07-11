import { useMutation } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { loginUser, resetPassword } from "../../../graphql/mutations/users";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import { getFromStorage, removeFromStorage, setInStorage } from "../../../utils/storage";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, response] = useMutation(loginUser);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resPass, res] = useMutation(resetPassword);

  const submitLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await login({ variables: { email, password, role: "user" } });
      setInStorage("user_token", data.loginUser.token);
      setInStorage("user_profile", data.loginUser.profile_image);
      setInStorage("user_id", data.loginUser.user_id);
      removeFromStorage("token");
      setSubmitting(false);
      window.location = "/";
    } catch (err) {
      setSubmitting(false);
      getError(err.toString());
    }
  };

  const OnFinish = async () => {
    setSubmitting(true);
    try {
      const res = await resPass({ variables: { email: resetEmail } });

      successMessage("Please check your email for reseting password.");
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      getError(err.toString());
    }
  };

  if (getFromStorage("user_token")) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Modal title="Email" visible={isModalVisible} footer={null} onCancel={() => setIsModalVisible(false)}>
        <Form name="basic" initialValues={{ remember: true }} onFinish={OnFinish} onFinishFailed={() => {}}>
          <Form.Item label="Email" name="email" required requiredMark>
            <Input placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              variant="contained"
              color="primary"
              size="small"
              disabled={submitting}
              style={{ textTransform: "none" }}
              htmlType="submit"
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={submitLogin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={submitting}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" onClick={() => setIsModalVisible(true)} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(Login);
