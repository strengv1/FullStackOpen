interface ReturnValues {
  periodLength: number;
  trainingDays: number;
  targetAvgHours: number;
  avgTime: number;
  success: boolean;
  rating: number;
  ratingDesc: string;
}

const validateExerciseArgs = (args: string[]): number[] => {
  args = args.slice(2)
  
  // Check if every arg is a number
  if (args.every((value) => !isNaN(Number(value)))) {
    // Map all args to Numbers
    return args.map((value) => Number(value));    
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateExercises = (dailyHours: number[], targetAvgHours: number): ReturnValues => {
  const periodLength = dailyHours.length;
  let trainingDays = 0;
  dailyHours.forEach((val) => {
    if (val > 0) trainingDays += 1
  });

  const sum = dailyHours.reduce((acc, current) => acc + current, 0);
  const avgTime = sum / periodLength;

  const success = targetAvgHours <= avgTime;

  let rating = 0;
  let ratingDesc = '';
  const diff = avgTime - targetAvgHours;
  if (diff > 0.2 ) {
    rating = 3;
    ratingDesc = 'Well done!';
  } else if (diff <= 0.2 && diff >= -0.2){
    rating = 2;
    ratingDesc = 'Could be better, good job nevertheless';
  } else {
    rating = 1;
    ratingDesc = 'What are you even doing..?';
  }

  return {
    periodLength,
    trainingDays,
    targetAvgHours,
    avgTime,
    success,
    rating,
    ratingDesc
  }
}

try {
  const input = validateExerciseArgs(process.argv);
  console.log(calculateExercises(input.slice(1), input[0]));

} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}