'use client'

import { ActionAreaCard, AuthCheck } from "@/components"
import { Grid2, LinearProgress } from "@mui/material"
import { useState } from "react";

export const FeaturesList = () => {

    const [loading, setLoading] = useState(false);




    return (
        <>
            <AuthCheck onStartImplicitLogin={() => setLoading(true)} onFinishImplicitLogin={() => setLoading(false)} />
            {loading && <LinearProgress color="secondary" />}
            <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ margin: 2 }}>
                <Grid2 size={3}>
                    <ActionAreaCard title="CSV Tool"
                        description="Export time-series telemetry data as CSV format"
                        onAreaClick={() => window.location.assign('/csv')}
                        imageSrc="/csv-icon.svg"
                    />



                </Grid2>

                <Grid2 size={3}>
                    <ActionAreaCard title="Scheduler"
                        description="Scheduler to auto-control the device when scheduled time out."
                        onAreaClick={() => window.location.assign('/scheduler')}
                        imageSrc="/scheduler-icon.svg"
                    />
                </Grid2>

            </Grid2>
        </>
    )
}

