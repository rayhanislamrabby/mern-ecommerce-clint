import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { motion } from "framer-motion";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(e.currentTarget);

    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
      <CssBaseline />

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          p: 2,
        }}
      >
        {/* Animation wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: 450,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 3,
              boxShadow:
                "hsla(220, 30%, 5%, 0.08) 0px 10px 25px, hsla(220, 25%, 10%, 0.05) 0px 20px 40px -10px",
            }}
          >
            {/* Title */}
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Please login to continue shopping
            </Typography>

    

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  error={emailError}
                  helperText={emailErrorMessage}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 1 }}>
                <FormLabel>Password</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 1, mb: 2, borderRadius: 2 }}
              >
                Sign in
              </Button>

              <Link
                href="#"
                variant="body2"
                sx={{ display: "block", textAlign: "center" }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Divider>or continue with</Divider>

            {/* Social login */}
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FcGoogle size={22} />}
                sx={{ borderRadius: 2 }}
              >
                Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaFacebookF size={18} color="#1877F2" />}
                sx={{ borderRadius: 2 }}
              >
                Facebook
              </Button>
            </Stack>

            {/* Sign up */}
            <Typography textAlign="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link href="/register" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Card>
        </motion.div>
      </Stack>
    </>
  );
};

export default Login;