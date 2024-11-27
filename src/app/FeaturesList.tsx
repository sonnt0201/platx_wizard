'use client'

import { ActionAreaCard } from "@/components"
import { Grid2, Paper, Theme } from "@mui/material"

export const FeaturesList = () => {

    return (
        <>
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

