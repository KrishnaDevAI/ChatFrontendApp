import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "@remix-run/react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import Google from "assets/images/icons/social-google.svg";
import AnimateButton from "ui-component/extended/AnimateButton";
import { login } from "api/auth";
import useGoogleAuth from "hooks/useGoogleAuth";
import { showLoginSuccess } from "utils/alerts";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const googleHandler = useGoogleAuth(
    async (data) => {
      sessionStorage.setItem("userProfile", JSON.stringify(data.user));
      await showLoginSuccess(data.user);
      navigate("/dashboard/default");
    },
    (error) => console.error(error),
  );

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: "grey.700",
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="Google" width={16} height={16} />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Button
              variant="outlined"
              sx={{
                cursor: "unset",
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2, mt: -1 }}>
            <Typography variant="subtitle1">
              Sign in with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "krishna04kanhaiya@gmail.com",
          password: "123456",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const data = await login({
              email: values.email,
              password: values.password,
            });
            sessionStorage.setItem("userProfile", JSON.stringify(data.user));
            await showLoginSuccess(data.user);
            navigate("/dashboard/default");
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          status,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email ? errors.email : ""}
                  id="outlined-email-login"
                  label="Email Address / Username"
                  margin="none"
                  name="email"
                  type="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  helperText={
                    touched.password && errors.password ? errors.password : ""
                  }
                  id="outlined-password-login"
                  label="Password"
                  margin="none"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            {status?.success && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText>
                  Login request sent successfully.
                </FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
