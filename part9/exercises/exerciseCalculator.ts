interface ReturnValues {
  periodLength: number;
  trainingDays: number;
  targetAvgHours: number;
  avgTime: number;
  success: boolean;
  rating: number;
  ratingDesc: string;
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


console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))