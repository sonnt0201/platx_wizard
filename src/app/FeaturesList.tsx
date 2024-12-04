'use client'

import { ActionAreaCard, AuthCheck } from "@/components"
import { Grid2, LinearProgress} from "@mui/material"
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
                        description="csv tool"
                        onAreaClick={() => window.location.replace('/csv')}
                    />

                </Grid2>

            </Grid2>
        </>
    )
}

