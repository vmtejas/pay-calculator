import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Slider, Grid, Card } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

function Calculator() {
    const [hourlyRate, setHourlyRate] = useState('');
    const [deductionPercentage, setDeductionPercentage] = useState(20);
    const [weeks, setWeeks] = useState(4);
    const [months, setMonths] = useState(12);
    const [years, setYears] = useState(1);
    const [pay, setPay] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [days, setDays] = useState(null)
    const [dateError, setDateError] = useState("");
    const [payError, setPayError] = useState("");
    const [weeklyHours, setWeeklyHours] = useState(40);


    const calculatePay = () => {
        if (!hourlyRate) {
            setPayError("Please enter a valid hourly rate.");
            return;
        } else {
            setPayError("");
        }

        const hr = parseFloat(hourlyRate);
        const dp = deductionPercentage;
        const w = parseInt(weeks, 10);
        const m = parseInt(months, 10);
        const y = parseInt(years, 10);

        const adjustedHourlyRate = hr * (1 - (dp / 100));
        const weeklyPay = adjustedHourlyRate * weeklyHours;
        const monthlyPay = weeklyPay * w;
        const yearlyPay = monthlyPay * m * y;
        const dailyPay = weeklyPay / 5;

        if (startDate && endDate) {
            const timeDifference = endDate - startDate;
            const days = timeDifference / (1000 * 60 * 60 * 24);
            const weeks = days / 7;
            const monthlyPay = weeklyPay * (weeks / 4);
            const yearlyPay = monthlyPay * (weeks / (4 * 12));
            setPay({ dailyPay, weeklyPay, monthlyPay, yearlyPay });
            setDays(days)
        }
        setPay({ dailyPay, weeklyPay, monthlyPay, yearlyPay });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container component="main" maxWidth="md">
                <Card square={false} elevation={24} sx={{ padding: 3, margin: "1em 0" }}>
                    <Typography variant="h4" align="center" gutterBottom>Pay Calculator</Typography>
                    <Box component="form" width="100%" mt={2}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="hourlyRate"
                            label="Hourly Rate"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                        />
                        <Typography color="error" variant="body2">{payError}</Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="number"
                            id="weeklyHours"
                            label="Weekly Hours"
                            value={weeklyHours}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (value >= 1 && value <= 40) {
                                    setWeeklyHours(value);
                                }
                            }}
                            helperText="Enter weekly hours (between 1 and 40)"
                        />
                        <Typography gutterBottom>Deduction Percentage: {deductionPercentage}%</Typography>
                        <Slider
                            value={deductionPercentage}
                            onChange={(event, newValue) => setDeductionPercentage(newValue)}
                            step={1}
                            marks
                            min={0}
                            max={100}
                            valueLabelDisplay="auto"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="weeks"
                            label="Weeks (default is 4)"
                            name="weeks"
                            value={weeks}
                            onChange={(e) => setWeeks(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="months"
                            label="Months (default is 12)"
                            name="months"
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="years"
                            label="Years (default is 1)"
                            name="years"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                        />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    textField={<TextField variant="outlined" margin="normal" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => {
                                        if (newValue > startDate) {
                                            setEndDate(newValue);
                                            setDateError("");
                                        } else {
                                            setDateError("End date should be greater than the start date.");
                                            setEndDate(null);
                                        }
                                    }}
                                    textField={<TextField variant="outlined" margin="normal" fullWidth />}
                                />
                            </Grid>
                        </Grid>
                        <Typography color="error" variant="body2">{dateError}</Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={calculatePay}>
                            Calculate
                        </Button>

                        <Typography variant="h6" gutterBottom>Calculated Pay:</Typography>
                        <Card elevation={1} square={false} sx={{ padding: 3, margin: "1em 0" }}>
                            {pay && (
                                <Box mt={2}>
                                    <Typography variant="body1">Daily Pay: ${pay.dailyPay.toFixed(2)}</Typography>
                                    <Typography variant="body1">Weekly Pay: ${pay.weeklyPay.toFixed(2)}</Typography>
                                    <Typography variant="body1">Monthly Pay: ${pay.monthlyPay.toFixed(2)}</Typography>
                                    <Typography variant="body1">Yearly Pay: ${pay.yearlyPay.toFixed(2)}</Typography>
                                    {days && <Typography variant="body1">The pay from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()} ({days} days) is ${((days/7.0) * pay.weeklyPay).toFixed(2)}</Typography>}
                                </Box>
                            )}
                        </Card>
                    </Box>
                </Card>
            </Container>
        </LocalizationProvider>
    );
}

export default Calculator;
