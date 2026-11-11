import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import Google from "assets/images/icons/social-google.svg";
import AnimateButton from "ui-component/extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { register } from "api/auth";
import useGoogleAuth from "hooks/useGoogleAuth";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const navigate = useNavigate();

  const googleHandler = useGoogleAuth(
    (data) => {
      sessionStorage.setItem("userProfile", JSON.stringify(data.user));
      setGoogleError("");
      navigate("/dashboard/default");
    },
    (error) => setGoogleError(error.message),
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("123456");
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant="outlined"
              fullWidth
              onClick={googleHandler}
              size="large"
              sx={{
                color: "grey.700",
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="Google" width={16} height={16} />
              </Box>
              Sign up with Google
            </Button>
          </AnimateButton>
          {googleError && <FormHelperText error>{googleError}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: "center", display: "flex" }}>
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
          <Box sx={{ mt: -4, mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          fname: "",
          lname: "",
          email: "",
          password: "",
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
            await register({
              first_name: values.fname,
              last_name: values.lname,
              email: values.email,
              password: values.password,
            });
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="none"
                  name="fname"
                  type="text"
                  value={values.fname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="none"
                  name="lname"
                  type="text"
                  value={values.lname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email ? errors.email : ""}
                id="outlined-email-register"
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

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                error={Boolean(touched.password && errors.password)}
                helperText={
                  touched.password && errors.password ? errors.password : ""
                }
                id="outlined-password-register"
                label="Password"
                margin="none"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        style={{ backgroundColor: level?.color }}
                        sx={{ width: 85, height: 8, borderRadius: "7px" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            {status?.success && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText>
                  Registration request sent successfully.
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
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;
