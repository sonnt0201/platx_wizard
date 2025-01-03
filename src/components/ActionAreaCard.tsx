'use client'

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export function ActionAreaCard({ title, description, imageSrc, onAreaClick }: {
    title: string,
    description: string,
    imageSrc?: string
    onAreaClick?: React.MouseEventHandler<HTMLButtonElement>
}) {



    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={onAreaClick}>
               {imageSrc && <CardMedia
                    component="img"
                  
                    
                    image={imageSrc}
                    alt="csv-icon"
                    sx={{
                        height: 200, // Reduced height
                        objectFit: 'contain', // Adjust object-fit to contain the image
                        marginY: 2
                    }}
                />}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                       {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                       {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
