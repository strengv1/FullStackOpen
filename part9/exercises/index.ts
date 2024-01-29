import express from 'express';
import { calculateBmi } from './bmiCalculator'; 
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'parameters missing'});
  }

  const exercises = daily_exercises as string[];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  if (!exercises.every((value: string) => !isNaN(Number(value)))) {
    return res.status(400).send({ error: 'malformatted parameters'});  
  }
  if ( !target || isNaN(Number(target)) ) {
    return res.status(400).send({ error: 'malformatted parameters'});
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const numExcercises: number[] = exercises.map((value: string) => Number(value));
  const result = calculateExercises(numExcercises, Number(target));
  return res.send({ result });
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const bmi = calculateBmi(height, weight);

  res.json({ height, weight, bmi });
});



const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});