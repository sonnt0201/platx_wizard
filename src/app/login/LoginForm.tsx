'use client'

import { ThemeProvider } from "@emotion/react"
import { Alert, Button, createTheme, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material"
import { themeConstant } from "../theme"
import axios from "axios"
import { useEffect, useState } from "react"

import { UserConstants } from "@/constants"
import { Auth } from "@/models/client"


export const LoginForm = () => {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>();
  
    const login = async () => {

        setLoading(true);

        if (email && password) {

            const result = await Auth.login(email, password);

            console.log(result);

            setError(result.error ? new Error("Wrong email or password, check again.") : undefined);

            if (Auth.state.username) {
                window.location.replace("/");
            }

        } else {
            setError(new Error("Wrong input format."))
        }

        setLoading(false)

    }


    return <ThemeProvider theme={createTheme(themeConstant)}>
        {loading && <LinearProgress color="primary" />}
        {/* <Stack direction={"row"} spacing={2}> */}
        <Paper elevation={3} className="m-auto my-10 py-5 px-10 w-5/12 h-10/12 text-center" >
            <Stack direction={"column"} spacing={4} >
                <h1 className="font-extrabold text-3xl  text-violet-900" >
                    IoT Platform
                </h1>
                <h1>Sign in with your Thingsboard Lab's server account</h1>
                <TextField
                    required
                    id="outlined-required"
                    label="Email"

                    type="email"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value.toString())}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            login();
                    }}

                    disabled={loading}

                />

                <TextField
                    required
                    id="outlined-required"
                    label="Password"

                    type="password"
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value.toString())}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            login();
                    }}

                    disabled={loading}
                />


                {error && <Alert variant="outlined" severity="error">
                    {error.message}
                </Alert>}

                <Button variant="contained" 
                size="large" 
                color="secondary" 
                onClick={login}
                disabled={loading}
                >

                    LOGIN to platform
                </Button>


            </Stack>

        </Paper>
        {/* </Stack> */}

    </ThemeProvider>
}